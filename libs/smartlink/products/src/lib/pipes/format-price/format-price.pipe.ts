import { NgModule, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatPrice',
})
export class FormatPricePipe implements PipeTransform {
  transform(
    value: any,
    key?: string,
    showQuantity?: boolean,
    priceDefault?: string
  ): any {
    const price = value && key ? parseFloat(value[key]) : value;
    let priceStr = priceDefault || 'QUR';

    if (price && price > 0) {
      let currencyStr = '$';
      let val = price.toFixed(3).toString();
      const valSplit = val.split('.');

      if (valSplit[1].length === 3 && valSplit[1].slice(-1) === '0') {
        val = valSplit[0] + '.' + valSplit[1].substring(0, 2);
      }

      if (value?.CurrencyCode === 'CAD') {
        currencyStr = 'C$';
      }

      priceStr = currencyStr + val;

      if (showQuantity) {
        const qty =
          typeof value.Quantity === 'object'
            ? value.Quantity.From
            : value.Quantity;
        priceStr = (qty || '1') + ' @ ' + priceStr;
      }
    }

    return priceStr;
  }
}

@NgModule({
  declarations: [FormatPricePipe],
  exports: [FormatPricePipe],
})
export class FormatPricePipeModule {}
