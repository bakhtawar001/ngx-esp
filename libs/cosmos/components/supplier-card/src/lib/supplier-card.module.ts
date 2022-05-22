import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { CosAttributeTagModule } from '@cosmos/components/attribute-tag';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCardModule } from '@cosmos/components/card';
import { FeatureFlagsModule } from '@cosmos/feature-flags';
import { CosSupplierCardComponent } from '..';

@NgModule({
  imports: [
    CommonModule,
    FeatureFlagsModule,
    CosAttributeTagModule,
    CosButtonModule,
    CosCardModule,
    MatMenuModule,
  ],
  exports: [CosSupplierCardComponent],
  declarations: [CosSupplierCardComponent],
})
export class CosSupplierCardModule {}
