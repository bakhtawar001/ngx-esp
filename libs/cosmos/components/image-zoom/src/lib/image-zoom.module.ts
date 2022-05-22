import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CosImageZoomComponent } from './image-zoom.component';

@NgModule({
  imports: [CommonModule],
  declarations: [CosImageZoomComponent],
  exports: [CosImageZoomComponent],
})
export class CosImageZoomModule {}
