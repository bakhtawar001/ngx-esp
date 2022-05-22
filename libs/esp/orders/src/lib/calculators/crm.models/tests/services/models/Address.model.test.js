(function () {
  'use strict';

  describe('Address Model', function () {
    var mockAddress,
      Address;

    // We can start by loading the main application module
    beforeEach(function () {
      module('asi');
      module('preloadProviderMock');
    });

    beforeEach(inject(function (_Address_) {
      Address = _Address_;

      mockAddress = new Address({
        Name: 'ASI',
        Line1: '4800 E Street Rd',
        City: 'Trevose',
        State: 'PA',
        PostalCode: '19053'
      });
    }));

    it('defaults', function () {
      var model = new Address();

      expect(model.Name).toEqual('');
      expect(model.Line1).toEqual('');
      expect(model.IsPrimary).toBeFalsy();

      expect(model.Phone.Country).toEqual('US');
      expect(model.Phone.PhoneCode).toEqual('1');
      expect(model.Phone.Number).toEqual('');
    });

    it('toString', function () {
      expect(mockAddress.toString()).toEqual('4800 E Street Rd, Trevose, PA 19053');
    });

    it('toHtmlFormat', function () {
      expect(mockAddress.toHtmlFormat()).toEqual('4800 E Street Rd<br />Trevose, PA 19053');
    });

    it('isDefined', function () {
      expect(mockAddress.isDefined()).toBeTruthy();
    });

    it('isUndefined', function () {
      expect(mockAddress.isUndefined()).toBeFalsy();
    });
  });
})();
