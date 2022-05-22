import { CommonModule } from '@angular/common';
import { Component, Input, NgModule } from '@angular/core';
import { CosTableModule } from '@cosmos/components/table';
import { FormatPricePipeModule } from '@smartlink/products';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'esp-product-charges-table',
  templateUrl: './product-charges-table.component.html',
  styleUrls: ['./product-charges-table.component.scss'],
})
export class ProductChargesTableComponent {
  @Input() method: {
    Name: string;
    singlePrices: any[];
    multiplePrices: any[];
    Values: any[];
  };

  public chargeTableColumns = ['description', 'price', 'cost', 'priceCode'];
  public optionChargeTableColumns = ['quantity', 'price', 'cost', 'priceCode'];

  getStringValue(value: any): string {
    return Array.isArray(value)
      ? value
          .map((val) => {
            return val.Name || val;
          })
          .join(', ')
      : value.Name || value;
  }
}

@NgModule({
  declarations: [ProductChargesTableComponent],
  imports: [CommonModule, CosTableModule, FormatPricePipeModule],
  exports: [ProductChargesTableComponent],
})
export class ProductChargesTableComponentModule {}
