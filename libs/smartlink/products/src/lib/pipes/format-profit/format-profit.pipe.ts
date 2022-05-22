import { NgModule, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatProfit',
})
export class FormatProfitPipe implements PipeTransform {
  transform(price: any): any {
    function parsePrice(price: any, currency: any) {
      let currencyStr = '$';
      const pricePrecision = 3;

      let val = parseFloat(price).toFixed(pricePrecision).toString();

      const valSplit = val.split('.');
      if (valSplit[1].length === 3 && valSplit[1].slice(-1) === '0') {
        val = valSplit[0] + '.' + valSplit[1].substring(0, 2);
      }
      if (currency === 'CAD') {
        currencyStr = 'C$';
      }
      const priceStr = currencyStr + val;
      return priceStr;
    }

    const listprice = price.Price;
    let cost = price.Cost;
    const preferred = price.PreferredPrice;

    if (preferred) {
      cost = preferred;
    }

    const profit = listprice - cost;

    return profit && profit > 0
      ? parsePrice(profit, price.CurrencyCode)
      : 'N/A';
  }
}

@NgModule({
  declarations: [FormatProfitPipe],
  exports: [FormatProfitPipe],
})
export class FormatProfitPipeModule {}
