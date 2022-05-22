import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { FormatPricePipe } from '../format-price';

@Pipe({
  name: 'formatPriceRange',
})
export class FormatPriceRangePipe implements PipeTransform {
  transform(product: any, args?: any): any {
    const pricePipe = new FormatPricePipe();

    const priceRange: any = {
      low: product.LowestPrice
        ? pricePipe.transform(product.LowestPrice, 'Price')
        : '',
      divider: '',
      high: product.HighestPrice
        ? pricePipe.transform(product.HighestPrice, 'Price')
        : '',
    };

    if (!priceRange.low && !priceRange.high) {
      priceRange.low = 'QUR';
    }

    if (priceRange.low === priceRange.high) {
      priceRange.high = '';
    }

    if (priceRange.low === 'QUR' && priceRange.high) {
      priceRange.low = '';
    }

    if (priceRange.high === 'QUR' && priceRange.low) {
      priceRange.high = '';
    }

    if (priceRange.low && priceRange.high) {
      priceRange.divider = ' - ';
    }

    return priceRange.low + priceRange.divider + priceRange.high;
  }
}

@NgModule({
  declarations: [FormatPriceRangePipe],
  exports: [FormatPriceRangePipe],
})
export class FormatPriceRangePipeModule {}
