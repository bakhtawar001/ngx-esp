import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { compact } from 'lodash-es';

@Pipe({
  name: 'formatArrayList',
})
export class FormatArrayListPipe implements PipeTransform {
  transform(
    arr: any[],
    seperator: string = ', ',
    field: string | null = null
  ): string {
    if (arr) {
      if (field) {
        arr = arr.map((item) => item[field]);
      }

      return compact(arr)
        .map((v) => v.trim())
        .join(seperator);
    }

    return '';
  }
}

@NgModule({
  declarations: [FormatArrayListPipe],
  exports: [FormatArrayListPipe],
})
export class FormatArrayListPipeModule {}
