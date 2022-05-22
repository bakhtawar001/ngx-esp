import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
import { Store } from '@ngxs/store';
import { FormsModule } from '@angular/forms';

import { trackItem } from '@cosmos/core';
import { PriceGrid } from '@smartlink/models';
import { CosInputModule } from '@cosmos/components/input';
import { PresentationProductAttribute } from '@esp/models';
import { CosButtonModule } from '@cosmos/components/button';
import { CosAccordionModule } from '@cosmos/components/accordion';
import { PresentationProductOriginalPriceGridsQueries } from '@esp/presentations';

import { PresentationProductLocalState } from '../../presentation-product.local-state';
import { PresentationProductVisiblePriceGridPricesModule } from './presentation-product-visible-price-grid-prices';

const MAX_PRICES_PER_PRICE_GRID = 10;

function filterProductPricingAttributes(
  attributes: PresentationProductAttribute[]
): PresentationProductAttribute[] {
  const productPricingAttributes = ['SIZE', 'SHAP', 'MTRL', 'PRCL'];

  return attributes.filter((attribute) =>
    productPricingAttributes.includes(attribute.Type)
  );
}

@Component({
  selector: 'esp-presentation-product-price-visible-price-grids',
  templateUrl: './presentation-product-visible-price-grids.component.html',
  styleUrls: ['./presentation-product-visible-price-grids.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresentationProductVisiblePriceGridsComponent {
  @Input() visiblePriceGrids: PriceGrid[] = [];

  readonly maxPricesPerPriceGrid = MAX_PRICES_PER_PRICE_GRID;

  readonly trackById = trackItem<PriceGrid>(['Id']);

  constructor(
    private readonly store: Store,
    private readonly state: PresentationProductLocalState
  ) {}

  /**
   * This should be a pipe but we don't care much about that for now.
   * I go to priceGrids[0].Attributes (Array<number>)
    I go to Product.Attributes (Array<object>)
    const productPricingAttributes = [SIZE, SHAP, MTRL, PRCL] as const
    I loop product pricing attributes and their .Values
    I loop .Values and I compare the priceGrids[0].Attributes with .Values.Id
    I take the Values[0].Value and comma delimit it
   */
  getAttributesToView(priceGrid: PriceGrid): string {
    let attributes = '';

    const attributeValues = filterProductPricingAttributes(
      this.state.product.Attributes
    )
      .map((attribute) => attribute.Values)
      .flat();

    for (const attribute of priceGrid.Attributes || []) {
      for (const attributeValue of attributeValues) {
        if (attribute === attributeValue.Id) {
          attributes += ` ${attributeValue.Value}`;
        }
      }
    }

    return attributes.trim();
  }

  addCustomQuantity(priceGrid: PriceGrid): void {
    this.state.addCustomQuantity(priceGrid);
  }

  updatePriceIncludes(priceGrid: PriceGrid, priceIncludes: string): void {
    this.state.patchPriceGrid(priceGrid, { PriceIncludes: priceIncludes });
  }

  restoreToDefault(priceGrid: PriceGrid): void {
    const originalPriceGrid = this.store.selectSnapshot(
      PresentationProductOriginalPriceGridsQueries.getOriginalPriceGrid(
        priceGrid.Id
      )
    );

    this.state.restoreToDefault(priceGrid, originalPriceGrid);
  }

  hidePriceGrid(priceGrid: PriceGrid): void {
    this.state.patchPriceGrid(priceGrid, { IsVisible: false });
  }

  onExpandedChange(expanded: boolean, priceGrid: PriceGrid): void {
    if (expanded) {
      this.state.getOriginalPriceGrid(this.state.product.Id, priceGrid.Id);
    }
  }
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CosInputModule,
    CosButtonModule,
    CosAccordionModule,
    PresentationProductVisiblePriceGridPricesModule,
  ],
  declarations: [PresentationProductVisiblePriceGridsComponent],
  exports: [PresentationProductVisiblePriceGridsComponent],
})
export class PresentationProductVisiblePriceGridsModule {}
