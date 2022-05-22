import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PRODUCTS_DATA_DEMO } from './product-grid-data.demo';

@Component({
  selector: 'cos-product-grid-demo-component',
  template: `<div style="width: 280px">
    <cos-product-grid [products]="products"></cos-product-grid>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosProductGridDemoComponent {
  @Input() products = PRODUCTS_DATA_DEMO;
}
