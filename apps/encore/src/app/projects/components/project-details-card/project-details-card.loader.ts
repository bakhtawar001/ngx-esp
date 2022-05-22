import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { CosCardModule } from '@cosmos/components/card';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'esp-project-details-card-loader',
  template: `
    <cos-card class="project-details-card pt-4">
      <header class="project-details-card__header">
        <div class="flex pr-24">
          <ngx-skeleton-loader
            [theme]="{ height: '32px', width: '32px', 'margin-bottom': '2px' }"
          ></ngx-skeleton-loader>
          <div class="ml-12 flex flex-col">
            <ngx-skeleton-loader
              [theme]="{
                height: '14px',
                width: '150px',
                margin: 0
              }"
            ></ngx-skeleton-loader>
            <ngx-skeleton-loader
              [theme]="{ height: '10px', width: '200px', margin: 0 }"
            ></ngx-skeleton-loader>
          </div>
        </div>
        <div class="project-details-card__tracker mb-n8">
          <ngx-skeleton-loader
            appearance="circle"
            [theme]="{ height: '26px', width: '26px', margin: 0 }"
          ></ngx-skeleton-loader>
          <ngx-skeleton-loader
            appearance="circle"
            [theme]="{ height: '26px', width: '26px', margin: '0 0 0 49px' }"
          ></ngx-skeleton-loader>
          <ngx-skeleton-loader
            appearance="circle"
            [theme]="{
              height: '26px',
              width: '26px',
              margin: '0 0 0 49px'
            }"
          ></ngx-skeleton-loader>
          <ngx-skeleton-loader
            [theme]="{
              height: '14px',
              width: '70px',
              margin: '6px 0 0 8px'
            }"
          ></ngx-skeleton-loader>
        </div>
        <div class="project-details-card__notifications">
          <ngx-skeleton-loader
            [theme]="{
              height: '14px',
              margin: '0 0 -4px 0'
            }"
          ></ngx-skeleton-loader>
        </div>
      </header>
      <div cos-card-footer>
        <div class="project-details-card__footer">
          <div class="project-details-card__details-button">
            <ngx-skeleton-loader
              [theme]="{ height: '14px', width: '120px', margin: '4px 0 0 0' }"
            ></ngx-skeleton-loader>
          </div>
          <div class="project-details-card__footer-date mb-0 mr-8">
            <ngx-skeleton-loader
              [theme]="{ height: '12px', width: '150px', margin: '2px 0 0 0' }"
            ></ngx-skeleton-loader>
          </div>
        </div>
      </div>
    </cos-card>
  `,
  styleUrls: ['./project-details-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDetailsCardLoaderComponent {}

@NgModule({
  declarations: [ProjectDetailsCardLoaderComponent],
  imports: [
    CommonModule,
    NgxSkeletonLoaderModule,
    CosCardModule,
    NgxSkeletonLoaderModule,
  ],
  exports: [ProjectDetailsCardLoaderComponent],
})
export class ProjectDetailsCardLoaderModule {}
