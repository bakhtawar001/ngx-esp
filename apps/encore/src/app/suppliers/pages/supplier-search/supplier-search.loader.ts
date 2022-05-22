import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SupplierCardLoaderComponentModule } from './supplier-card.loader';

@Component({
  selector: 'esp-supplier-search-loader',
  template: `
    <div class="supplier-search">
      <div class="content-container">
        <div class="product-results-util-bar">
          <ngx-skeleton-loader
            [theme]="{ height: '12px', width: '30%', margin: '0' }"
          ></ngx-skeleton-loader>
        </div>
        <div class="product-results">
          <esp-supplier-card-loader
            *ngFor="let i of [1, 2, 3, 4, 5, 6, 7, 8]"
          ></esp-supplier-card-loader>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupplierSearchLoaderComponent {}

@NgModule({
  declarations: [SupplierSearchLoaderComponent],
  imports: [
    CommonModule,
    NgxSkeletonLoaderModule,
    SupplierCardLoaderComponentModule,
  ],
  exports: [SupplierSearchLoaderComponent],
})
export class SupplierSearchLoaderComponentModule {}
