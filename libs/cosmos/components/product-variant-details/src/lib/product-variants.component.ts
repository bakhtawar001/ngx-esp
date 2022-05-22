import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'cos-product-variants',
  templateUrl: 'product-variants.component.html',
  styleUrls: ['product-variants.component.scss'],
  // eslint-disable-next-line @angular-eslint/use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosProductVariantsComponent {
  @Input() variant: any;
  @Input() hasImages = false;

  imageError = false;

  onImageError(): void {
    this.imageError = true;
  }
}
