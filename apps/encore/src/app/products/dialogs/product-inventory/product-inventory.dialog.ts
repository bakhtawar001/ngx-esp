import { CommonModule } from '@angular/common';
import { Component, Inject, NgModule } from '@angular/core';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NumberStringPipeModule } from '@cosmos/common';
import { CosTableModule } from '@cosmos/components/table';
import { ProductInventoryDialogData } from './models';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'esp-product-inventory-dialog',
  templateUrl: './product-inventory.dialog.html',
  styleUrls: ['./product-inventory.dialog.scss'],
})
export class ProductInventoryDialog {
  public columns = ['partCode', 'description', 'quantity'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ProductInventoryDialogData
  ) {
    if (this.data.inventory.some((inventory) => inventory.Location)) {
      this.columns.push('location');
    }
  }
}

@NgModule({
  declarations: [ProductInventoryDialog],
  imports: [
    CommonModule,
    MatDialogModule,
    CosTableModule,
    NumberStringPipeModule,
  ],
})
export class ProductInventoryDialogModule {}
