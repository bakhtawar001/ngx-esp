import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { CosCardModule } from '@cosmos/components/card';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'esp-presentation-settings-loader',
  template: `<div class="skeleton-loader">
    <ngx-skeleton-loader
      [theme]="{ height: '14px', width: '300px' }"
    ></ngx-skeleton-loader>
    <hr />
    <cos-card class="lg:block hidden mt-16 mb-16">
      <div>
        <ngx-skeleton-loader [theme]="{ width: '200px' }"></ngx-skeleton-loader
        ><br />
        <ngx-skeleton-loader
          count="2"
          [theme]="{ width: '51%' }"
        ></ngx-skeleton-loader>
      </div>
      <div cos-card-sidebar>
        <ngx-skeleton-loader [theme]="{ width: '50%' }"></ngx-skeleton-loader>
        <ngx-skeleton-loader
          count="5"
          [theme]="{ width: '75%' }"
        ></ngx-skeleton-loader>
      </div>
    </cos-card>
    <br />
    <ngx-skeleton-loader
      [theme]="{ height: '14px', width: '300px' }"
    ></ngx-skeleton-loader>
    <hr />
    <div
      class="
          proj-pres__products-grid
          xl:grid-cols-8
          lg:grid-cols-7
          md:grid-cols-6
          grid-gap-16 grid grid-cols-2
          my-16
        "
    >
      <cos-card *ngFor="let i of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]">
        <ngx-skeleton-loader
          [theme]="{ height: '175px', width: '100%' }"
        ></ngx-skeleton-loader>
        <ngx-skeleton-loader [theme]="{ width: '75%' }"></ngx-skeleton-loader
        ><ngx-skeleton-loader [theme]="{ width: '50%' }"></ngx-skeleton-loader>
      </cos-card>
    </div>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresentationSettingsLoaderComponent {}

@NgModule({
  declarations: [PresentationSettingsLoaderComponent],
  imports: [CommonModule, NgxSkeletonLoaderModule, CosCardModule],
  exports: [PresentationSettingsLoaderComponent],
})
export class PresentationSettingsLoaderModule {}
