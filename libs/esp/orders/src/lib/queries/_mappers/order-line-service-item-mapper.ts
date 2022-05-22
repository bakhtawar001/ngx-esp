import {
  Order,
  ServiceLineItem,
  ServiceLineItemDomainModel,
} from '@esp/models';
import {
  calculateConvertedItemTotalsWithTax,
  calculateTaxRate,
  calculateTotalsWithTaxRate,
} from '../../calculators';

export function mapServiceLineItem(
  serviceLineItem: ServiceLineItem,
  order: Order
): ServiceLineItemDomainModel {
  const taxRate = calculateTaxRate(serviceLineItem.TaxRates || []);
  const totals = calculateTotalsWithTaxRate(serviceLineItem, taxRate);
  const convertedTotals = calculateConvertedItemTotalsWithTax(
    serviceLineItem,
    order.Currencies || [],
    serviceLineItem.CurrencyCode,
    order.Discount,
    taxRate
  );
  return {
    ...serviceLineItem,
    Totals: totals,
    ConversionTotals: convertedTotals,
  };
}
