import { DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'displayNumberValue',
})
export class DisplayNumberValuePipe implements PipeTransform {
  constructor(private readonly decimalPipe: DecimalPipe) {}

  transform(value: number): string {
    return !!value && value > 0 ? `${this.decimalPipe.transform(value)}` : '-';
  }
}
