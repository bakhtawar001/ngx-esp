import { Injectable } from '@angular/core';
import { CosAnalyticsService, TrackEvent } from '@cosmos/analytics';
import { ToastActions, ToastData } from '@cosmos/components/notification';
import { AlgoliaService } from '@cosmos/core';
import {
  EntityStateModel,
  ModelWithLoadingStatus,
  optimisticUpdate,
  setEntityStateItem,
  syncLoadProgress,
} from '@cosmos/state';
import { SearchCriteria } from '@esp/models';
import {
  CollectionArchivedEvent,
  CollectionDeleteEvent,
  CollectionTransferredEvent,
} from '@esp/products';
import { Navigate } from '@ngxs/router-plugin';
import { Action, State, StateContext } from '@ngxs/store';
import { EMPTY } from 'rxjs';
import { catchError, mergeMap, tap } from 'rxjs/operators';
import {
  CollectionsActions,
  CollectionSearchActions,
  RecentCollectionsActions,
} from '../actions';
import { Collection } from '../models';
import { CollectionsService } from '../services/collections.service';

const ACCEPTABLE_CACHE_SIZE = 5 as const;

const TOAST_MESSAGES = {
  COLLECTION_ACTIVE: (collection: Collection): ToastData => ({
    title: `Collection ${collection.Name} is Active!`,
    body: `${collection.Name} has been made active.`,
    type: 'confirm',
  }),
  COLLECTION_ARCHIVED: (collection: Collection): ToastData => ({
    title: `Collection ${collection.Name} Archived!`,
    body: `You may still access ${collection.Name} for your list of archived collections!`,
    type: 'confirm',
  }),
  COLLECTION_TRANSFERRED: (collection: Collection): ToastData => {
    const owner = collection.Collaborators!.find(
      (user) => user.UserId === collection.OwnerId
    )!;

    return {
      title: 'Ownership Transferred!',
      body: `Ownership has been transferred to ${owner.Name}`,
      type: 'confirm',
    };
  },
  COLLECTION_NOT_ACTIVATED: (collection: Collection): ToastData => ({
    title: `Error activating collection!`,
    body: `There was an error activating ${collection.Name}`,
    type: 'error',
  }),
  COLLECTION_NOT_ARCHIVED: (collection: Collection): ToastData => ({
    title: 'Error archiving collection!',
    body: `There was an error archiving ${collection.Name}`,
    type: 'error',
  }),
  COLLECTION_NOT_TRANSFERRED: (collection: Collection): ToastData => ({
    title: 'Error: Ownership Not Transferred!',
    body: `Ownership of ${collection.Name} was unable to be transferred!`,
    type: 'error',
  }),
};

export interface CollectionsStateModel
  extends ModelWithLoadingStatus,
    EntityStateModel<Collection> {
  criteria?: SearchCriteria;
  total: number;
}

type LocalStateContext = StateContext<CollectionsStateModel>;

const defaultState = (): CollectionsStateModel => ({
  total: 0,
  items: {},
  itemIds: [],
});

@State<CollectionsStateModel>({
  name: 'collections',
  defaults: defaultState(),
})
@Injectable()
export class CollectionsState {
  constructor(
    private readonly service: CollectionsService,
    private readonly analytics: CosAnalyticsService,
    private readonly algoliaService: AlgoliaService
  ) {}

  @Action(CollectionsActions.Delete)
  delete(ctx: LocalStateContext, { collection }: CollectionsActions.Delete) {
    return this.service.delete(collection.Id!).pipe(
      tap(() => {
        ctx.dispatch([
          new RecentCollectionsActions.Get(),
          new CollectionSearchActions.RemoveItem(collection.Id),
          new ToastActions.Show({
            title: 'Success!',
            body: `${collection.Name} has been deleted.`,
            type: 'confirm',
          }),
        ]);

        this.captureCollectionDeleteEvent(collection);
      }),
      mergeMap(() => {
        const state = ctx.getState();

        if (state.currentId === collection.Id) {
          ctx.patchState({ currentId: null });

          return ctx.dispatch(new Navigate(['/collections']));
        }

        return EMPTY;
      }),
      catchError(() => {
        ctx.dispatch(
          new ToastActions.Show({
            title: 'Error!',
            body: `${collection.Name} was not deleted.`,
            type: 'error',
          })
        );

        return EMPTY;
      })
    );
  }

  @Action(CollectionsActions.Get)
  get(ctx: LocalStateContext, { id }: CollectionsActions.Get) {
    ctx.patchState({ currentId: id });

    return this.service.get(id).pipe(
      tap((collection) => {
        if (!collection.IsVisible) {
          ctx.dispatch(new Navigate(['/collections']));
          return;
        }

        ctx.setState(
          setEntityStateItem(id, collection, {
            cacheSize: ACCEPTABLE_CACHE_SIZE,
          })
        );

        ctx.dispatch(new RecentCollectionsActions.Get());
      }),
      syncLoadProgress(ctx)
    );
  }

  @Action(CollectionsActions.Save)
  save(ctx: LocalStateContext, { payload }: CollectionsActions.Save) {
    return this.service.save(payload).pipe(
      optimisticUpdate<Collection>(payload, {
        getValue: () => ctx.getState().items[payload.Id],
        setValue: (updatedCollection: Collection) =>
          ctx.setState(
            setEntityStateItem(updatedCollection.Id, updatedCollection)
          ),
      }),
      tap((collection) => {
        if (!collection.IsVisible) {
          ctx.patchState({ currentId: null });
          ctx.dispatch(new Navigate(['/collections']));
        }
      }),
      tap(() => ctx.dispatch(new RecentCollectionsActions.Get()))
    );
  }

