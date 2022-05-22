import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { CosCardModule } from '@cosmos/components/card';
import { CosCheckboxModule } from '@cosmos/components/checkbox';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'esp-supplier-card-loader',
  template: `
    <cos-card class="cos-card-p-8">
      <div class="flex items-center h-8"></div>
      <ngx-skeleton-loader
        [theme]="{
          height: '168px',
          width: '100%',
          margin: '0 auto 16px;'
        }"
      ></ngx-skeleton-loader>
      <div class="pt-8 " style="border-top: 1px solid #e7e8e9;">
        <ngx-skeleton-loader
          [theme]="{ width: '20%', 'margin-bottom': '4px' }"
        ></ngx-skeleton-loader>
        <ngx-skeleton-loader
          [theme]="{
            width: '20%',
            'margin-left': '4px',
            'margin-bottom': '4px'
          }"
        ></ngx-skeleton-loader>
        <br /><br /><br />
      </div>
    </cos-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupplierCardLoaderComponent {}

@NgModule({
  declarations: [SupplierCardLoaderComponent],
  imports: [
    CommonModule,
    NgxSkeletonLoaderModule,
    CosCardModule,
    CosCheckboxModule,
  ],
  exports: [SupplierCardLoaderComponent],
})
export class SupplierCardLoaderComponentModule {}
