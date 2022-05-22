import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  NgModule,
  ɵmarkDirty as markDirty,
} from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterModule } from '@angular/router';
import {
  CosAnalyticsService,
  CosHoverEventModule,
  TrackEvent,
} from '@cosmos/analytics';
import { CosActionBarModule } from '@cosmos/components/action-bar';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCheckboxModule } from '@cosmos/components/checkbox';
import { CosProductCardModule } from '@cosmos/components/product-card';
import { CosSupplierModule } from '@cosmos/components/supplier';
import { FeatureFlagsModule } from '@cosmos/feature-flags';
import {
  AddProductsResponse,
  CollectionProductsActions,
  CollectionProductSearchResultItem,
  CollectionsActions,
  productToCollectionProduct,
} from '@esp/collections';
import {
  Product,
  ProductCollectionRemoveEvent,
  ProductCollectionTrackEvent,
  ProductTrackEvent,
  ProductViewEvent,
} from '@esp/products';
import {
  EspSearchPaginationModule,
  EspSearchSortModule,
  SEARCH_LOCAL_STATE,
} from '@esp/search';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Actions, ofActionDispatched } from '@ngxs/store';
import { SelectedPipeModule } from '@smartlink/products';
import { isEqual } from 'lodash';
import { combineLatest, firstValueFrom } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { mapProduct } from '../../../products/utils';
import { productToProductEvent } from '../../../products/utils/product-to-product-event';
import { AddToPresentationFlow } from '../../../projects/flows/add-to-presentation.flow';
import { productSortOptions } from '../../configs';
import { CollectionsDialogService } from '../../services';
import { CollectionProductsLoaderComponentModule } from './collection-products.loader';
import { CollectionProductsLocalState } from './collection-products.local-state';

@UntilDestroy()
@Component({
  selector: 'esp-collection-products',
  templateUrl: './collection-products.component.html',
  styleUrls: ['./collection-products.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    AddToPresentationFlow,
    CollectionProductsLocalState,
    { provide: SEARCH_LOCAL_STATE, useExisting: CollectionProductsLocalState },
  ],
})
export class CollectionProductsComponent {
  @Input() checkedProducts = new Map<
    number,
    CollectionProductSearchResultItem
  >();

  private readonly state$ = this.state.connect(this);

  sortMenuOptions = productSortOptions;
  allChecked = false;
  pageSize = 50;

  mapProduct = mapProduct;

