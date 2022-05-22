import { NgModule } from '@angular/core';

import { CosRatingComponent } from './rating.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule],
  exports: [CosRatingComponent],
  declarations: [CosRatingComponent],
})
export class CosRatingModule {}
