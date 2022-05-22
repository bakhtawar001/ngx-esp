import { NgModule, Pipe, PipeTransform } from '@angular/core';
import {
  totalUnitsKey,
  TotalUnitsRow,
  VariantsGridDataItem,
} from './total-unit-row';

@Pipe({
  name: 'isTotalUnitsRow',
})
export class IsTotalUnitsRowPipe implements PipeTransform {
  /**
   * Transform
   *
   * @param {VariantsGridDataItem} item
   * @returns {boolean}
   */
  transform(item: VariantsGridDataItem): item is TotalUnitsRow {
    return 'Type' in item && item.Type === totalUnitsKey;
  }
}

@NgModule({
  declarations: [IsTotalUnitsRowPipe],
  exports: [IsTotalUnitsRowPipe],
})
export class IsTotalUnitsRowPipeModule {}
