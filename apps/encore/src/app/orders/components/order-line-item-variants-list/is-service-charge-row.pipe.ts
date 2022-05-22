import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { ServiceChargeDomainModel } from '@esp/models';
import { VariantsGridDataItem } from './total-unit-row';

@Pipe({
  name: 'isServiceChargeRow',
})
export class IsServiceChargeRowPipe implements PipeTransform {
  /**
   * Transform
   *
   * @param {VariantsGridDataItem} item
   * @returns {boolean}
   */
  transform(item: VariantsGridDataItem): item is ServiceChargeDomainModel {
    return 'ServiceType' in item;
  }
}

@NgModule({
  declarations: [IsServiceChargeRowPipe],
  exports: [IsServiceChargeRowPipe],
})
export class IsServiceChargeRowPipeModule {}
