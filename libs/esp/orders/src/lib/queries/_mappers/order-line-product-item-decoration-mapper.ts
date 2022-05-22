import {
  DecorationLineItem,
  DecorationLineItemDomainModel,
  OrderCurrency,
  ServiceChargeDomainModel,
} from '@esp/models';
import { calculateDecorationTotals } from '../../calculators';
import { mapServiceCharge } from './service-charge-mapper';

export function mapProductLineItemDecoration(
  decorationLineItem: DecorationLineItem,
  totalUnits: number,
  conversionRates: OrderCurrency[],
  currencyCode: string,
  orderDiscount: number,
  taxRate: number,
  ignoreMargin: boolean
): DecorationLineItemDomainModel {
  const subItems = {
    ServiceCharges: (
      decorationLineItem.ServiceCharges || []
    ).map<ServiceChargeDomainModel>((charge) =>
      mapServiceCharge(
        charge,
        totalUnits,
        conversionRates,
        currencyCode,
        orderDiscount,
        taxRate,
        ignoreMargin
      )
    ),
  };
  const totals = calculateDecorationTotals(subItems);
  return {
    ...decorationLineItem,
    ...subItems,
    Totals: totals,
  };
}
