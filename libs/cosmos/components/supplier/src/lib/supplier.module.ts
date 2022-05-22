import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CosButtonModule } from '@cosmos/components/button';
import { CosAttributeTagModule } from '@cosmos/components/attribute-tag';
import { CosContactInfoModule } from '@cosmos/components/contact-info';
import { CosRatingModule } from '@cosmos/components/rating';
import { CosSupplierFooterComponent } from './supplier-footer.component';
import { CosSupplierComponent } from './supplier.component';

@NgModule({
  imports: [
    CommonModule,
    CosAttributeTagModule,
    CosRatingModule,
    CosButtonModule,
    CosContactInfoModule,
  ],
  exports: [CosSupplierComponent, CosSupplierFooterComponent],
  declarations: [CosSupplierComponent, CosSupplierFooterComponent],
})
export class CosSupplierModule {}
