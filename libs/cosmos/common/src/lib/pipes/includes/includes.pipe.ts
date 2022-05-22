import { NgModule, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'includes',
})
export class IncludesPipe implements PipeTransform {
  transform(
    value: unknown[] | string,
    valueToFind: unknown | string
  ): boolean | undefined {
    if (!value) {
      return undefined;
    }

    if (Array.isArray(value)) {
      return value.includes(valueToFind);
    } else {
      return value
        .toLowerCase()
        .includes((valueToFind as string)?.toLowerCase());
    }
  }
}

@NgModule({
  declarations: [IncludesPipe],
  exports: [IncludesPipe],
})
export class IncludesPipeModule {}
