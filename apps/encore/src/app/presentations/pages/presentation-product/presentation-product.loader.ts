import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { CosCardModule } from '@cosmos/components/card';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'esp-presentation-product-loader',
  template: `<div class="skeleton-loader">
    <div
      class="skeleton-loader-header"
      style="display: flex; justify-content: space-between; margin-top: 15px;"
    >
      <ngx-skeleton-loader
        [theme]="{ width: '300px', 'margin-top': '15px' }"
      ></ngx-skeleton-loader>
      <div style="display: grid; grid-auto-flow: column; grid-gap: 15px;">
        <ngx-skeleton-loader
          [theme]="{ height: '35px', width: '145px' }"
        ></ngx-skeleton-loader>
        <ngx-skeleton-loader
          [theme]="{ height: '35px', width: '145px' }"
        ></ngx-skeleton-loader>
        <ngx-skeleton-loader
          [theme]="{ height: '35px', width: '145px' }"
        ></ngx-skeleton-loader>
      </div>
    </div>
    <hr />
    <cos-card>
      <ngx-skeleton-loader
        [theme]="{
          height: '80px',
          width: '256px',
          'margin-right': '15px'
        }"
      ></ngx-skeleton-loader>
      <ngx-skeleton-loader
        [theme]="{
          height: '80px',
          width: '256px',
          'margin-right': '15px'
        }"
      ></ngx-skeleton-loader>
      <ngx-skeleton-loader
        [theme]="{
          height: '80px',
          width: '256px',
          'margin-right': '15px'
        }"
      ></ngx-skeleton-loader>
      <ngx-skeleton-loader
        [theme]="{
          height: '80px',
          width: '256px',
          'margin-right': '15px'
        }"
      ></ngx-skeleton-loader>
    </cos-card>
    <hr />
    <div class="presentation-product__pg-content-body">
      <div>
        <ngx-skeleton-loader
          [theme]="{
            width: '100%',
            height: 'auto',
            display: 'block',
            'aspect-ratio': '1/1',
            'margin-bottom': '16px'
          }"
        ></ngx-skeleton-loader>
        <cos-card>
          <ngx-skeleton-loader
            [theme]="{ width: '75%', margin: '0px' }"
          ></ngx-skeleton-loader>
          <hr class="card-divider" />
          <ngx-skeleton-loader
            [theme]="{ width: '100px' }"
          ></ngx-skeleton-loader>
          <br />
          <ngx-skeleton-loader [theme]="{ width: '65%' }"></ngx-skeleton-loader>
          <br />
          <ngx-skeleton-loader
            [theme]="{ width: '200px' }"
          ></ngx-skeleton-loader>
          <br />
          <ngx-skeleton-loader [theme]="{ width: '65%' }"></ngx-skeleton-loader>
        </cos-card>
      </div>
      <div>
        <ngx-skeleton-loader [theme]="{ width: '200px' }"></ngx-skeleton-loader
        ><br />
        <ngx-skeleton-loader [theme]="{ width: '130px' }"></ngx-skeleton-loader>
        <div>
          <ngx-skeleton-loader
            count="6"
            [theme]="{
              width: '82px',
              height: '82px',
              'margin-bottom': '40px',
              'margin-right': '16px'
            }"
          ></ngx-skeleton-loader>
        </div>
        <ngx-skeleton-loader [theme]="{ width: '160px' }"></ngx-skeleton-loader>
        <ngx-skeleton-loader [theme]="{ height: '32px' }"></ngx-skeleton-loader>
        <br /><br />
        <ngx-skeleton-loader [theme]="{ width: '160px' }"></ngx-skeleton-loader>
        <ngx-skeleton-loader [theme]="{ height: '92px' }"></ngx-skeleton-loader>
        <br /><br />
        <ngx-skeleton-loader [theme]="{ width: '160px' }"></ngx-skeleton-loader>
        <ngx-skeleton-loader [theme]="{ height: '92px' }"></ngx-skeleton-loader>
        <br />
        <hr />
        <br />
        <ngx-skeleton-loader [theme]="{ width: '130px' }"></ngx-skeleton-loader>
        <br />
        <ngx-skeleton-loader
          count="6"
          [theme]="{ width: '220px', display: 'block' }"
        ></ngx-skeleton-loader>
      </div>
    </div>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresentationProductLoaderComponent {}

@NgModule({
  declarations: [PresentationProductLoaderComponent],
  imports: [NgxSkeletonLoaderModule, CosCardModule],
  exports: [PresentationProductLoaderComponent],
})
export class PresentationProductLoaderModule {}
