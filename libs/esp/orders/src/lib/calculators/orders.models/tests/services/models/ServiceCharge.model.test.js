(function () {
  'use strict';

  describe('ServiceCharge Model', function () {
    var mockCharge, ServiceCharge, LineItemCalculator;

    // We can start by loading the main application module
    beforeEach(function () {
      module('asi');
      module('preloadProviderMock');
    });

    beforeEach(inject(function (_ServiceCharge_, _LineItemCalculator_) {
      ServiceCharge = _ServiceCharge_;
      LineItemCalculator = _LineItemCalculator_;
      mockCharge = new ServiceCharge();
    }));

    it('defaults', function () {
      expect(mockCharge.IsRunCharge).toBeFalsy();
      expect(mockCharge.ServiceType).toEqual('GSCH');
      expect(mockCharge.Description).toEqual('');
      expect(mockCharge.Quantity).toEqual(1);
      expect(mockCharge.Price).toEqual(0);
      expect(mockCharge.Cost).toEqual(0);
      expect(mockCharge.Margin).toEqual(0);
      expect(mockCharge.ConvertedPrice).toEqual(0);
      expect(mockCharge.ConvertedCost).toEqual(0);
      expect(mockCharge.ConvertedMargin).toEqual(0);
      expect(mockCharge.IsTaxable).toBeTruthy();
      expect(mockCharge.IsVisible).toBeTruthy();
      expect(mockCharge.Totals.Cost).toEqual(0);
      expect(mockCharge.Totals.Amount).toEqual(0);
      expect(mockCharge.Totals.Margin).toEqual(0);
      expect(mockCharge.CurrencyCode).toEqual('USD');
    });
  });
})();
