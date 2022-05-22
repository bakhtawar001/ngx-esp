import { NgModule, Pipe, PipeTransform } from '@angular/core';

import { ImageUrlService } from '../../services/image-url.service';

@Pipe({
  name: 'imageUrlPipe',
})
export class ImageUrlPipe implements PipeTransform {
  constructor(private imgUrlService: ImageUrlService) {}

  transform(url: string, base?: string): any {
    return this.imgUrlService.getImageUrl(url, base);
  }
}

@NgModule({
  declarations: [ImageUrlPipe],
  exports: [ImageUrlPipe],
})
export class ImageUrlPipeModule {}
