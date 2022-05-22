import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, ViewEncapsulation } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { CosButtonModule } from '@cosmos/components/button';
import { CosFormFieldModule } from '@cosmos/components/form-field';
import {
  SharePresentationDialog,
  SharePresentationDialogModule,
} from '../../../../dialogs/share-presentation/share-presentation.dialog';

// !!!!! PLACEHOLDER COMPONENT ONLY !!!!!
// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'esp-pres-post-share-state-actions',
  template: `
    <ng-container *ngIf="!mobile">
      <button cos-stroked-button color="primary">
        <i class="fa fa-pen mr-8"></i> Edit
      </button>
      <button cos-stroked-button color="primary">
        <i class="fa fa-eye mr-8"></i> Preview
      </button>
      <button cos-stroked-button color="primary" (click)="openDialog()">
        <i class="fa fa-share mr-8"></i> Share
      </button>
      <button cos-flat-button color="primary" [disabled]="!hasQuote">
        <i class="fa fa-file-invoice-dollar mr-8"></i>
        Create Quote
      </button>
    </ng-container>
    <ng-container *ngIf="mobile">
      <a mat-menu-item color="primary" size="sm">
        <i class="fa fa-pen mr-8"></i> Edit
      </a>
      <a mat-menu-item color="primary" size="sm">
        <i class="fa fa-eye mr-8"></i> Preview
      </a>
      <a mat-menu-item color="primary" size="sm" (click)="openDialog()">
        <i class="fa fa-share mr-8"></i> Share
      </a>
      <a mat-menu-item color="primary" size="sm" [disabled]="!hasQuote">
        <i class="fa fa-file-invoice-dollar mr-8"></i>
        Create Quote
      </a>
    </ng-container>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class PresPostShareActionButtonsComponent {
  shareWith = new FormControl('email');
  constructor(private dialog: MatDialog) {}
  @Input() mobile = false;
  @Input() hasQuote = false;
  openDialog() {
    this.dialog.open(SharePresentationDialog, {
      width: '625px',
      height: '625px',
    });
  }
}

@NgModule({
  declarations: [PresPostShareActionButtonsComponent],
  imports: [
    CommonModule,
    FormsModule,
    CosFormFieldModule,
    CosButtonModule,
    MatMenuModule,
    MatDialogModule,
    SharePresentationDialogModule,
  ],
  exports: [PresPostShareActionButtonsComponent],
})
export class PresPostShareActionButtonsModule {}
