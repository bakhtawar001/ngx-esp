import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PRODUCT_DATA_DEMO } from './product-variant-data.demo';

@Component({
  selector: 'cos-product-variants-demo-component',
  template: `
    <div style="max-width: 500px;width: 100%;">
      <cos-product-variants
        [variant]="colorVariant"
        [hasImages]="hasImages"
      ></cos-product-variants>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosProductVariantsDemoComponent {
  @Input() hasImages = false;

  get product() {
    return PRODUCT_DATA_DEMO;
  }

  colorVariant = {
    title: 'Colors',
    options: this.product.Attributes.Colors.Values,
  };
}
