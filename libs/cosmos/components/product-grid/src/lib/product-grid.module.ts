import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { ImageUrlPipeModule } from '@smartlink/products';
import { IsInViewportModule } from '@cosmos/components/is-in-viewport';
import { CosSupplierModule } from '@cosmos/components/supplier';

import { CosProductGridComponent } from './product-grid.component';

@NgModule({
  imports: [
    CommonModule,
    CosSupplierModule,
    ImageUrlPipeModule,
    IsInViewportModule,
  ],
  exports: [CosProductGridComponent],
  declarations: [CosProductGridComponent],
})
export class CosProductGridModule {}
