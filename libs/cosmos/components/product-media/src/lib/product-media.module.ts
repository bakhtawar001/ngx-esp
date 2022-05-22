import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CosButtonModule } from '@cosmos/components/button';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { ImageUrlPipeModule } from '@smartlink/products';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { CosImageZoomModule } from '@cosmos/components/image-zoom';
import { CosVideoPlayerModule } from '@cosmos/components/video-player';
import { CosVideoThumbnailModule } from '@cosmos/components/video-thumbnail';
import { CosDropzonePreviewComponent } from './product-media-dropzone-preview';
import { CosProductMediaComponent } from './product-media.component';

@NgModule({
  imports: [
    CommonModule,
    CosImageZoomModule,
    CosVideoPlayerModule,
    CosVideoThumbnailModule,
    NgxDropzoneModule,
    CosButtonModule,
    ImageUrlPipeModule,
  ],
  exports: [CosProductMediaComponent, CosDropzonePreviewComponent],
  declarations: [CosProductMediaComponent, CosDropzonePreviewComponent],
})
export class CosProductMediaModule {}
