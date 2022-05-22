import { Injectable } from '@angular/core';
import { CosAnalyticsService, TrackEvent } from '@cosmos/analytics';
import { CosToastService } from '@cosmos/components/notification';
import { DialogService } from '@cosmos/core';
import type {
  AddProductsResponse,
  Collection,
  CollectionProduct,
  CollectionSearch,
} from '@esp/collections';
import {
  CollectionsService,
  RecentCollectionsActions,
  SearchCriteria,
} from '@esp/collections';
import { CollectionCreateEvent } from '@esp/products';
import { Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { addToCollectionDialogDef } from '../dialogs/add-to-collection';
import {
  CreateCollectionDialogData,
  createCollectionDialogDef,
} from '../dialogs/create-collection';

const TOAST_MESSAGES = {
  COLLECTION_COPIED: (collection) => ({
    title: 'Success: Collection copied',
    body: `Collection ${collection.Name} was copied`,
  }),
  COLLECTION_CREATED: (collection) => ({
    title: 'Success: Collection created!',
    body: `Your collection ${collection.Name} has been created.`,
  }),
  COLLECTION_NOT_COPIED: (collection) => ({
    title: 'Error: Collection not copied',
    body: `Collection ${collection.Name} was not able to be copied`,
  }),
  COLLECTION_NOT_CREATED: () => ({
    title: 'Error: Collection not created!',
    body: `Your collection was not able to be created.`,
  }),
};

@Injectable({
  providedIn: 'root',
})
export class CollectionsDialogService {
  constructor(
    private readonly _store: Store,
    private readonly _dialog: DialogService,
    private readonly _collections: CollectionsService,
    private _toastService: CosToastService,
    private readonly _analytics: CosAnalyticsService
  ) {}

  addToCollection(
    products: CollectionProduct[],
    currentCollectionId?: number
  ): Observable<AddProductsResponse> {
    return this._collections
      .query<CollectionSearch>(
        new SearchCriteria({
          from: 1,
          size: 1,
          excludeList: currentCollectionId?.toString(),
          status: 'Active',
          editOnly: true,
        })
      )
      .pipe(
        switchMap((collections) => {
          if (collections.ResultsTotal > 0) {
            return this.openAddDialog(products, currentCollectionId);
          }

          return this.openCreateDialog({ products }).pipe(
            map((Collection) => ({
              Collection,
              ProductsDuplicated: [],
              ProductsTruncated: [],
            }))
          );
        })
      );
  }

  openAddDialog(
    products: CollectionProduct[],
    currentCollectionId?: number
  ): Observable<AddProductsResponse> {
    return this._dialog
      .open(addToCollectionDialogDef, { currentCollectionId })
      .pipe(
        filter((res) => !!res),
        switchMap((res: string | Collection) => {
          if (res === 'create') {
            return this.openCreateDialog({ products }).pipe(
              map((Collection) => ({
                Collection,
                ProductsDuplicated: [],
                ProductsTruncated: [],
              }))
            );
          }

          const collection = res as Collection;
          return this._collections.addProducts(collection.Id, products).pipe(
            tap(() => this._store.dispatch(new RecentCollectionsActions.Get())),
            tap((result) => {
              // eslint-disable-next-line no-prototype-builtins
              if (result.hasOwnProperty('error')) {
                this._toastService.error(
                  'Error: Products not added',
                  `${products.length} product(s) were unable to be added to ${result.Collection?.Name}!`
                );
              } else if (result.ProductsTruncated.length > 0) {
                this._toastService.error(
                  'Error: Too many products',
                  `${result.ProductsTruncated.length} product(s) were unable to be added. 250 product per collection limit reached.`
                );
              } else if (result.ProductsDuplicated.length > 0) {
                this._toastService.error(
                  'Error: Products not added!',
                  `${result.ProductsDuplicated.length} product(s) already exist in ${result.Collection?.Name}!`
                );
              } else if (result.ProductsDuplicated.length === 0) {
                this._toastService.success(
                  'Products added successfully',
                  `${products.length} product(s) added to ${result.Collection?.Name}!`
                );
              }
            })
          );
        })
      );
  }

  openCreateDialog(
    data: CreateCollectionDialogData,
    skipToasts?: boolean
  ): Observable<Collection> {
    const collection = data?.collection;

    return this._dialog.open(createCollectionDialogDef, data).pipe(
      filter((res) => !!res),
      switchMap((res) => {
        if (collection) {
          return this._collections.copy(collection.Id, res).pipe(
            tap((resp) => {
              this.captureCollectionCreateEvent(resp, collection.Id);
            })
          );
        }

        return this._collections
          .create({
            ...res,
            Products: data?.products,
          })
          .pipe(
            tap((resp) => {
              this.captureCollectionCreateEvent(resp);
            })
          );
      }),
      tap(() => this._store.dispatch(new RecentCollectionsActions.Get())),
      tap((result) => {
        if (result && !skipToasts) {
          const message = collection
            ? TOAST_MESSAGES.COLLECTION_COPIED(collection)
            : TOAST_MESSAGES.COLLECTION_CREATED(result);

          this._toastService.success(message.title, message.body);
        }
      }),
      catchError(() => {
        if (!skipToasts) {
          const message = collection
            ? TOAST_MESSAGES.COLLECTION_NOT_COPIED(collection)
            : TOAST_MESSAGES.COLLECTION_NOT_CREATED();

          this._toastService.error(message.title, message.body);
        }

        return of(null);
      })
    );
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------
  private captureCollectionCreateEvent(
    collection: Collection,
    sourceCollectionId?: number
  ): void {
    const collectionCreateEvent: TrackEvent<CollectionCreateEvent> = {
      action: 'Collection Created',
      properties: {
        id: collection.Id,
        name: collection.Name,
        source: sourceCollectionId ? { id: sourceCollectionId } : undefined,
      },
    };
    this._analytics.track(collectionCreateEvent);
  }
}
