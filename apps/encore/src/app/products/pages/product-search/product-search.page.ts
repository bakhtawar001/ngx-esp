import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  NgModule,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import {
  CosAnalyticsService,
  CosHoverEventModule,
  CosTrackEventModule,
  TrackEvent,
} from '@cosmos/analytics';
import { NumberStringPipe } from '@cosmos/common';
import { CosActionBarModule } from '@cosmos/components/action-bar';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCheckboxModule } from '@cosmos/components/checkbox';
import { CosToastService } from '@cosmos/components/notification';
import { CosPaginationModule } from '@cosmos/components/pagination';
import {
  AD_TYPES_FOR_AD_LABEL,
  CosProductCardModule,
} from '@cosmos/components/product-card';
import { CosSupplierModule } from '@cosmos/components/supplier';
import { trackItem } from '@cosmos/core';
import { FeatureFlagsModule } from '@cosmos/feature-flags';
import {
  AddProductsResponse,
  productToCollectionProduct,
} from '@esp/collections';
import {
  AggregateValue,
  mapFiltersFormToSearchCriteria,
  mapUrlFiltersToFiltersForm,
  Product,
  ProductCollectionTrackEvent,
  ProductTrackEvent,
  ProductViewEvent,
  SupplierTrackEvent,
} from '@esp/products';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ProductSearchResultItem } from '@smartlink/models';
import {
  ProductStatusPipeModule,
  SelectedPipeModule,
} from '@smartlink/products';
import { isEqual } from 'lodash-es';
import { animationFrameScheduler, combineLatest, firstValueFrom } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  tap,
} from 'rxjs/operators';
import { CollectionsDialogService } from '../../../collections/services';
import { AddToPresentationFlow } from '../../../projects/flows/add-to-presentation.flow';
import { ProductSearchFiltersComponentModule } from '../../components/product-search-filters';
import { ProductSearchLocalState } from '../../local-states';
import { ProductsDialogService } from '../../services';
import { mapProduct } from '../../utils';
import {
  getAdInfo,
  productToProductEvent,
} from '../../utils/product-to-product-event';
import { ProductSearchLoaderComponentModule } from './product-search.loader';

