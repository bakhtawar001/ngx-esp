import { OrderCurrency } from '@esp/models';
import { convertCurrency } from './orders.models.Currency';
import { asNumber } from './utils';
import { calculateSalesTax, isObject, toFixedNumber } from './_shared';

/* TODO: Remove - left here for reference during extraction
(function () {
  'use strict';

  angular
    .module('orders.models')
    .factory('LineItemCalculator', LineItemCalculator);

  LineItemCalculator.$inject = ['$simpleModelFactory', 'Currency', 'TaxRate_XX'];

  function LineItemCalculator($simpleModelFactory, Currency, TaxRate) {
    var model = $simpleModelFactory({
      defaults: {
        Cost: 0,
        Amount: 0,
        Margin: 0,
      },
      calculateConvertedTotals: (item, conversionRates, orderCurrency, discount) => {
        const unitTotals = calculateConvertedSingleUnitTotals(
          item,
          conversionRates,
          orderCurrencyCode
        );

        // MUTATIONS!
        item.ConvertedPrice = unitTotals.ConvertedPrice;
        item.ConvertedCost = unitTotals.ConvertedCost;
        item.ConvertedMargin = unitTotals.ConvertedMargin;

        return calculateQuantityTotals({
          IsTaxable: item.IsTaxable,
          Cost: unitTotals.ConvertedCost,
          Price: unitTotals.ConvertedPrice,
          Quantity: item.Quantity,
        });
      },
      calculateMargin: (...args: Parameters<typeof calculateMargin>) => {
        const item = args[0];
        const margin = calculateMargin(...args);
        (<any>item).Margin = margin; // MUTATE!
      },
      calculateTotals: (...args: Parameters<typeof calculateTotals>) => {
        const item = args[0];
        const result = calculateAllTotalProperties(...args, false, false);

        merge(item, {
          Totals: result.totals,
          Margin: result.margin,
          ...result.formattedLineItemValues
        }); // MUTATE!
        return item;
      },
      formatLineItemValues: (...args: Parameters<typeof formatLineItemValues>) => {
        const item = args[0];
        const result = formatLineItemValues(...args);
        merge(item, result); // MUTATE!
        return item;
      },
      Currency: Currency,
      TaxRate: TaxRate,
    });

    return model;
  }
})();
*/

export function calculateAllTotalProperties(
  item: {
    Cost: number;
    Price: number;
    Quantity: number;
    IsTaxable: boolean;
  },
  ignoreMargin: boolean,
  formatValues: boolean
) {
  const totals = calculateTotals(item);

  const margin = !ignoreMargin ? calculateMarginPercent(item) : undefined;

  const totalsSummary = {
    ...item,
    Totals: totals,
    Margin: margin,
  };

  const formattedLineItemValues = formatValues
    ? formatLineItemValues(totalsSummary)
    : {};

  return {
    totals,
    margin,
    formattedLineItemValues,
  };
}

export function calculateTotals(item: {
  Cost: number;
  Price: number;
  Quantity: number;
  IsTaxable: boolean;
}) {
  var qty = asNumber(item.Quantity),
    price = asNumber(item.Price),
    cost = asNumber(item.Cost);

  const totals = {
    Units: qty,
    Amount: toFixedNumber(qty * price, 4),
    Cost: toFixedNumber(qty * cost, 4),
    Margin: toFixedNumber((price - cost) * qty, 4),
    TaxableAmount: toFixedNumber(item.IsTaxable ? qty * price : 0, 4),
  };
  return totals;
}

export function calculateTotalsWithTaxRate(
  item: Parameters<typeof calculateTotals>[number],
  taxRate: number
) {
  const totals = calculateTotals(item);
  return {
    ...totals,
    SalesTax: calculateSalesTax(totals.TaxableAmount, taxRate, 0),
    TaxRate: taxRate,
  };
}

