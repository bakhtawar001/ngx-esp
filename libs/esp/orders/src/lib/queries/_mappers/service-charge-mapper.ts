import {
  OrderCurrency,
  ServiceCharge,
  ServiceChargeDomainModel,
} from '@esp/models';
import {
  calculateConvertedItemTotalsWithTax,
  calculateMarginPercent,
  calculateTotalsWithTaxRate,
} from '../../calculators';

export function mapServiceCharge(
  serviceCharge: ServiceCharge,
  totalUnits: number,
  conversionRates: OrderCurrency[],
  currencyCode: string,
  orderDiscount: number,
  taxRate: number,
  ignoreMargin: boolean
): ServiceChargeDomainModel {
  const updatedServiceCharge = updateRunChargeUnits(serviceCharge, totalUnits);
  const totals = calculateTotalsWithTaxRate(updatedServiceCharge, taxRate);
  const marginPercent = !ignoreMargin
    ? calculateMarginPercent(updatedServiceCharge)
    : undefined;
  const convertedTotals = calculateConvertedItemTotalsWithTax(
    serviceCharge,
    conversionRates,
    currencyCode,
    orderDiscount,
    taxRate
  );
  return {
    ...updatedServiceCharge,
    Totals: totals,
    ConversionTotals: convertedTotals,
    MarginPercent: marginPercent, // This value is purely for display purposes
  };
}

function updateRunChargeUnits(
  serviceCharge: ServiceCharge,
  totalUnits: number
): ServiceCharge {
  if (serviceCharge.IsRunCharge) {
    const newServiceCharge: ServiceCharge = {
      ...serviceCharge,
      Quantity: totalUnits,
    };
    return newServiceCharge;
  }
  return serviceCharge;
}
