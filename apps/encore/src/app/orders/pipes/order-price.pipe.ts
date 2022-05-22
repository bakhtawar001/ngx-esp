import { CurrencyPipe } from '@angular/common';
import { NgModule, Pipe, PipeTransform } from '@angular/core';
import {
  Order,
  ProductLineItem,
  ServiceCharge,
  ServiceLineItem,
} from '@esp/models';

export type OrderLike =
  | Order
  | ProductLineItem
  | ServiceLineItem
  | ServiceCharge;

@Pipe({
  name: 'orderPrice',
})
export class OrderPricePipe implements PipeTransform {
  constructor(private readonly currencyPipe: CurrencyPipe) {}

  /**
   * Transform
   *
   * @param {number} value
   * @param {Order} order
   * @param {number} float
   * @returns {string}
   */
  transform(value: number, item: OrderLike, float: number = 2): string {
    return this.currencyPipe.transform(
      value,
      item?.CurrencyCode,
      item?.CurrencySymbol,
      this.getDigitsInfo(float)
    );
  }

  private getDigitsInfo(float: number) {
    return `1.2-${float}`;
  }
}

@NgModule({
  declarations: [OrderPricePipe],
  exports: [OrderPricePipe],
  providers: [CurrencyPipe],
})
export class OrderPricePipeModule {}
