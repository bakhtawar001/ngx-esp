import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'displayCurrencyValue',
})
export class DisplayCurrencyValuePipe implements PipeTransform {
  constructor(private readonly currencyPipe: CurrencyPipe) {}

  transform(value: number): string {
    return !!value && value > 0
      ? `${this.currencyPipe.transform(value, 'USD')}`
      : '-';
  }
}
