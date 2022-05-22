import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CosButtonModule } from '@cosmos/components/button';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { FormatPricePipeModule, ImageUrlPipeModule } from '@smartlink/products';
import { CosProductNavigationComponent } from './product-navigation.component';

@NgModule({
  declarations: [CosProductNavigationComponent],
  imports: [
    CommonModule,

    RouterModule,

    FormatPricePipeModule,
    ImageUrlPipeModule,
    CosButtonModule,
  ],
  exports: [CosProductNavigationComponent],
})
export class CosProductNavigationModule {}
