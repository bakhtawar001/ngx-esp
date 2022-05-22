(function () {
  'use strict';

  describe('Shipping Account Model', function () {
    var mockShippingAccount,
      ShippingAccount;

    // We can start by loading the main application module
    beforeEach(function () {
      module('asi');
      module('preloadProviderMock');
    });

    beforeEach(inject(function (_ShippingAccount_) {
      ShippingAccount = _ShippingAccount_;

      mockShippingAccount = new ShippingAccount({ Number: '1111111111' });
    }));

    it('defaults', function () {
      var model = new ShippingAccount();

      expect(model.Type).toEqual('');
      expect(model.Number).toEqual('');
    });

    it('toString', function () {
      expect(mockShippingAccount.toString()).toEqual(mockShippingAccount.Number);
    });

    it('isDefined', function () {
      expect(mockShippingAccount.isDefined()).toBeTruthy();
    });

    it('isUndefined', function () {
      expect(mockShippingAccount.isUndefined()).toBeFalsy();
    });
  });
})();
