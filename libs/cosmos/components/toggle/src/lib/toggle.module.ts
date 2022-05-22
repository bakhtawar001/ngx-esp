import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CosSlideToggleComponent } from './toggle.component';

@NgModule({
  imports: [CommonModule],
  declarations: [CosSlideToggleComponent],
  exports: [CosSlideToggleComponent],
})
export class CosSlideToggleModule {}
