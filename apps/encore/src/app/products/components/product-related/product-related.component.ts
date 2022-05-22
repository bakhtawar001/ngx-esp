import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Input,
  NgModule,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { CosAnalyticsService, TrackEvent } from '@cosmos/analytics';
import type { ProductCard } from '@cosmos/components/product-card';
import {
  Product as TrackProduct,
  ProductsService,
  ProductTrackEvent,
  ProductViewEvent,
  SourceTrackEvent,
} from '@esp/products';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Product, ProductSearchResultItem } from '@smartlink/models';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ProductCardEvent } from '../../types';
import { getAdInfo, mapProduct } from '../../utils';
import { ProductGalleryComponentModule } from '../product-gallery';

@UntilDestroy()
// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'esp-product-related',
  templateUrl: './product-related.component.html',
  styleUrls: ['./product-related.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProductRelatedComponent implements OnChanges {
  @Input() type: 'related' | 'supplier' | 'category';
  @Input() sourceProduct: Product;

  products: ProductCard[] = [];

  /**
   * Constructor
   *
   */
  constructor(
    private readonly _service: ProductsService,
    private readonly _cdr: ChangeDetectorRef,
    private readonly _analytics: CosAnalyticsService,
    private readonly _route: Router
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.sourceProduct?.currentValue) this.getRelatedProducts();
  }

  productCardClicked({ product, index }: ProductCardEvent<ProductCard>): void {
    this._route.navigate(['/products', product.Id], {
      state: {
        navigationName: 'Back',
        adId: product.Ad?.Id,
        referrer: {
          id: this.sourceProduct.Id,
          component: this.getComponentName(),
        },
      },
    });

    const eventData: TrackEvent<ProductTrackEvent> = {
      action: 'Product Clicked',
      properties: this.getEventProperties(product, index),
    };

    this._analytics.track(eventData);
  }

  getSource(): SourceTrackEvent {
    return {
      id: this.sourceProduct.Id,
      component: this.getComponentName(),
    };
  }
  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------
  private getRelatedProducts() {
    let apiEndpoint: Observable<ProductSearchResultItem[]> = null;

    switch (this.type) {
      case 'supplier':
        apiEndpoint =
          this._service.getMoreFromSupplier<ProductSearchResultItem>({
            asiNumber: this.sourceProduct.Supplier?.AsiNumber,
            count: 4,
          });
        break;
      case 'category':
        apiEndpoint =
          this._service.getTrendingInCategory<ProductSearchResultItem>({
            productId: this.sourceProduct.Id,
            count: 4,
          });
        break;
      case 'related':
        apiEndpoint = this._service.getRelatedProducts<ProductSearchResultItem>(
          {
            productId: this.sourceProduct.Id,
            count: 8,
          }
        );
        break;
    }

    if (apiEndpoint) {
      apiEndpoint
        .pipe(
          map((products) => products.map(mapProduct)),
          catchError(() => {
            this.products = [];
            return EMPTY;
          }),
          untilDestroyed(this)
        )
        .subscribe({
          next: (result) => {
            this.products = result;
            this._cdr.markForCheck();
            this.productListViewEvent(this.products);
          },
        });
    }
  }

  private productListViewEvent(products: ProductCard[]): void {
    const productViewedEvent: TrackEvent<ProductViewEvent> = {
      action: 'Product List Viewed',
      properties: {
        products: this.getEventProducts(products),
        source: this.getSource(),
      },
    };

    this._analytics.track(productViewedEvent);
  }

  private getEventProperties(
    product: ProductCard,
    index: number
  ): ProductTrackEvent {
    return {
      ...this.getTrackingProperties(product),
      productIndex: index + 1,
      source: this.getSource(),
    };
  }

  private getEventProducts(products: ProductCard[]): TrackProduct[] {
    const productList: TrackProduct[] = products.map((product, index) => {
      return {
        ...this.getTrackingProperties(product),
        index: index + 1,
      };
    });

    return productList;
  }

  private getTrackingProperties(product: ProductCard): ProductTrackEvent {
    return {
      id: product.Id,
      ad: getAdInfo(product.Ad),
      currencyCode: product.Price?.CurrencyCode,
    };
  }

  private getComponentName(): string {
    switch (this.type) {
      case 'related':
        return 'Related Products';
      case 'category':
        return 'Trending in Category';
      case 'supplier':
        return 'More from Supplier';
    }
  }
}

@NgModule({
  declarations: [ProductRelatedComponent],
  imports: [CommonModule, ProductGalleryComponentModule],
  exports: [ProductRelatedComponent],
})
export class ProductRelatedComponentModule {}
