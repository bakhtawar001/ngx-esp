import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ProductCardLoaderComponentModule } from '../../../products/pages/product-search/product-card.loader';

@Component({
  selector: 'esp-collection-products-loader',
  template: `
    <hr />
    <div class="product-results pt-32">
      <esp-product-card-loader
        *ngFor="let i of [1, 2, 3, 4, 5, 6, 7, 8]"
      ></esp-product-card-loader>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionProductsLoaderComponent {}

@NgModule({
  declarations: [CollectionProductsLoaderComponent],
  imports: [
    CommonModule,
    NgxSkeletonLoaderModule,
    ProductCardLoaderComponentModule,
  ],
  exports: [CollectionProductsLoaderComponent],
})
export class CollectionProductsLoaderComponentModule {}
