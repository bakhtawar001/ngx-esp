import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { CosCardModule } from '@cosmos/components/card';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'esp-collection-search-loader',
  template: ` <cos-card
    class="cos-collection-card"
    *ngFor="let i of [1, 2, 3, 4, 5]"
  >
    <ngx-skeleton-loader
      [theme]="{
        width: '24px',
        height: '24px',
        margin: '2px 16px 0 0'
      }"
    >
    </ngx-skeleton-loader
    ><ngx-skeleton-loader
      [theme]="{ width: '60%', 'vertical-align': 'bottom' }"
    >
    </ngx-skeleton-loader>
    <br />
    <ngx-skeleton-loader
      [theme]="{ 'min-height': '8rem', width: '100%', margin: '18px 0 12px' }"
    ></ngx-skeleton-loader
    ><br />
    <ngx-skeleton-loader
      [theme]="{ height: '8px', width: '72px', margin: '0 0 4px' }"
    ></ngx-skeleton-loader>
    <br />
    <ngx-skeleton-loader
      appearance="circle"
      [theme]="{ width: '32px', height: '32px', margin: '0' }"
    ></ngx-skeleton-loader>
  </cos-card>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionSearchLoaderComponent {}

@NgModule({
  declarations: [CollectionSearchLoaderComponent],
  imports: [CommonModule, NgxSkeletonLoaderModule, CosCardModule],
  exports: [CollectionSearchLoaderComponent],
})
export class CollectionSearchLoaderComponentModule {}