export function calculateConvertedItemTotals(
  item: {
    Cost: number;
    Price: number;
    Quantity: string | number; // TODO: could see if we can narrow this type to number
    IsTaxable: boolean;
    CurrencyCode: string;
  },
  conversionRates: OrderCurrency[],
  orderCurrencyCode: string,
  discount: number = 0 // TODO: REMOVE - not used for line items!
) {
  const unitTotals = calculateConvertedSingleUnitTotals(
    item,
    conversionRates,
    orderCurrencyCode
  );

  return calculateQuantityTotals({
    IsTaxable: item.IsTaxable,
    Cost: unitTotals.ConvertedCost,
    Price: unitTotals.ConvertedPrice,
    Quantity: item.Quantity,
  });
}

function calculateQuantityTotals(item: {
  Cost: number;
  Price: number;
  Quantity: string | number;
  IsTaxable: boolean;
}) {
  const qty = asNumber(item.Quantity);
  const cost = item.Cost;
  const price = item.Price;
  return {
    Amount: toFixedNumber(qty * price, 4),
    Cost: toFixedNumber(qty * cost, 4),
    Margin: toFixedNumber((price - cost) * qty, 4),
    TaxableAmount: toFixedNumber(item.IsTaxable ? qty * price : 0, 4),
  };
}

function calculateConvertedSingleUnitTotals(
  item: {
    Cost: number;
    Price: number;
    IsTaxable: boolean;
    CurrencyCode: string;
  },
  conversionRates: OrderCurrency[],
  orderCurrencyCode: string
) {
  const price = convertCurrency(
      item,
      'Price',
      orderCurrencyCode,
      conversionRates
    ),
    cost = convertCurrency(item, 'Cost', orderCurrencyCode, conversionRates);

  return {
    ConvertedPrice: price,
    ConvertedCost: cost,
    ConvertedMargin: price - cost,
  };
}

export function calculateConvertedItemTotalsWithTax(
  item: {
    Cost: number;
    Price: number;
    Quantity: string | number; // TODO: could see if we can narrow this type to number
    IsTaxable: boolean;
    CurrencyCode: string;
  },
  conversionRates: OrderCurrency[],
  orderCurrency: string,
  orderDiscount: number,
  taxRate: number
) {
  const convertedTotals = calculateConvertedItemTotals(
    item,
    conversionRates,
    orderCurrency,
    orderDiscount
  );
  return {
    ...convertedTotals,
    SalesTax: calculateSalesTax(convertedTotals.TaxableAmount, taxRate, 0),
    TaxRate: taxRate,
  };
}

export function calculateMarginPercent(item: { Price: number; Cost: number }) {
  var price = asNumber(item.Price),
    cost = asNumber(item.Cost);
  const percentage = ((price - cost) / (price || 1)) * 100;
  return toFixedNumber(percentage, 4);
}

const lineItemValueKeys = [
  'Cost',
  'Amount',
  'Margin',
  'Price',
  // 'ConvertedPrice',
  // 'ConvertedCost',
  // 'ConvertedMargin',
] as const;
const lineItemValuesObjectKeys = ['Totals'] as const;
type LineItemValueKey = typeof lineItemValueKeys[number];
type LineItemValuesObjectKey = typeof lineItemValuesObjectKeys[number];
type LineItemValuesObject = { [key in LineItemValueKey]?: number } &
  { [key in LineItemValuesObjectKey]?: LineItemValuesObject };
type LineItemFormattedValuesObject = { [key in LineItemValueKey]?: number } &
  { [key in LineItemValuesObjectKey]?: LineItemFormattedValuesObject };

export function formatLineItemValues(item: LineItemValuesObject) {
  const formattedLineItem: LineItemFormattedValuesObject = {};
  lineItemValueKeys.forEach(function (key) {
    const value = item[key];
    if (value) {
      formattedLineItem[key] = toFixedNumber(value);
    }
  });
  lineItemValuesObjectKeys.forEach(function (key) {
    const value = item[key];
    if (isObject(value) && !Array.isArray(value)) {
      formattedLineItem[key] = formatLineItemValues(value);
    }
  });

  return formattedLineItem;
}
