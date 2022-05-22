import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  NgModule,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CosTableModule } from '@cosmos/components/table';
import {
  FormatPricePipeModule,
  FormatPriceCodePipeModule,
  FormatProfitPipeModule,
} from '@smartlink/products';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'esp-product-pricing-table',
  templateUrl: './product-pricing-table.component.html',
  styleUrls: ['./product-pricing-table.component.scss'],
})
export class ProductPricingTableComponent implements OnChanges {
  @Input() preferred: any;
  @Input() pricing: any;

  public pricingDisplay: any;
  public pricingTableColumns: string[] = [
    'quantity',
    'price',
    'cost',
    'profit',
  ];

  public showMorePricingLink = false;
  public showLessPricingLink = false;
  private _visibleRows = 5;
  private _currentVisibleRows = 5;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.pricing && changes.pricing.currentValue) {
      if (
        this.pricing?.Prices?.[0]?.PreferredPrice &&
        this.pricingTableColumns.indexOf('preferred') === -1
      ) {
        this.pricingTableColumns.splice(3, 0, 'preferred');
      }
      this.pricingDisplay = this.getProductPricing();
    }
  }

  showMorePricing() {
    this._currentVisibleRows = this.pricing?.Prices.length;
    this.pricingDisplay = this.getProductPricing();
  }

  showLessPricing() {
    this._currentVisibleRows = this._visibleRows;
    this.pricingDisplay = this.getProductPricing();
  }

  getProductPricing() {
    this.showMorePricingLink =
      this._currentVisibleRows < this.pricing?.Prices?.length;
    this.showLessPricingLink = this._visibleRows < this._currentVisibleRows;
    return this.pricing?.Prices?.slice(0, this._currentVisibleRows);
  }
}

@NgModule({
  declarations: [ProductPricingTableComponent],
  imports: [
    CommonModule,
    CosTableModule,
    FormatPriceCodePipeModule,
    FormatPricePipeModule,
    FormatProfitPipeModule,
  ],
  exports: [ProductPricingTableComponent],
})
export class ProductPricingTableComponentModule {}