@UntilDestroy()
@Component({
  selector: 'esp-product-search-page',
  templateUrl: './product-search.page.html',
  styleUrls: ['./product-search.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProductSearchLocalState, AddToPresentationFlow],
})
export class ProductSearchPage {
  private readonly state$ = this.state.connect(this);
  private maxProductsLength = 250;

  allChecked = false;
  mapProduct = mapProduct;
  checkedProducts = new Map<number, ProductSearchResultItem>();
  sortMenuOptions = this.getSortMenuOptions();
  trackProduct = trackItem<ProductSearchResultItem>(['Id']);

  newProductCategories: AggregateValue[];
  maxResultLength = 1000;

  originalOrder = () => 0;

  constructor(
    public readonly state: ProductSearchLocalState,
    private readonly _collectionsModalService: CollectionsDialogService,
    private readonly _toastService: CosToastService,
    private readonly _cdr: ChangeDetectorRef,
    private readonly _addToPresentationFlow: AddToPresentationFlow,
    private readonly _productsDialogService: ProductsDialogService,
    private readonly _router: Router,
    private readonly _analytics: CosAnalyticsService,
    _ref: ChangeDetectorRef
  ) {
    const from$ = this.state$.pipe(
      map(({ from }) => from),
      distinctUntilChanged()
    );

    const term$ = this.state$.pipe(
      map(({ term = '' }) => term),
      distinctUntilChanged(),
      tap(() => this.checkedProducts.clear())
    );

    const sort$ = this.state$.pipe(
      map(({ sort = '' }) => sort),
      distinctUntilChanged()
    );

    combineLatest([term$, from$, sort$])
      .pipe(
        debounceTime(0, animationFrameScheduler),
        map(([term, page, sort]) => {
          const criteria = mapFiltersFormToSearchCriteria(
            mapUrlFiltersToFiltersForm(this.state.filters)
          );

          return {
            ...criteria,
            term: term,
            from: page,
            sortBy: sort,
            organicSize: page > 1 ? this.state.results?.OrganicSize ?? 0 : 0,
            size: this.state.pageSize,
          };
        }),
        untilDestroyed(this)
      )
      .subscribe({
        next: (criteria) => this.state.search(criteria),
      });

    this.state$
      .pipe(
        debounceTime(1, animationFrameScheduler),
        map(({ products }) => products),
        filter(Boolean),
        distinctUntilChanged(isEqual),
        untilDestroyed(this)
      )
      .subscribe({
        next: (products) => {
          this.setAllChecked();
          this.productListViewEvent(products);
        },
      });

    this._router.events.pipe(untilDestroyed(this)).subscribe({
      next: (event) =>
        event instanceof NavigationEnd ? this.scrollTop() : null,
    });

    _addToPresentationFlow.setupCleanUpCheckedProductsListener(
      _ref,
      this.checkedProducts
    );
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  get maxPageNumbers() {
    if (!this.state.results?.MaxPage) {
      return 0;
    }

    return this.state.results?.MaxPage > 6 ? 6 : this.state.results?.MaxPage;
  }

  get resultLength() {
    if (!this.state.results?.MaxPage) {
      return 0;
    }

    return this.state.results?.MaxPage * this.state.pageSize;
  }

  get sort() {
    return this.sortMenuOptions[
      this.state.criteria.sortBy
        ? this.state.criteria.sortBy.toString()
        : 'DFLT'
    ];
  }

  get selectedText(): string {
    let ret = 'Product Selected';

    if (this.checkedProducts?.size > 1) {
      ret = 'Products Selected';
    }

    return ret;
  }

  get resultsIndexFrom(): number | '' {
    if (!this.state.results) {
      return '';
    }

    if (this.state.results?.Results) {
      const index = this.state.criteria.from - 1;
      if (index === 0) {
        return this.state.results.Results?.length ? 1 : 0;
      } else if (index === 1) {
        return this.state.pageSize + index;
      } else {
        return index * this.state.pageSize + 1;
      }
    }
  }

  get resultsIndexTo(): number | '' {
    if (!this.state.results) {
      return '';
    }

    const page = this.state.criteria.from;

    if (this.state.results?.Results) {
      const toMax = Math.max(page * this.state.pageSize);
      const to = Math.min(page * this.state.pageSize, this.maxResultLength);
      if (toMax > this.maxResultLength) {
        return toMax;
      } else {
        return to > this.state.results.ResultsTotal
          ? this.state.results.ResultsTotal
          : to;
      }
    } else {
      return '';
    }
  }

  get resultMessage(): string {
    const numberPipe = new NumberStringPipe();
    const from = numberPipe.transform(this.resultsIndexFrom ?? 0);
    const to = numberPipe.transform(this.resultsIndexTo ?? 0);
    let productTotal = numberPipe.transform(
      this.state.results?.ResultsTotal ?? 0
    );
    let supplierTotal = numberPipe.transform(
      this.state.results?.SuppliersTotal ?? 0
    );
    let message = `(0 of <b>0 products</b> from 0 suppliers)`;

    if (this.state.results?.Results?.length > 0) {
      if (!this.state.results.ResultsTotalIsExhaustive) {
        productTotal = `${this.maxResultLength}+`;
        supplierTotal = `${supplierTotal}+`;
      }

      message = `(${from}-${to} of <b>${productTotal} products</b> from ${supplierTotal} suppliers)`;
    }

    return message;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  productHovered(productCard: ProductSearchResultItem): void {
    const productHoverEvent: TrackEvent<ProductTrackEvent> = {
      action: 'Product Hovered',
      properties: {
        currencyCode: productCard.Price?.CurrencyCode,
        id: productCard.Id,
        ad: getAdInfo(
          productCard.Ad,
          this.state.results?.PfpDiagnostics?.PfpMode
        ),
        marketSegmentCode: 'ALL',
        pageNumber: this.state.pageIndex + 1,
      },
    };

    this._analytics.trackHover(productHoverEvent);
  }

  setSortValue(value: string): void {
    this.state.sort = value;
  }

  pageChange($event): void {
    const page = $event.pageIndex + 1;

    this.state.from = page;

    this.scrollTop();
  }

  selectAll(event): void {
    this.state?.products?.forEach((prod) =>
      this.setChecked(prod, event.checked)
    );
  }

  toggleChecked(product: ProductSearchResultItem): void {
    const checked = this.checkedProducts.has(product.Id);
    this.setChecked(product, !checked);
  }

  goToSupplier(product: ProductSearchResultItem, $event: Event): void {
    $event.stopPropagation();
    const supplierTrack: TrackEvent<SupplierTrackEvent> = {
      action: 'Supplier Clicked',
      properties: { id: product.Supplier.Id, productId: product.Id },
    };

    this._analytics.track(supplierTrack);
    this._router.navigate(['/suppliers', product.Supplier?.Id], {
      state: { navigationName: 'Back to Search Results' },
    });
  }

  getProductStatProps(product: ProductSearchResultItem, index: number): void {
    const productTrack: TrackEvent<ProductTrackEvent> = {
      action: 'Product Clicked',
      properties: {
        id: product.Id,
        ad: getAdInfo(product.Ad, this.state.results?.PfpDiagnostics?.PfpMode),
        pageNumber: this.state.pageIndex + 1,
        productIndex: index + 1,
        marketSegmentCode: 'ALL',
        currencyCode: product?.Price?.CurrencyCode,
        objectID: product.ObjectId,
        index: !AD_TYPES_FOR_AD_LABEL.includes(product.Ad?.Type)
          ? this.state.index
          : null,
        queryID: this.state.queryId,
        organicIndex: !AD_TYPES_FOR_AD_LABEL.includes(product.Ad?.Type)
          ? product.OrganicIndex
          : null,
      },
    };
    this._analytics.track(productTrack);
  }

  // -----------------------------------------------------------------
  // @Async Methods
  // -------------------------------------------------------------------

  async addToCollection(product?: ProductSearchResultItem) {
    const { checkedProducts, maxProductsLength } = this;

    if (checkedProducts.size > maxProductsLength) {
      return this._toastService.error(
        'Error: Too Many Products!',
        `${checkedProducts.size} product(s) were unable to be added. ${maxProductsLength} product per collection limit reached.`
      );
    }

    const products = product
      ? [productToCollectionProduct(product)]
      : Array.from(this.checkedProducts.values()).map(
          productToCollectionProduct
        );

    const result: AddProductsResponse = await firstValueFrom(
      this._collectionsModalService.addToCollection(products)
    );

    if (result) {
      let selectedProducts: number[] = [];

      if (!product) {
        selectedProducts = Array.from(this.checkedProducts.keys());
        this.checkedProducts.clear();
        this._cdr.markForCheck();
        // Mark for check?
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

  addToPresentation(product?: ProductSearchResultItem): void {
    // The `product` is optional because `addToPresentation()` might be called from 2 places:
    // 1) from the action bar when more than 1 product is selected
    // 2) from the product card 3 dots menu (so the single product should be added)
    const checkedProducts = product
      ? new Map<number, ProductSearchResultItem>().set(product.Id, product)
      : this.checkedProducts;

    this._addToPresentationFlow.start({ checkedProducts });
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async addToOrder(): Promise<void> {}

  async shareProducts(): Promise<void> {
    await firstValueFrom(
      this._productsDialogService.openShareDialog({
        products: Array.from(this.checkedProducts.values()),
      })
    );
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------
  private productListViewEvent(productList: ProductSearchResultItem[]): void {
    const pfpMode: string = this.state.results?.PfpDiagnostics?.PfpMode;
    const products: Product[] = productList.map((product, index) =>
      productToProductEvent(product, index + 1, pfpMode)
    );
    const productViewTrackEvent: TrackEvent<ProductViewEvent> = {
      action: 'Product List Viewed',
      properties: {
        products: products,
        marketSegmentCode: 'ALL',
        pageNumber: this.state.pageIndex + 1,
        index: this.state.index,
        queryID: this.state.queryId,
      },
    };
    this._analytics.track(productViewTrackEvent);
  }
  private setChecked(
    product: ProductSearchResultItem,
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

  private setAllChecked() {
    this.allChecked = this.state.products?.every((product) =>
      this.checkedProducts?.has(product?.Id)
    );
  }

  private getSortMenuOptions() {
    return {
      DFLT: 'Relevance',
      PRLH: 'Price: Low to High',
      PRHL: 'Price: High to Low',
      CSLH: 'Cost: Low to High',
      CSHL: 'Cost: High to Low',
      PVRN: 'Preferred Suppliers',
      SPRT: 'Supplier Rating',
      PRNW: 'New Products',
    };
  }

  private scrollTop(): void {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }

  private captureProductAddedEvent(
    collectionId: number,
    selectedProducts: number[],
    productsDuplicated: number[],
    productsTruncated: number[]
  ): void {
    const productCollectionAdd: TrackEvent<ProductCollectionTrackEvent> = {
      action: 'Collection Products Added',
      properties: {
        id: collectionId,
        products: selectedProducts,
        productsDuplicated: productsDuplicated,
        productsTruncated: productsTruncated,
        queryID: this.state.queryId,
        index: this.state.index,
      },
    };
    this._analytics.track(productCollectionAdd);
  }
}

@NgModule({
  declarations: [ProductSearchPage],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,

    FeatureFlagsModule,

    MatDialogModule,
    MatMenuModule,

    CosActionBarModule,
    CosButtonModule,
    CosCheckboxModule,
    CosPaginationModule,
    CosProductCardModule,
    CosSupplierModule,

    ProductSearchFiltersComponentModule,
    SelectedPipeModule,
    ProductSearchLoaderComponentModule,
    ProductStatusPipeModule,

    CosTrackEventModule,
    CosHoverEventModule,
  ],
})
export class ProductSearchPageModule {}
