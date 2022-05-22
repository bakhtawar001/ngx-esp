import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
import { CosCardModule } from '@cosmos/components/card';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'asi-details-card-loader',
  template: ` <cos-card class="pt-4">
    <div class="flex flex-col  mr-n8 ml-n8 mt-n8 mb-n8">
      <div class="flex">
        <div class="flex items-center justify-center mr-12">
          <ngx-skeleton-loader
            [theme]="{ height: '32px', width: '32px', margin: 0 }"
          ></ngx-skeleton-loader>
        </div>
        <div class="flex flex-col justify-around">
          <ngx-skeleton-loader
            [theme]="{ height: '12px', width: '140px', margin: 0 }"
          ></ngx-skeleton-loader>
          <ngx-skeleton-loader
            *ngIf="!singleLineHeader"
            [theme]="{ height: '10px', width: '170px', margin: 0 }"
          ></ngx-skeleton-loader>
        </div>
      </div>
      <div class="flex flex-col mt-12">
        <ngx-skeleton-loader
          [theme]="{ height: '10px', width: '170px', margin: '0 0 4px 0' }"
        ></ngx-skeleton-loader>

        <ngx-skeleton-loader
          [theme]="{ height: '10px', width: '200px', margin: '0 0 4px 0' }"
        ></ngx-skeleton-loader>
      </div>
    </div>
  </cos-card>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [':host {width: 100%}'],
})
export class AsiDetailsCardLoaderComponent {
  @Input()
  singleLineHeader = false;
}

@NgModule({
  declarations: [AsiDetailsCardLoaderComponent],
  imports: [CommonModule, NgxSkeletonLoaderModule, CosCardModule],
  exports: [AsiDetailsCardLoaderComponent],
})
export class AsiDetailsCardLoaderComponentModule {}
