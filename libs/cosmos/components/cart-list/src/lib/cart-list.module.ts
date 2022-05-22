import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { ImageUrlPipeModule } from '@smartlink/products';
import { CosCartListComponent } from './cart-list.component';

@NgModule({
  declarations: [CosCartListComponent],
  imports: [CommonModule, ImageUrlPipeModule],
  exports: [CosCartListComponent],
})
export class CosCartListModule {}
