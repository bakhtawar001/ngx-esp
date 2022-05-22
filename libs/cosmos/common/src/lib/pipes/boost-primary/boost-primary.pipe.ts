import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { sortBy } from 'lodash-es';

@Pipe({
  name: 'boostPrimary',
})
export class BoostPrimaryPipe implements PipeTransform {
  /**
   * Transform
   *
   * @param {any[]} array
   * @returns {any[]}
   */
  transform(mainArr: any[]): any[] {
    return sortBy(mainArr, [(u) => (u.IsPrimary ? 0 : 1)]);
  }
}

@NgModule({
  declarations: [BoostPrimaryPipe],
  exports: [BoostPrimaryPipe],
})
export class BoostPrimaryPipeModule {}
