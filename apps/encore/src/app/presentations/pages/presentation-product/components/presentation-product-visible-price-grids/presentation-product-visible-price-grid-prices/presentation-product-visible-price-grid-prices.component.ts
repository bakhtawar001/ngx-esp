import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { createMask, InputMaskModule } from '@ngneat/input-mask';

import { Price, PriceGrid } from '@smartlink/models';
import { CosInputModule } from '@cosmos/components/input';
import { CosTableModule } from '@cosmos/components/table';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCheckboxModule } from '@cosmos/components/checkbox';

import { PresentationProductLocalState } from '../../../presentation-product.local-state';

const DOLLAR_SIGN = '$';

@Component({
  selector: 'esp-presentation-product-visible-price-grid-prices',
  templateUrl:
    './presentation-product-visible-price-grid-prices.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresentationProductVisiblePriceGridPricesComponent {
  @Input() priceGrid: PriceGrid;

  readonly netCostMask = createMask({
    alias: 'numeric',
    digits: 3,
    allowMinus: false,
    prefix: DOLLAR_SIGN,
  });

  readonly marginMask = createMask({
    alias: 'percentage',
    digits: 0,
    allowMius: false,
  });

  readonly priceGridColumns = [
    'Quantity',
    'Cost',
    'CostPerUnit',
    'DiscountPercent',
    'Price',
    'IsVisible',
  ] as const;

  constructor(private readonly state: PresentationProductLocalState) {}

  onNetCostChange(
    priceGrid: PriceGrid,
    price: Price,
    newNetCost: string
  ): void {
    this.state.updateMarginWhenNetCostOrPriceChanges(
      priceGrid,
      price,
      parseFloat(newNetCost.replace(DOLLAR_SIGN, '')),
      price.Price
    );
  }

  onPriceChange(priceGrid: PriceGrid, price: Price, newPrice: string): void {
    this.state.updateMarginWhenNetCostOrPriceChanges(
      priceGrid,
      price,
      price.Cost,
      parseFloat(newPrice)
    );
  }

  hidePriceGrid(priceGrid: PriceGrid): void {
    this.state.patchPriceGrid(priceGrid, { IsVisible: false });
  }

  hidePrice(priceGrid: PriceGrid, price: Price): void {
    this.state.togglePriceVisibility(priceGrid, price, /* isVisible */ false);
  }

  removePrice(priceGrid: PriceGrid, price: Price): void {
    this.state.removePrice(priceGrid, price);
  }
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    InputMaskModule,
    CosTableModule,
    CosInputModule,
    CosButtonModule,
    CosCheckboxModule,
  ],
  declarations: [PresentationProductVisiblePriceGridPricesComponent],
  exports: [PresentationProductVisiblePriceGridPricesComponent],
})
export class PresentationProductVisiblePriceGridPricesModule {}
