import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'displayDateValue',
})
export class DisplayDateValuePipe implements PipeTransform {
  constructor(private readonly datePipe: DatePipe) {}

  transform(date?: Date, dateFormat: string = 'longDate'): string {
    return date ? this.datePipe.transform(date, dateFormat) : '-';
  }
}
