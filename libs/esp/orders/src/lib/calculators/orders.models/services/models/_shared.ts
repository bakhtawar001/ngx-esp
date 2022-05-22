import { sumBy } from 'lodash-es';

import {
  IAuditable,
  LineItemCommonProps,
  LineItemTotalProps,
  LineItemTotals,
  TaxRate,
} from '@esp/models';

import { getDefaultOrderStatus } from './orders.models.OrderStatus';

export function createAuditProps(): IAuditable {
  return {
    CreatedBy: '',
    CreateDate: '',
    UpdatedBy: '',
    UpdateDate: null,
  };
}

export function createConversionTotals(): LineItemTotals {
  return {
    Amount: 0,
    Cost: 0,
    Margin: 0,
    SalesTax: 0,
    TaxableAmount: 0,
  };
}

export function createLineItemTotals(): LineItemTotals {
  return {
    Amount: 0,
    Cost: 0,
    Margin: 0,
    SalesTax: 0,
    TaxableAmount: 0,
  };
}

export function ensureArrayIsSequenced<T extends { Sequence: number }>(
  list: T[]
) {
  return list.map((item, index) =>
    item.Sequence === index ? item : { ...item, Sequence: index }
  );
}

export function createCommonLineItemProps(
  props: Partial<LineItemCommonProps> = {}
): LineItemCommonProps {
  return {
    Id: null,
    CorrelationId: null,
    Description: '',
    Sequence: 0,
    ShippingGroup: 0,
    Status: getDefaultOrderStatus(),
    VendorNotesVisible: false,
    CurrencyCode: 'USD',
    CurrencySymbol: '$',
    ConversionRate: 1.0,
    // ...createLineItemTotalProps(),
    ...createAuditProps(),
    ...props,
  };
}

export function createLineItemTotalProps(
  props: Partial<LineItemTotalProps> = {}
): LineItemTotalProps {
  return {
    Totals: createLineItemTotals(),
    ConversionTotals: createConversionTotals(),
    // TotalUnits: 0,
    // TotalPrice: 0,
    // TotalCost: 0,
    // ConvertedTotalCost: 0,
    // ConvertedTotalPrice: 0,
    ...props,
  };
}

export function removeItem<T>(arr: T[], item: number | T) {
  if (!item) {
    return arr;
  }
  if (typeof item === 'number') {
    if (arr[item]) {
      return [...arr].splice(item, 1);
    }
  } else {
    const index = arr.indexOf(item);
    return [...arr].splice(index, 1);
  }
}

export function roundToPlace(num: number, place: number) {
  return +(Math.round((num + ('e+' + place)) as any) + ('e-' + place));
}

export function calculateTaxRate(taxRates: TaxRate[]) {
  return sumBy(taxRates || [], (item) => item.Rate);
}

export function calculateSalesTax(
  taxableAmount: number,
  taxRate: number,
  orderDiscount: number
) {
  if (!taxRate) {
    return 0;
  }
  const multiplier = taxRate ? taxRate / 100 : 0;

  let salesTax = 0;
  if (orderDiscount > 0) {
    salesTax =
      (taxableAmount - taxableAmount * (orderDiscount / 100)) * multiplier;
  } else {
    salesTax = taxableAmount * multiplier;
  }
  return toFixedNumber(salesTax, 4);
}

export function isObject(value: any) {
  return value !== null && typeof value === 'object';
}

export function toFixedNumber(value: any, decimals?: number): number {
  if (value) {
    value = Number(Number(value).toFixed(decimals || 4));
  }
  return value;
}
