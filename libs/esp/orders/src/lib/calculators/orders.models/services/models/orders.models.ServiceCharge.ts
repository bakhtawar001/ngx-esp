import {
  OrderCurrency,
  ServiceCharge,
  ServiceLineItem,
  TaxRate,
} from '@esp/models';
import * as LineItemCalculator from './orders.models.LineItemCalculator';
import { calculateConvertedItemTotalsWithTax } from './orders.models.LineItemCalculator';
import { calculateTaxRate, createCommonLineItemProps } from './_shared';

/* TODO: Remove - left here for reference during extraction
(function () {
  'use strict';

  angular.module('orders.models').factory('ServiceCharge', ServiceCharge);

  ServiceCharge.$inject = [
    '$simpleModelFactory',
    'LineItemCalculator_XX',
    'Company',
  ];

  function ServiceCharge($simpleModelFactory, LineItemCalculator, Company) {
    var model = $simpleModelFactory({
      pk: 'Id',
      map: {
        TaxRates: LineItemCalculator.TaxRate.List,
        Totals: LineItemCalculator,
        Supplier: Company,
      },
      defaults: {
        IsRunCharge: false,
        ServiceType: 'GSCH',
        Description: '',
        Quantity: 1,
        Price: 0,
        Cost: 0,
        Margin: 0,
        ConvertedPrice: 0,
        ConvertedCost: 0,
        ConvertedMargin: 0,
        IsTaxable: true,
        IsVisible: true,
        TaxRates: [],
        Totals: {},
        CurrencyCode: 'USD',
      },
      init: init,
      instance: {
        addTaxRate: addTaxRate,
        removeTaxRate: removeTaxRate,
        calculateConvertedTotals: calculateConvertedTotals,
        calculateTotals: calculateTotals,
        setIsTaxable: setIsTaxable,
      },
    });

    return model;

    function init(instance) {
      instance.calculateTotals();
    }

    function addTaxRate(options) {
      addItem(this.TaxRates, options, LineItemCalculator.TaxRate);
      calculateTotals.apply(this);
    }

    function removeTaxRate(item) {
      removeItem(this.TaxRates, item);
      calculateTotals.apply(this);
    }

    function addItem(arr, options, Entity, hasSequence) {
      var item;

      if (options instanceof Entity) {
        item = options;
      } else {
        item = new Entity(options);
      }

      arr.push(item);

      // hasSequence never seems to be true
      hasSequence && setSequence(arr);
    }

    function removeItem(arr, item, hasSequence) {
      if (angular.isDefined(item)) {
        if (typeof item === 'number') {
          if (angular.isDefined(arr[item])) {
            arr.splice(item, 1);
          }
        } else {
          arr.splice(arr.indexOf(item), 1);
        }

        // hasSequence never seems to be true
        hasSequence && setSequence(arr);
      }
    }

    function calculateConvertedTotals(
      conversionRates: OrderCurrency[],
      orderCurrency: string,
      orderDiscount: number
    ) {
      return calculateConvertedServiceChargeTotals(this, conversionRates, this.TaxRates, orderCurrency, orderDiscount);
    }

    function calculateTotals(ignoreMargin, formatValues) {
      const result = calculateServiceChargeTotalProperties(
        this,
        calculateServiceChargeTaxRate(this, this.TaxRates),
        ignoreMargin,
        formatValues
      );
      merge(this, result); // MUTATE!

      this._totalTaxRate = result.Totals.TaxRate;
    }

    function setIsTaxable(isTaxable) {
      this.IsTaxable = isTaxable;
    }

    function setSequence(arr) {
      angular.forEach(arr, function (v, i) {
        v.Sequence = i;
      });
    }
  }
})();
*/

export function calculateServiceChargeTotalProperties(
  serviceCharge: ServiceCharge,
  taxRate: number,
  ignoreMargin: boolean = false,
  formatValues: boolean = false
) {
  const totalsWithTaxRate = LineItemCalculator.calculateTotalsWithTaxRate(
    serviceCharge,
    taxRate
  );

  const margin = !ignoreMargin
    ? LineItemCalculator.calculateMarginPercent(serviceCharge)
    : undefined;
  const formattedLineItemValues = formatValues
    ? LineItemCalculator.formatLineItemValues(serviceCharge)
    : {};

  return {
    Totals: totalsWithTaxRate,
    Margin: margin,
    ...formattedLineItemValues,
  };
}

export function calculateConvertedServiceChargeTotals(
  serviceCharge: ServiceCharge | ServiceLineItem,
  conversionRates: OrderCurrency[],
  taxRates: TaxRate[],
  orderCurrency: string,
  orderDiscount: number
) {
  const taxRate = calculateTaxRate(taxRates);
  return calculateConvertedItemTotalsWithTax(
    serviceCharge,
    conversionRates,
    orderCurrency,
    orderDiscount,
    taxRate
  );
}

export function createServiceCharge(
  props: Partial<ServiceCharge>
): ServiceCharge {
  return {
    IsRunCharge: false,
    ServiceType: 'GSCH',
    Quantity: 1,
    Price: 0,
    Cost: 0,
    // Margin: 0,
    // ConvertedPrice: 0,
    // ConvertedCost: 0,
    // ConvertedMargin: 0,
    IsTaxable: true,
    IsVisible: true,
    // TaxRates: [],
    ...createCommonLineItemProps(),
    ...props,
  };
}
