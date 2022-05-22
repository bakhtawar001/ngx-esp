import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, ViewEncapsulation } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { CosButtonModule } from '@cosmos/components/button';

// !!!!! PLACEHOLDER COMPONENT ONLY !!!!!
// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'esp-pres-empty-state-actions',
  template: `
    <ng-container *ngIf="!mobile">
      <button cos-stroked-button color="primary" [disabled]="!hasProducts">
        <i class="fa fa-eye mr-8"></i> Preview
      </button>
      <button cos-flat-button color="primary">
        <i class="fa fa-share mr-8"></i>
        Share with customer
      </button>
    </ng-container>
    <ng-container *ngIf="mobile">
      <a mat-menu-item color="primary" size="sm" [disabled]="!hasProducts">
        <i class="fa fa-eye mr-8"></i> Preview
      </a>
      <a mat-menu-item color="primary" size="sm">
        <i class="fa fa-share mr-8"></i>
        Share with customer
      </a>
    </ng-container>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class PresEmptyActionButtonsComponent {
  @Input() mobile = false;
  @Input() hasProducts = false;
}

@NgModule({
  declarations: [PresEmptyActionButtonsComponent],
  imports: [CommonModule, CosButtonModule, MatMenuModule],
  exports: [PresEmptyActionButtonsComponent],
})
export class PresEmptyActionButtonsModule {}
