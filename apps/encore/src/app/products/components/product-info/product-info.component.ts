import { CommonModule } from '@angular/common';
import { Component, Input, NgModule } from '@angular/core';
import { Product } from '@smartlink/models';
import {
  EvalDisplayValuePipeModule,
  FormatArrayListPipeModule,
} from '@smartlink/products';
import { ProductChargesComponentModule } from '../product-charges';
import { ProductChargesTableComponentModule } from '../product-charges-table';
import { ProductOptionsComponentModule } from '../product-options';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'esp-product-info',
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.scss'],
})
export class ProductInfoComponent {
  @Input() product: Product;
}

@NgModule({
  declarations: [ProductInfoComponent],
  imports: [
    CommonModule,

    ProductChargesComponentModule,
    ProductChargesTableComponentModule,
    ProductOptionsComponentModule,

    EvalDisplayValuePipeModule,
    FormatArrayListPipeModule,
  ],
  exports: [ProductInfoComponent],
})
export class ProductInfoComponentModule {}
