import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCardModule } from '@cosmos/components/card';
import { CosPresentationHeaderComponent } from './presentation-header.component';

@NgModule({
  imports: [CommonModule, CosButtonModule, CosCardModule],
  declarations: [CosPresentationHeaderComponent],
  exports: [CosPresentationHeaderComponent],
})
export class CosPresentationHeaderModule {}
