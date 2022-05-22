import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'esp-collection-detail-loader',
  template: `<div>
    <div class="flex justify-start items-center">
      <ngx-skeleton-loader
        [theme]="{ height: '24px', width: '24px', 'margin-right': '16px' }"
      ></ngx-skeleton-loader>
      <ngx-skeleton-loader
        [theme]="{ width: '270px', height: '14px' }"
      ></ngx-skeleton-loader>
    </div>
    <ngx-skeleton-loader
      [theme]="{ width: '180px', 'margin-bottom': '16px' }"
    ></ngx-skeleton-loader>
    <br />
    <div class="flex items-center">
      <ngx-skeleton-loader
        appearance="circle"
        [theme]="{ width: '32px', height: '32px', margin: '0 4px 0 0' }"
      ></ngx-skeleton-loader>
      <div class="flex flex-col">
        <ngx-skeleton-loader
          [theme]="{ width: '60px', height: '8px', margin: '0' }"
        ></ngx-skeleton-loader>
        <ngx-skeleton-loader [theme]="{ width: '140px' }"></ngx-skeleton-loader>
      </div>
    </div>
  </div> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionDetailLoaderComponent {}

@NgModule({
  declarations: [CollectionDetailLoaderComponent],
  imports: [CommonModule, NgxSkeletonLoaderModule],
  exports: [CollectionDetailLoaderComponent],
})
export class CollectionDetailLoaderComponentModule {}
