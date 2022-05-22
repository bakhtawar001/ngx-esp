import { CurrencyType } from '@esp/lookup-types';
import { OrderCurrency } from '@esp/models';
import { asNumber, KeysOfType } from './utils';

/* TODO: Remove - left here for reference during extraction
(function () {
  'use strict';

  angular.module('orders.models').factory('Currency', Currency);

  Currency.$inject = ['$simpleModelFactory', 'LookupTypes'];

  function Currency($simpleModelFactory ,LookupTypes) {
    var Model = $simpleModelFactory({
      pk: 'Id',
      defaults: {
        CurrencyCode: '',
        ConversionRate: '',
      },
      instance: {
        getCurrency: getCurrency,
        getSymbol: getSymbol,
      },
      list: {
        defaults: defaults,
      },
      convert: convertCurrency,
      supportedCurrencies: getSupportedCurrencies,
    });
    return Model;
  }
}) ();

*/

export function convertCurrency<
  T extends { CurrencyCode: string; [key: string]: any }
>(
  item: T,
  key: KeysOfType<T, string | number>,
  orderCurrencyCode: string,
  conversionRates: OrderCurrency[]
) {
  var currency = [],
    convertedNumber = asNumber(item[key]);

  if (orderCurrencyCode !== item.CurrencyCode) {
    if (conversionRates && conversionRates.length) {
      currency = conversionRates.filter(function (cur) {
        return cur.ConversionRate && cur.CurrencyCode === item.CurrencyCode;
      });

      if (currency.length) {
        convertedNumber *= currency[0].ConversionRate;
      }
    }
  }

  return convertedNumber;
}

const supportedCurrencies: string[] = ['USD', 'CAD'];

/* Potentially not needed
function defaults(instance: { Currencies: OrderCurrency[] }) {
  let hasCurrency: boolean;

  supportedCurrencies.forEach(function (supported) {
    // Mark - BUG? Overwrites previous
    hasCurrency = instance.Currencies.some(function (cur) {
      return cur.CurrencyCode === supported;
    });

    if (!hasCurrency) {
      instance.Currencies.push({ CurrencyCode: supported });
    }
  });

  return instance.Currencies;
}
*/

const LookupTypes: { Currencies: CurrencyType[] } = <any>{};
type CurrencyTypeForDisplay = CurrencyType & { DisplayName: string };

export function getCurrency(code: string): CurrencyTypeForDisplay | {} {
  const currencyCode: string = code || this.CurrencyCode;

  let currencyMatches = LookupTypes.Currencies.filter(function (currency) {
    return currency.Code === currencyCode;
  });

  if (currencyMatches.length) {
    let currency = currencyMatches[0];
    return getCurrencyTypeForDisplay(currency);
  } else {
    return {};
  }
}

export function getSupportedCurrencies() {
  const lookupCurrencies = LookupTypes.Currencies || [];
  const currencies: CurrencyTypeForDisplay[] = [];

  for (var i = 0; i < lookupCurrencies.length; i++) {
    const currencyType = lookupCurrencies[i];
    if (supportedCurrencies.indexOf(currencyType.Code) > -1) {
      currencies.push(getCurrencyTypeForDisplay(currencyType));
    }

    if (currencies.length === supportedCurrencies.length) {
      return currencies;
    }
  }
}

export function getCurrencyTypeForDisplay(
  currencyType: CurrencyType
): CurrencyType & { DisplayName: string } {
  return {
    ...currencyType,
    GetCurrencySymbol: currencyType.GetCurrencySymbol,
    DisplayName: currencyType.Name + ' (' + currencyType.Code + ')',
  };
}

const symbolConfig = {
  USD: '$',
  CAD: 'C$',
  default: '$',
};

export function getSymbol(code: string) {
  var currencyCode = code || this.CurrencyCode;
  return symbolConfig[currencyCode] || symbolConfig.default;
}