  constructor(
    public readonly state: CollectionProductsLocalState,
    private _router: Router,
    private readonly _ref: ChangeDetectorRef,
    private _collectionsModalService: CollectionsDialogService,
    private readonly _addToPresentationFlow: AddToPresentationFlow,
    private readonly _analytics: CosAnalyticsService,
    _actions$: Actions
  ) {
    const products$ = this.state$.pipe(
      map((state) => state.products?.Results),
      filter(Boolean),
      distinctUntilChanged(isEqual),
      untilDestroyed(this)
    );

    const collection$ = this.state$.pipe(
      map((state) => state.collection),
      filter(Boolean),
      distinctUntilChanged(),
      untilDestroyed(this)
    );

    // eslint-disable-next-line rxjs-angular/prefer-takeuntil
    combineLatest([products$, collection$]).subscribe(([products]) => {
      this.productListViewEvent(products);
    });

    // eslint-disable-next-line rxjs-angular/prefer-takeuntil
    products$.subscribe({
      next: () => {
        this.setAllChecked();
      },
    });

    _actions$
      .pipe(
        ofActionDispatched(CollectionProductsActions.RemoveSuccess),
        untilDestroyed(this)
      )
      .subscribe({
        next: ({ productIds }: CollectionProductsActions.RemoveSuccess) => {
          productIds?.forEach((id) => this.checkedProducts?.delete(id));
          markDirty(this);
        },
      });

    _actions$
      .pipe(
        ofActionDispatched(CollectionsActions.SearchIndexOperationComplete),
        untilDestroyed(this)
      )
      .subscribe({
        next: ({ collection }) => {
          if (collection?.Id === this.state.collection?.Id) {
            this.state.search(this.state.criteria);
          }
        },
      });

    _addToPresentationFlow.setupCleanUpCheckedProductsListener(
      _ref,
      this.checkedProducts
    );
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------
  async addToCollection(product?: CollectionProductSearchResultItem) {
    const products = product
      ? [productToCollectionProduct(product)]
      : Array.from(this.checkedProducts.values()).map(
          productToCollectionProduct
        );

    const result: AddProductsResponse = await firstValueFrom(
      this._collectionsModalService.addToCollection(
        products,
        this.state.collection.Id
      )
    );

    if (result) {
      let selectedProducts: number[] = [];

      if (!product) {
        selectedProducts = Array.from(this.checkedProducts.keys());
        this.checkedProducts.clear();
        this._ref.markForCheck();
      } else {
        selectedProducts.push(product.Id);
      }

      this.captureProductAddedEvent(
        result.Collection.Id,
        selectedProducts,
        result.ProductsDuplicated,
        result.ProductsTruncated
      );
    }
  }

  addToPresentation(product?: CollectionProductSearchResultItem): void {
    // The `product` is optional because `addToPresentation()` might be called from 2 places:
    // 1) from the action bar when more than 1 product is selected
    // 2) from the product card 3 dots menu (so the single product should be added)
    const checkedProducts = product
      ? new Map<number, CollectionProductSearchResultItem>().set(
          product.Id,
          product
        )
      : this.checkedProducts;

    this._addToPresentationFlow.start({ checkedProducts });
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  addToOrder(): void {}

  productDetailClick(product): void {
    if (!product.IsDeleted) {
      this._router.navigate(['/products', product.Id], {
        state: { navigationName: 'Back to Collection' },
      });
    }
  }

  captureProductCardClickEvent(
    product: CollectionProductSearchResultItem,
    index: number
  ): void {
    const productTrack: TrackEvent<ProductTrackEvent> = {
      action: 'Product Clicked',
      properties: {
        id: product.Id,
        source: { id: this.state.collection?.Id },
        productIndex: index + 1,
        currencyCode: product?.Price?.CurrencyCode,
      },
    };
    this._analytics.track(productTrack);
  }

  toggleChecked(product: CollectionProductSearchResultItem): void {
    const checked = this.checkedProducts.has(product.Id);
    this.setChecked(product, !checked);
  }

  selectAll(event): void {
    this.state.products?.Results?.forEach(
      (prod) => !prod.IsDeleted && this.setChecked(prod, event.checked)
    );
  }

  setChecked(
    product: CollectionProductSearchResultItem,
    checked: boolean = false
  ): void {
    const isChecked = this.checkedProducts.has(product.Id);
    if (!isChecked && checked) {
      this.checkedProducts.set(product.Id, product);
      this.setAllChecked();
    } else if (isChecked && !checked) {
      this.checkedProducts.delete(product.Id);
      this.allChecked = false;
    }
  }

  removeProducts(): void {
    const keys = Array.from(this.checkedProducts.keys());
    this.state.delete([...keys]);
    this.captureProductRemovedEvent(keys);
  }

  removeProduct(productId: number): void {
    this.state.delete([productId]);
    this.captureProductRemovedEvent([productId]);
  }

  productHovered(
    product: CollectionProductSearchResultItem,
    index: number
  ): void {
    const productHoverEvent: TrackEvent<ProductTrackEvent> = {
      action: 'Product Hovered',
      properties: {
        id: product.Id,
        currencyCode: product.Price?.CurrencyCode,
        productIndex: index + 1,
        pageNumber: this.state.pageIndex + 1,
        source: { id: this.state.collection.Id },
      },
    };

    this._analytics.trackHover(productHoverEvent);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------
  private setAllChecked() {
    const activeProducts = this.state?.products?.Results?.filter(
      (product) => !product.IsDeleted
    );
    this.allChecked = activeProducts?.every((product) =>
      this.checkedProducts?.has(product?.Id)
    );
  }

  private captureProductAddedEvent(
    collectionId: number,
    products: number[],
    productsDuplicated: number[],
    productsTruncated: number[]
  ): void {
    const productCollectionAdd: TrackEvent<ProductCollectionTrackEvent> = {
      action: 'Collection Products Added',
      properties: {
        id: collectionId,
        products: products,
        productsDuplicated: productsDuplicated,
        productsTruncated: productsTruncated,
        source: { id: this.state.collection.Id },
      },
    };
    this._analytics.track(productCollectionAdd);
  }

  private captureProductRemovedEvent(productIds: number[]): void {
    const productCollectionRemove: TrackEvent<ProductCollectionRemoveEvent> = {
      action: 'Collection Products Removed',
      properties: {
        id: this.state.collection.Id,
        products: productIds,
      },
    };
    this._analytics.track(productCollectionRemove);
  }

  private productListViewEvent(
    productList: CollectionProductSearchResultItem[]
  ): void {
    const products: Product[] = productList.map((product, index) =>
      productToProductEvent(product, index + 1)
    );
    const productViewTrackEvent: TrackEvent<ProductViewEvent> = {
      action: 'Product List Viewed',
      properties: {
        products: products,
        source: { id: this.state.collection.Id },
      },
    };
    this._analytics.track(productViewTrackEvent);
  }
}

@NgModule({
  declarations: [CollectionProductsComponent],
  imports: [
    CommonModule,
    RouterModule,

    FeatureFlagsModule,

    MatDialogModule,
    MatMenuModule,

    CosActionBarModule,
    CosButtonModule,
    CosCheckboxModule,
    CosProductCardModule,
    CosSupplierModule,

    SelectedPipeModule,

    EspSearchPaginationModule,
    EspSearchSortModule,

    CollectionProductsLoaderComponentModule,
    CosHoverEventModule,
  ],
  exports: [CollectionProductsComponent],
})
export class CollectionProductsComponentModule {}
