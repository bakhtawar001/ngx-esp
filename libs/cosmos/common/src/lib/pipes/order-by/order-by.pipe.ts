import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { orderBy } from 'lodash-es';

@Pipe({
  name: 'orderBy',
})
export class OrderByPipe implements PipeTransform {
  transform = orderBy;
}

@NgModule({
  declarations: [OrderByPipe],
  exports: [OrderByPipe],
})
export class OrderByPipeModule {}
