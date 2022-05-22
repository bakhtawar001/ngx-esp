(function () {
  'use strict';

  describe('Currency Model', function () {
    var mockCurrency, Currency, LookupTypes;

    // We can start by loading the main application module
    beforeEach(function () {
      module('asi');
      module('preloadProviderMock');
    });

    beforeEach(inject(function (_Currency_, _LookupTypes_) {
      Currency = _Currency_;
      LookupTypes = _LookupTypes_;
      mockCurrency = new Currency();
    }));

    it('defaults', function () {
      expect(mockCurrency.CurrencyCode).toEqual('');
      expect(mockCurrency.ConversionRate).toEqual('');
    });

    it('getCurrency', function () {
      var currency = mockCurrency.getCurrency('AAA');
      expect(currency).toEqual({});

      currency = mockCurrency.getCurrency('AED');
      expect(currency.Code).toEqual('AED');
      expect(currency.Name).toEqual('UAE Dirham');
      expect(currency.DisplayName).toEqual('UAE Dirham (AED)');

      currency = mockCurrency.getCurrency('AFN');
      expect(currency.Code).toEqual('AFN');
      expect(currency.Name).toEqual('Afghani');
      expect(currency.DisplayName).toEqual('Afghani (AFN)');
    });

    it('getSymbol', function () {
      var symbol = mockCurrency.getSymbol('');
      expect(symbol).toEqual('$');

      symbol = mockCurrency.getSymbol(null);
      expect(symbol).toEqual('$');

      symbol = mockCurrency.getSymbol('AAA');
      expect(symbol).toEqual('$');

      symbol = mockCurrency.getSymbol('AED');
      expect(symbol).toEqual('$');

      symbol = mockCurrency.getSymbol('AFN');
      expect(symbol).toEqual('$');

      symbol = mockCurrency.getSymbol('USD');
      expect(symbol).toEqual('$');

      symbol = mockCurrency.getSymbol('CAD');
      expect(symbol).toEqual('C$');
    });

    it('SupportedCurrencies', function () {
      var currencies = Currency.supportedCurrencies();
      expect(currencies.length).toEqual(2);

      expect(currencies[0].Code).toEqual('CAD');
      expect(currencies[0].Name).toEqual('Canadian Dollar');
      expect(currencies[0].DisplayName).toEqual('Canadian Dollar (CAD)');

      expect(currencies[1].Code).toEqual('USD');
      expect(currencies[1].Name).toEqual('US Dollar');
      expect(currencies[1].DisplayName).toEqual('US Dollar (USD)');
    });

    describe('Convert', function () {
      it('Amount', function () {
        var item = { Amount: 100, CurrencyCode: 'USD' },
          key = 'Amount',
          orderCurrency = { CurrencyCode: 'USD' },
          conversionRates = [{ CurrencyCode: 'USD', ConversionRate: 10 }];

        expect(
          Currency.convert(item, key, orderCurrency, conversionRates)
        ).toEqual(1000);
      });

      it('Price', function () {
        var item = { Price: 200, CurrencyCode: 'USD' },
          key = 'Price',
          orderCurrency = { CurrencyCode: 'USD' },
          conversionRates = [{ CurrencyCode: 'USD', ConversionRate: 20 }];

        expect(
          Currency.convert(item, key, orderCurrency, conversionRates)
        ).toEqual(4000);
      });

      it('Cost', function () {
        var item = { Cost: 300, CurrencyCode: 'USD' },
          key = 'Cost',
          orderCurrency = { CurrencyCode: 'USD' },
          conversionRates = [{ CurrencyCode: 'USD', ConversionRate: 30 }];

        expect(
          Currency.convert(item, key, orderCurrency, conversionRates)
        ).toEqual(9000);
      });
    });
  });
})();
