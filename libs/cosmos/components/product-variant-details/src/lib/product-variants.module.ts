import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { ImageUrlPipeModule } from '@smartlink/products';
import { CosProductVariantsComponent } from './product-variants.component';

@NgModule({
  imports: [CommonModule, ImageUrlPipeModule],
  exports: [CosProductVariantsComponent],
  declarations: [CosProductVariantsComponent],
})
export class CosProductVariantsModule {}
