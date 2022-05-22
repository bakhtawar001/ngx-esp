import { CommonModule } from '@angular/common';
import { Component, Inject, NgModule } from '@angular/core';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CosProductVariantsModule } from '@cosmos/components/product-variant-details';
import { ProductPricingTableComponentModule } from '../../components/product-pricing-table';
import { ProductPricingDialogData } from './models';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'esp-product-pricing-dialog',
  templateUrl: './product-pricing.dialog.html',
  styleUrls: ['./product-pricing.dialog.scss'],
})
export class ProductPricingDialog {
  Object = Object;

  constructor(@Inject(MAT_DIALOG_DATA) public data: ProductPricingDialogData) {}
}

@NgModule({
  declarations: [ProductPricingDialog],
  imports: [
    CommonModule,
    MatDialogModule,
    CosProductVariantsModule,
    ProductPricingTableComponentModule,
  ],
})
export class ProductPricingDialogModule {}
