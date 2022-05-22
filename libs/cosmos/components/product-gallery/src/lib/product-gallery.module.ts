import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CosProductCardModule } from '@cosmos/components/product-card';
import { CosSupplierModule } from '@cosmos/components/supplier';
import { FeatureFlagsModule } from '@cosmos/feature-flags';
import { CosProductGalleryComponent } from './product-gallery.component';

@NgModule({
  imports: [
    CommonModule,

    CosProductCardModule,
    CosSupplierModule,

    FeatureFlagsModule,
  ],
  exports: [CosProductGalleryComponent],
  declarations: [CosProductGalleryComponent],
})
export class CosProductGalleryModule {}
