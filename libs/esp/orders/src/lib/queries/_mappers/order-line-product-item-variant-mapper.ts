import {
  OrderCurrency,
  ProductVariant,
  ProductVariantDomainModel,
} from '@esp/models';
import {
  calculateConvertedItemTotals,
  calculateMarginPercent,
  calculateTotalsWithTaxRate,
} from '../../calculators';

export function mapProductLineItemVariant(
  productVariant: ProductVariant,
  conversionRates: OrderCurrency[],
  orderCurrencyCode: string,
  orderDiscount: number,
  taxRate: number,
  ignoreMargin: boolean
): ProductVariantDomainModel {
  const totals = calculateTotalsWithTaxRate(productVariant, taxRate);
  const marginPercent = !ignoreMargin
    ? calculateMarginPercent(productVariant)
    : undefined;
  const convertedTotals = calculateConvertedItemTotals(
    productVariant,
    conversionRates,
    orderCurrencyCode,
    orderDiscount
  );
  return {
    ...productVariant,
    Totals: totals,
    MarginPercent: marginPercent,
    ConversionTotals: convertedTotals,
  };
}
