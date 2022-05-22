import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';

import { trackItem } from '@cosmos/core';
import { PriceGrid } from '@smartlink/models';
import { CosCardModule } from '@cosmos/components/card';
import { CosInputModule } from '@cosmos/components/input';
import { CosTableModule } from '@cosmos/components/table';
import { CosButtonModule } from '@cosmos/components/button';
import { CosAccordionModule } from '@cosmos/components/accordion';

import { PresentationProductLocalState } from '../../presentation-product.local-state';

@Component({
  selector: 'esp-presentation-product-price-invisible-price-grids',
  templateUrl: './presentation-product-invisible-price-grids.component.html',
  styleUrls: ['./presentation-product-invisible-price-grids.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresentationProductInvisiblePriceGridsComponent {
  @Input() invisiblePriceGrids: PriceGrid[] = [];
  readonly invisiblePriceGridsDisplayedColumns = [
    'size',
    'color',
    'minprice',
    'action',
  ];

  recommendations = [];
  readonly displayedRecommendationsColumns = ['size', 'color', 'minprice'];

  readonly trackById = trackItem<PriceGrid>(['Id']);

  constructor(private state: PresentationProductLocalState) {}

  addAllPriceGrids(): void {
    this.state.addAllPriceGrids();
  }

  makePriceGridVisible(priceGrid: PriceGrid): void {
    this.state.patchPriceGrid(priceGrid, { IsVisible: true });
  }
}

@NgModule({
  imports: [
    CommonModule,
    CosCardModule,
    CosTableModule,
    CosInputModule,
    CosButtonModule,
    CosAccordionModule,
  ],
  declarations: [PresentationProductInvisiblePriceGridsComponent],
  exports: [PresentationProductInvisiblePriceGridsComponent],
})
export class PresentationProductInvisiblePriceGridsModule {}
