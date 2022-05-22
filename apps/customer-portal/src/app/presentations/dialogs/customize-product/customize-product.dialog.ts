import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  NgModule,
} from '@angular/core';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { CosButtonModule } from '@cosmos/components/button';
import { CosImageUploadFormModule } from '@cosmos/components/image-upload-form';
import {
  CustomizeProductDialogData,
  CustomizeProductDialogResult,
} from './models';

@Component({
  selector: 'esp-customize-product-dialog',
  templateUrl: './customize-product.dialog.html',
  styleUrls: ['./customize-product.dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomizeProductDialog {
  constructor(
    private _dialogRef: MatDialogRef<
      CustomizeProductDialog,
      CustomizeProductDialogResult
    >,
    @Inject(MAT_DIALOG_DATA) private data: CustomizeProductDialogData
  ) {}
}

@NgModule({
  declarations: [CustomizeProductDialog],
  imports: [
    CommonModule,
    MatDialogModule,
    CosButtonModule,
    MatDividerModule,
    CosImageUploadFormModule,
  ],
})
export class CustomizeProductDialogModule {}
