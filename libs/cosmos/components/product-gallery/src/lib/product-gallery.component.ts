import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'cos-product-gallery',
  templateUrl: './product-gallery.component.html',
  styleUrls: ['./product-gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosProductGalleryComponent {
  @Input() heading = '';
  @Input() description = '';
  @Input() size = '';
  @Input() products: any[] = [];
  @Input() viewMoreUrl = '';
  @Input() galleryIconUrl = '';
}
