import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { ProductLineItemDomainModel } from '@esp/models';
import { totalUnitsKey, VariantsGridDataItem } from './total-unit-row';

@Pipe({
  name: 'variantsGirdDataSource',
})
export class VariantsGridDataSourcePipe implements PipeTransform {
  /**
   * Transform
   *
   * @param {VariantsGridDataItem} item
   * @returns {boolean}
   */
  transform(lineItem: ProductLineItemDomainModel): VariantsGridDataItem[] {
    if (!lineItem) {
      return [];
    }

    const decorations = lineItem.Decorations || [];
    const decorationsServiceCharges = decorations.reduce((acc, curr) => {
      return [...curr.ServiceCharges, ...acc];
    }, []);

    const totalUnitsData = [
      {
        Type: totalUnitsKey,
        Value: lineItem.Totals.Units,
      },
    ];

    return [
      ...lineItem.Variants,
      ...totalUnitsData,
      ...decorationsServiceCharges,
      ...lineItem.ServiceCharges,
    ];
  }
}

@NgModule({
  declarations: [VariantsGridDataSourcePipe],
  exports: [VariantsGridDataSourcePipe],
})
export class VariantsGridDataSourcePipeModule {}
