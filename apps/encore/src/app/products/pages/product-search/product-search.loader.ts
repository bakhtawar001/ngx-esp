import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ProductCardLoaderComponentModule } from './product-card.loader';

@Component({
  selector: 'esp-product-search-loader',
  template: `
    <div class="product-search">
      <!-- <div class="filter-wrapper py-16">
        <div class="content-container">
          <div>
            <ngx-skeleton-loader
              [theme]="{
                height: '35px',
                width: '119px',
                margin: '0 8px 0 0'
              }"
            ></ngx-skeleton-loader>
            <ngx-skeleton-loader
              [theme]="{
                height: '35px',
                width: '85px',
                margin: '0 8px 0 0'
              }"
              *ngFor="let i of [1, 2]"
            ></ngx-skeleton-loader>
            <ngx-skeleton-loader
              [theme]="{
                height: '35px',
                width: '117px',
                margin: '0 8px 0 0'
              }"
            ></ngx-skeleton-loader>
            <ngx-skeleton-loader
              [theme]="{
                height: '35px',
                width: '99px',
                margin: '0 8px 0 0'
              }"
            ></ngx-skeleton-loader>
            <ngx-skeleton-loader
              [theme]="{
                height: '35px',
                width: '66px',
                margin: '0 8px 0 0'
              }"
            ></ngx-skeleton-loader>
            <ngx-skeleton-loader
              [theme]="{
                height: '35px',
                width: '82px',
                margin: '0 8px 0 0'
              }"
            ></ngx-skeleton-loader>
          </div>
        </div>
      </div> -->
      <div class="content-container">
        <div class="product-results-util-bar">
          <ngx-skeleton-loader
            [theme]="{ height: '12px', width: '30%', margin: '0' }"
          ></ngx-skeleton-loader>
        </div>
        <div class="product-results">
          <esp-product-card-loader
            *ngFor="let i of [1, 2, 3, 4, 5, 6, 7, 8]"
          ></esp-product-card-loader>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductSearchLoaderComponent {}

@NgModule({
  declarations: [ProductSearchLoaderComponent],
  imports: [
    CommonModule,
    NgxSkeletonLoaderModule,
    ProductCardLoaderComponentModule,
  ],
  exports: [ProductSearchLoaderComponent],
})
export class ProductSearchLoaderComponentModule {}
