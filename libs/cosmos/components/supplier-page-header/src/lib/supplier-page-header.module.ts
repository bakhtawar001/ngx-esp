import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { CosAttributeTagModule } from '@cosmos/components/attribute-tag';
import { CosButtonModule } from '@cosmos/components/button';
import { CosContactInfoModule } from '@cosmos/components/contact-info';
import { CosRatingModule } from '@cosmos/components/rating';
import { CosRelatedTopicsModule } from '@cosmos/components/related-topics';
import { FeatureFlagsModule } from '@cosmos/feature-flags';
import { CosSupplierPageHeaderComponent } from './supplier-page-header.component';

@NgModule({
  imports: [
    CommonModule,
    MatDividerModule,

    FeatureFlagsModule,

    CosButtonModule,
    CosContactInfoModule,
    CosAttributeTagModule,
    CosRatingModule,
    CosRelatedTopicsModule,
  ],
  exports: [CosSupplierPageHeaderComponent],
  declarations: [CosSupplierPageHeaderComponent],
})
export class CosSupplierPageHeaderModule {}
