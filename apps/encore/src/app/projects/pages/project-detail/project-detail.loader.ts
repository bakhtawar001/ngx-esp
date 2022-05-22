import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { DetailHeaderComponentModule } from '../../../core/components/detail-header';

@Component({
  selector: 'esp-project-detail-loader',
  template: `<esp-detail-header>
    <esp-detail-header-img>
      <ngx-skeleton-loader
        [theme]="{ height: '90px', width: '90px' }"
      ></ngx-skeleton-loader>
    </esp-detail-header-img>
    <esp-detail-header-title>
      <ngx-skeleton-loader
        [theme]="{ width: '270px', height: '14px' }"
      ></ngx-skeleton-loader>
      <br />
      <ngx-skeleton-loader [theme]="{ width: '180px' }"></ngx-skeleton-loader>
    </esp-detail-header-title>
    <esp-detail-header-tracker>
      <ngx-skeleton-loader
        count="3"
        appearance="circle"
        [theme]="{
          width: '25px',
          height: '25px',
          'margin-right': '40px'
        }"
      ></ngx-skeleton-loader>
      <ngx-skeleton-loader
        [theme]="{ width: '90px', height: '20px' }"
      ></ngx-skeleton-loader>
    </esp-detail-header-tracker>
    <esp-detail-header-notifications>
      <ngx-skeleton-loader [theme]="{ height: '20px' }"></ngx-skeleton-loader>
    </esp-detail-header-notifications>
    <esp-detail-header-meta>
      <div class="detail-header--meta">
        <ngx-skeleton-loader
          [theme]="{ width: '60px', height: '8px', display: 'block' }"
        ></ngx-skeleton-loader>
        <ngx-skeleton-loader [theme]="{ width: '140px' }"></ngx-skeleton-loader>
      </div>
      <div class="detail-header--meta">
        <ngx-skeleton-loader
          [theme]="{ width: '60px', height: '8px', display: 'block' }"
        ></ngx-skeleton-loader>
        <ngx-skeleton-loader [theme]="{ width: '140px' }"></ngx-skeleton-loader>
      </div>
      <div class="detail-header--meta">
        <ngx-skeleton-loader
          [theme]="{ width: '60px', height: '8px', display: 'block' }"
        ></ngx-skeleton-loader>
        <ngx-skeleton-loader [theme]="{ width: '140px' }"></ngx-skeleton-loader>
      </div>
      <div
        class="
              detail-header--meta detail-header--meta-collabs
              flex
              items-center
            "
      >
        <ngx-skeleton-loader
          appearance="circle"
          [theme]="{ width: '32px', height: '32px' }"
        ></ngx-skeleton-loader>
        <ngx-skeleton-loader
          [theme]="{ width: '110px', margin: '0' }"
        ></ngx-skeleton-loader>
      </div>
      <div
        class="
              detail-header--meta detail-header--meta-collabs
              flex
              items-center
            "
      >
        <ngx-skeleton-loader
          appearance="circle"
          [theme]="{ width: '32px', height: '32px' }"
        ></ngx-skeleton-loader>
        <ngx-skeleton-loader
          [theme]="{ width: '110px', margin: '0' }"
        ></ngx-skeleton-loader>
      </div>
    </esp-detail-header-meta>
    <esp-detail-header-nav>
      <ngx-skeleton-loader
        [count]="6"
        [theme]="{
          width: '100px',
          height: '20px',
          'margin-right': '20px',
          'margin-bottom': '4px'
        }"
      ></ngx-skeleton-loader>
    </esp-detail-header-nav>
  </esp-detail-header>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDetailLoaderComponent {}

@NgModule({
  declarations: [ProjectDetailLoaderComponent],
  imports: [NgxSkeletonLoaderModule, DetailHeaderComponentModule],
  exports: [ProjectDetailLoaderComponent],
})
export class ProjectDetailLoaderModule {}
