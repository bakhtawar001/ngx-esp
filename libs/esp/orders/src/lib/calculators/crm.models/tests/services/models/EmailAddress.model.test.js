(function () {
  'use strict';

  describe('EmailAddress Model', function () {
    var mockEmailAddress,
      EmailAddress;

    // We can start by loading the main application module
    beforeEach(function () {
      module('asi');
      module('preloadProviderMock');
    });

    beforeEach(inject(function (_EmailAddress_) {
      EmailAddress = _EmailAddress_;

      mockEmailAddress = new EmailAddress({ Address: 'support@asicentral.com' });
    }));

    it('defaults', function () {
      var model = new EmailAddress();

      expect(model.Type).toEqual('Work');
      expect(model.Address).toEqual('');
      expect(model.IsPrimary).toBeFalsy();
    });

    it('toString', function () {
      expect(mockEmailAddress.toString()).toEqual(mockEmailAddress.Address);
    });

    it('isDefined', function () {
      expect(mockEmailAddress.isDefined()).toBeTruthy();
    });

    it('isUndefined', function () {
      expect(mockEmailAddress.isUndefined()).toBeFalsy();
    });
  });
})();
