import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { ProductVariantDomainModel } from '@esp/models';
import { VariantsGridDataItem } from './total-unit-row';

@Pipe({
  name: 'isVariantRow',
})
export class IsVariantRowPipe implements PipeTransform {
  /**
   * Transform
   *
   * @param {VariantsGridDataItem} item
   * @returns {boolean}
   */
  transform(item: VariantsGridDataItem): item is ProductVariantDomainModel {
    return 'VariantId' in item;
  }
}

@NgModule({
  declarations: [IsVariantRowPipe],
  exports: [IsVariantRowPipe],
})
export class IsVariantRowPipeModule {}
