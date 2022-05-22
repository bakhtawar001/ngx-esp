(function () {
  'use strict';

  describe('Phone Model', function () {
    var mockPhone,
      Phone;

    // We can start by loading the main application module
    beforeEach(function () {
      module('asi');
      module('preloadProviderMock');
    });

    beforeEach(inject(function (_Phone_) {
      Phone = _Phone_;

      mockPhone = new Phone({ Number: '1111111111' });
    }));

    it('defaults', function () {
      var model = new Phone();

      expect(model.Type).toEqual('Mobile');
      expect(model.Country).toEqual('US');
      expect(model.PhoneCode).toEqual('1');
      expect(model.Number).toEqual('');
      expect(model.Extension).toEqual('');
      expect(model.IsPrimary).toBeFalsy();
    });
  });
})();
