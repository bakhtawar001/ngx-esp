import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CosVideoThumbnailModule } from '@cosmos/components/video-thumbnail';
import { CosFeaturedVideoComponent } from './featured-video.component';

@NgModule({
  imports: [CommonModule, CosVideoThumbnailModule],
  exports: [CosFeaturedVideoComponent],
  declarations: [CosFeaturedVideoComponent],
})
export class CosFeaturedVideoModule {}
