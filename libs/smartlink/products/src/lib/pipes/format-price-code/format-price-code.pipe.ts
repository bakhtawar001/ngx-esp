import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { Price } from '@smartlink/models';

@Pipe({ name: 'formatPriceCode' })
export class FormatPriceCodePipe implements PipeTransform {
  transform(prices: Price[] = []): string {
    let formatted = '';
    let count = 0;
    let lastPrice = '';

    for (const price of prices) {
      if (lastPrice !== price.DiscountCode) {
        if (lastPrice) {
          formatted += count > 1 ? `${count}${lastPrice}` : lastPrice;
          count = 0;
        }
        lastPrice = price.DiscountCode || '';
      }
      count++;
    }

    if (count > 0 && lastPrice) {
      formatted += count > 1 ? `${count}${lastPrice}` : lastPrice;
    }

    if (formatted) {
      formatted = `(${formatted})`;
    }

    return formatted;
  }
}

@NgModule({
  declarations: [FormatPriceCodePipe],
  exports: [FormatPriceCodePipe],
})
export class FormatPriceCodePipeModule {}
