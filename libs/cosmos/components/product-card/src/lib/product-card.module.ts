import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { CosBadgeModule } from '@cosmos/components/badge';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCardModule } from '@cosmos/components/card';
import { CosCheckboxModule } from '@cosmos/components/checkbox';
import { CosProductCardTagsModule } from '@cosmos/components/product-card-tags';
import { CosRatingModule } from '@cosmos/components/rating';
import { CosSupplierModule } from '@cosmos/components/supplier';
import { TruncatePipeModule } from '@cosmos/core';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  FormatPricePipeModule,
  ProductImageComponentModule,
} from '@smartlink/products';
import { CosProductCardComponent } from './product-card.component';

@NgModule({
  imports: [
    CommonModule,

    CosBadgeModule,
    CosButtonModule,
    CosCardModule,
    CosCheckboxModule,
    CosProductCardTagsModule,
    MatMenuModule,
    CosRatingModule,
    CosSupplierModule,
    DragDropModule,
    TruncatePipeModule,
    FormatPricePipeModule,
    ProductImageComponentModule,
  ],
  exports: [TruncatePipeModule, CosProductCardComponent],
  declarations: [CosProductCardComponent],
})
export class CosProductCardModule {}
