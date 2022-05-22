(function () {
  'use strict';

  describe('LineItem Model', function () {
    var mockOrder, Order;

    beforeEach(function () {
      module('asi');
      module('preloadProviderMock');
    });

    beforeEach(inject(function (_Order_) {
      Order = _Order_;
      mockOrder = new Order({});
    }));

    describe('allProductsConfigured List Method', function () {
      it('returns true if all products configured', function () {
        mockOrder.LineItems.push({ Type: 'product' });

        expect(mockOrder.LineItems.allProductsConfigured()).toBeTruthy();
      });

      it('returns true if not all are products configured', function () {
        mockOrder.LineItems.push({ Type: 'product' });
        mockOrder.LineItems[0].removeVariant(
          mockOrder.LineItems[0].Variants[0]
        );

        expect(mockOrder.LineItems.allProductsConfigured()).toBeFalsy();

        mockOrder.LineItems.push({ Type: 'product' });

        expect(mockOrder.LineItems.allProductsConfigured()).toBeFalsy();
      });

      it('it ignores all other line item types', function () {
        mockOrder.LineItems.push({ Type: 'product' });
        mockOrder.LineItems.push({ Type: 'service' });

        expect(mockOrder.LineItems.allProductsConfigured()).toBeTruthy();

        mockOrder.LineItems.push({ Type: 'title' });

        expect(mockOrder.LineItems.allProductsConfigured()).toBeTruthy();
      });
    });
  });
})();
