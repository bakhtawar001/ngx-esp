import { CommonModule } from '@angular/common';
import { Component, Input, NgModule } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { Product, AttributeValue, Charge } from '@smartlink/models';
import { EvalDisplayValuePipeModule } from '@smartlink/products';
import { ProductChargesComponentModule } from '../product-charges';
import { ProductChargesTableComponentModule } from '../product-charges-table';
import { ProductOptionsComponentModule } from '../product-options';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'esp-product-imprint-methods',
  templateUrl: './product-imprint-methods.component.html',
  styleUrls: ['./product-imprint-methods.component.scss'],
})
export class ProductImprintMethodsComponent {
  @Input()
  set product(p: Product) {
    this._product = p;
  }

  public _product: Product;

  get imprintMethods() {
    return this._product.Imprinting?.Methods?.Values?.map(
      (m: AttributeValue) => m.Name
    ).join(', ');
  }

  get imprintLocations() {
    return this._product.Imprinting?.Locations?.Values?.map(
      (m: AttributeValue) => m.Name || m
    ).join(', ');
  }

  get imprintSizes() {
    return this._product.Imprinting?.Sizes?.Values?.map(
      (m: AttributeValue) => m.Name
    ).join(', ');
  }

  get hasMethodCharges() {
    return !!this._product.Imprinting?.Methods?.Values?.filter(
      (m: AttributeValue) => !!m.Charges?.length
    ).length;
  }

  get hasServiceCharges() {
    return !!this._product.Imprinting?.Services?.Values?.filter(
      (val: AttributeValue) => !!val.Charges
    ).length;
  }

  get hasColorCharges() {
    return !!this._product.Imprinting?.Colors?.Values?.filter(
      (val: AttributeValue) => !!val.Charges
    ).length;
  }

  get hasLocationCharges() {
    return !!this._product.Imprinting?.Locations?.Values?.filter(
      (val: AttributeValue) => !!val.Charges
    ).length;
  }

  getOptionValues(values: AttributeValue[]) {
    return values.map((v) => v.Name).join(', ');
  }

  getChargeTypes(values: Charge[]) {
    return values.map((v) => v.Description).join(', ');
  }

  getOptionTitle(option) {
    const hidePrefixRegex = /(Additional Locations?|Additional Colors?)/g;

    return hidePrefixRegex.test(option.Name) ||
      hidePrefixRegex.test(option.Type)
      ? option.Name || option.Type
      : `Imprint Option: ${option.Name || option.Type}`;
  }

  isString(val: any): boolean {
    if (Array.isArray(val)) {
      return typeof val[0] === 'string';
    }

    return typeof val === 'string';
  }

  hasOptionsOrCharges(objects: any[]) {
    return objects.filter((o) => !!o.Options || !!o.Charges).length;
  }
}

@NgModule({
  declarations: [ProductImprintMethodsComponent],
  imports: [
    CommonModule,

    MatGridListModule,
    EvalDisplayValuePipeModule,

    ProductChargesComponentModule,
    ProductChargesTableComponentModule,
    ProductOptionsComponentModule,
  ],
  exports: [ProductImprintMethodsComponent],
})
export class ProductImprintMethodsComponentModule {}
