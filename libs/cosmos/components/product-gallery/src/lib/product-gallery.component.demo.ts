import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'cos-example-gallery-demo-component',
  template: ` <cos-product-gallery
    [galleryIconUrl]="galleryIcon"
    [heading]="heading"
    [viewMoreUrl]="viewMoreUrl"
    [products]="products"
    [description]="description"
    [size]="size"
  ></cos-product-gallery>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosProductGalleryDemoComponent {
  @Input() heading;
  @Input() size;
  @Input() galleryIcon;
  @Input() description;
  viewMoreUrl = '#';
  @Input() products;
}
