import { NgModule, Pipe, PipeTransform } from '@angular/core';

import { Utils } from '../../utils';

@Pipe({
  name: 'filterBy',
})
export class FilterByPipe implements PipeTransform {
  transform<T>(mainArr: T[], props: (keyof T)[], searchText: string): T[] {
    const text = searchText?.trim().toLocaleLowerCase();

    return text
      ? mainArr.filter((item) =>
          Utils.searchInObject(
            props.reduce((reduced, prop) => {
              reduced[prop] = item[prop];
              return reduced;
            }, {} as Partial<T>),
            text
          )
        )
      : mainArr;
  }
}

@NgModule({
  declarations: [FilterByPipe],
  exports: [FilterByPipe],
})
export class FilterByPipeModule {}