  @Action(CollectionsActions.SaveStatus)
  saveStatus(
    ctx: LocalStateContext,
    { payload, status }: CollectionsActions.SaveStatus
  ) {
    return this.service.updateStatus(payload.Id!, status).pipe(
      tap((collection) => {
        const state = ctx.getState();

        if (state.currentId === collection.Id) {
          ctx.setState(setEntityStateItem(collection.Id, collection));
        }
      }),
      tap((collection) => {
        const message =
          TOAST_MESSAGES[
            <keyof typeof TOAST_MESSAGES>`COLLECTION_${status.toUpperCase()}`
          ](collection);

        ctx.dispatch(new ToastActions.Show(message));

        if (status === 'Archived') {
          this.captureCollectionArchivedEvent(collection);
        }
      }),
      tap(() => ctx.dispatch(new RecentCollectionsActions.Get())),
      catchError(() => {
        const message =
          TOAST_MESSAGES[
            <keyof typeof TOAST_MESSAGES>(
              `COLLECTION_NOT_${status.toUpperCase()}`
            )
          ](payload);

        ctx.dispatch(new ToastActions.Show(message));

        return EMPTY;
      })
    );
  }

  @Action(CollectionsActions.SearchIndexOperationComplete)
  searchIndexOperationComplete(
    ctx: LocalStateContext,
    event: CollectionsActions.SearchIndexOperationComplete
  ) {
    ctx.dispatch(new RecentCollectionsActions.Get());
  }

  @Action(CollectionsActions.TransferOwner)
  transferOwner(
    ctx: LocalStateContext,
    { payload, ownerId }: CollectionsActions.TransferOwner
  ) {
    return this.service.transferOwner(payload.Id!, ownerId).pipe(
      mergeMap((collection) => {
        const state = ctx.getState();

        // Always show the transferred message and update Recents
        this.showCollectionTransferredMessage(ctx, collection);
        ctx.dispatch(new RecentCollectionsActions.Get());
        this.captureCollectionTransferredEvent(collection, ownerId);

        if (state.currentId !== collection.Id) {
          return EMPTY;
        }

        // The below flow is a bit overcomplicated, but I'll try to leave comments to describe the flow.

        // 1) A collection might be transferred to another user, but it might have different collaborators.
        // If it can be collaborated (edited and viewed) only by the owner, this collection will be invisible (go to #2).
        if (collection.IsVisible) {
          ctx.setState(setEntityStateItem(collection.Id, collection));
          return EMPTY;
        } else {
          // 2) If this collection became invisible for us, then it should be synchronized within the Algolia database.
          // We can't navigate to `/collections` page immediately because it'll show the old list of collections for us.
          // We should wait until the Algolia database is synchronized; thus, it'll return up-to-date collections for us.
          // Otherwise, the user will notice flickering:
          // * the page will be navigated to `/collections`
          // * the user will see, for instance, 2 collections (tho one of the collections became invisible for us since we transferred the ownership)
          // * our long-polling will wait until Algolia is synchronized and will dispatch the `SearchIndexOperationComplete` action
          // * `collection-search.page.ts` listens for that action and will run `search()` again
          // * the user will see the loading skeleton, and only then he/she will see up-to-date collections
          return this.algoliaService
            .waitUntilAlgoliaIsSynchronized(
              CollectionsActions.SearchIndexOperationComplete
            )
            .pipe(
              tap(() => {
                // We should set the `currentId` to `null` after indexes are synchrononized, since this may lead
                // to UI bugs. For instance, there's a listener for the `currentId` which will run collections search
                // whenever it changes. This might run search before the user is navigated to `/collections`.
                ctx.patchState({ currentId: null });

                ctx.dispatch([
                  new RecentCollectionsActions.Get(),
                  new Navigate(['/collections']),
                ]);
              })
            );
        }
      }),
      catchError(() => {
        const message = TOAST_MESSAGES.COLLECTION_NOT_TRANSFERRED(payload);
        ctx.dispatch(new ToastActions.Show(message));
        return EMPTY;
      })
    );
  }

  private showCollectionTransferredMessage(
    ctx: LocalStateContext,
    collection: Collection
  ): void {
    const message = TOAST_MESSAGES.COLLECTION_TRANSFERRED(collection);
    ctx.dispatch(new ToastActions.Show(message));
  }

  private captureCollectionArchivedEvent(collection: Collection): void {
    const event: TrackEvent<CollectionArchivedEvent> = {
      action: 'Collection Archived',
      properties: {
        id: collection.Id,
        name: collection.Name,
      },
    };
    this.analytics.track(event);
  }

  private captureCollectionDeleteEvent(collection: Collection): void {
    const event: TrackEvent<CollectionDeleteEvent> = {
      action: 'Collection Deleted',
      properties: {
        id: collection.Id,
        name: collection.Name,
      },
    };
    this.analytics.track(event);
  }

  private captureCollectionTransferredEvent(
    collection: Collection,
    userId: number
  ): void {
    const event: TrackEvent<CollectionTransferredEvent> = {
      action: 'Collection Transferred',
      properties: {
        id: collection.Id,
        name: collection.Name,
        userId: userId,
      },
    };
    this.analytics.track(event);
  }
}
