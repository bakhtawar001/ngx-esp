(function () {
  'use strict';

  describe('LineItemCalculator Model', function () {
    var mockCalculator, ServiceCharge, LineItemCalculator;

    // We can start by loading the main application module
    beforeEach(function () {
      module('asi');
      module('preloadProviderMock');
    });

    beforeEach(inject(function (_LineItemCalculator_, _ServiceCharge_) {
      LineItemCalculator = _LineItemCalculator_;
      ServiceCharge = _ServiceCharge_;
      mockCalculator = new LineItemCalculator();
    }));

    it('defaults', function () {
      var model = new LineItemCalculator();

      expect(model.Cost).toEqual(0);
      expect(model.Amount).toEqual(0);
      expect(model.Margin).toEqual(0);
    });

    it('CalculateTotals', function () {
      var item = new ServiceCharge({
        Quantity: 10,
        Cost: 20,
        Price: 40,
      });

      LineItemCalculator.calculateTotals(item);

      expect(item.Totals.Cost).toEqual(200);
      expect(item.Totals.Amount).toEqual(400);
      expect(item.Totals.Margin).toEqual(200);
      expect(item.Margin).toEqual(50);
    });

    it('CalculateConvertedTotals', function () {
      var item = new ServiceCharge({
        Quantity: 100,
        Price: 110,
        Cost: 120,
        Margin: 130,
        IsTaxable: true,
      });
      var conversionRates = [{ CurrencyCode: 'USD', ConversionRate: 10 }];
      var orderCurrency = { CurrencyCode: 'CAD' };
      var totals = LineItemCalculator.calculateConvertedTotals(
        item,
        conversionRates,
        orderCurrency
      );

      expect(item.ConvertedPrice).toEqual(1100);
      expect(item.ConvertedCost).toEqual(1200);
      expect(item.ConvertedMargin).toEqual(-100);
      expect(item.Cost).toEqual(120);
      expect(item.Margin).toEqual(-9.090909090909092);
      expect(totals.TaxableAmount).toEqual(110000);
      expect(totals.Amount).toEqual(110000);
      expect(totals.Cost).toEqual(120000);
      expect(totals.Margin).toEqual(-10000);
    });

    it('FormatLineItemValues', function () {
      var item = new ServiceCharge({
        Quantity: 9999,
        Price: 0.09999999,
        Cost: 0.09999999,
        Amount: 0.099999,
      });

      item.Margin = -0.09999999;

      var totals = LineItemCalculator.formatLineItemValues(item);

      expect(item.Quantity).toEqual(9999);
      expect(item.Price).toEqual(0.1);
      expect(item.Cost).toEqual(0.1);
      expect(totals.Margin).toEqual(-0.1);
      expect(item.Amount).toEqual(0.1);
    });
  });
})();
