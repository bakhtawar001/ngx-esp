import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InitialsPipeModule } from '@cosmos/common';
import { CosAvatarModule } from '@cosmos/components/avatar';
import { CosCardModule } from '@cosmos/components/card';
import { CosProductGridModule } from '@cosmos/components/product-grid';
import { CosPresentationCardComponent } from './presentation-card.component';

@NgModule({
  imports: [
    CommonModule,
    CosAvatarModule,
    CosCardModule,
    CosProductGridModule,
    MatTooltipModule,

    InitialsPipeModule,
  ],
  exports: [CosPresentationCardComponent],
  declarations: [CosPresentationCardComponent],
})
export class CosPresentationCardModule {}
