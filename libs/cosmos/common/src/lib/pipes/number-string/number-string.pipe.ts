import { formatNumber } from '@angular/common';
import { NgModule, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberString',
})
export class NumberStringPipe implements PipeTransform {
  transform(value: string | number): string | number {
    if (!value || (typeof value !== 'number' && isNaN(Number(value)))) {
      return value;
    }

    return formatNumber(value as number, 'en_US');
  }
}

@NgModule({
  declarations: [NumberStringPipe],
  exports: [NumberStringPipe],
})
export class NumberStringPipeModule {}
