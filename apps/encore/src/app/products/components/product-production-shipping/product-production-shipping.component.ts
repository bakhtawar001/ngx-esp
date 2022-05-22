import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, OnInit } from '@angular/core';
import { Product } from '@smartlink/models';
import {
  EvalDisplayValuePipeModule,
  MadeInUsaPipeModule,
} from '@smartlink/products';
import { flattenDeep } from 'lodash-es';
import { ProductChargesComponentModule } from '../product-charges';
import { ProductChargesTableComponentModule } from '../product-charges-table';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'esp-product-production-shipping',
  templateUrl: './product-production-shipping.component.html',
})
export class ProductProductionShippingComponent implements OnInit {
  @Input()
  product: Product;

  weights: string;
  packaging: string;
  options: string;

  ngOnInit() {
    this.weights = this.product?.Shipping?.Weight?.Values?.map(
      (value) => value.Name || value
    ).join(', ');

    this.packaging = flattenDeep(
      this.product?.Packaging?.map((element) =>
        (element.Values || element.Groups)?.map((value) => value.Name || value)
      )
    ).join(', ');

    this.options = (
      this.product?.Shipping?.Options?.Values ||
      this.product?.Shipping?.Options?.Groups
    )
      ?.map((option) => option.Name || option)
      .join(', ');
  }
}

@NgModule({
  declarations: [ProductProductionShippingComponent],
  imports: [
    CommonModule,
    ProductChargesComponentModule,
    ProductChargesTableComponentModule,

    EvalDisplayValuePipeModule,
    MadeInUsaPipeModule,
  ],
  exports: [ProductProductionShippingComponent],
})
export class ProductProductionShippingComponentModule {}
