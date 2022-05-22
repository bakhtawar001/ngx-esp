import { NgModule, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'madeInUSA',
})
export class MadeInUsaPipe implements PipeTransform {
  transform(origin: string[], args?: any): any {
    let ret = 'Supplier has not specified';
    if (origin && origin.length) {
      for (let i = 0; i < origin.length; i++) {
        if (origin[i].match(/(USA|U\.S\.A)/)) {
          ret = 'Yes';
          break;
        } else {
          ret = 'No';
        }
      }
    }
    return ret;
  }
}

@NgModule({
  declarations: [MadeInUsaPipe],
  exports: [MadeInUsaPipe],
})
export class MadeInUsaPipeModule {}
