import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';

import { PriceGrid } from '@smartlink/models';
import { CosCardModule } from '@cosmos/components/card';
import { CosInputModule } from '@cosmos/components/input';
import { CosTableModule } from '@cosmos/components/table';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCheckboxModule } from '@cosmos/components/checkbox';

import { PresentationProductInvisiblePriceGridsModule } from '../presentation-product-invisible-price-grids';
import { PresentationProductVisiblePriceGridsModule } from '../presentation-product-visible-price-grids';

@Component({
  selector: 'esp-presentation-product-price-grids',
  templateUrl: './presentation-product-price-grids.component.html',
  styleUrls: ['./presentation-product-price-grids.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresentationProductPriceGridsComponent {
  @Input() visiblePriceGrids: PriceGrid[] = [];
  @Input() invisiblePriceGrids: PriceGrid[] = [];
}

@NgModule({
  declarations: [PresentationProductPriceGridsComponent],
  imports: [
    CommonModule,

    CosTableModule,
    CosInputModule,
    CosButtonModule,
    CosCardModule,
    CosCheckboxModule,

    PresentationProductVisiblePriceGridsModule,
    PresentationProductInvisiblePriceGridsModule,
  ],
  exports: [PresentationProductPriceGridsComponent],
})
export class PresentationProductPriceGridsModule {}
