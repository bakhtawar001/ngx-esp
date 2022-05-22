(function () {
  'use strict';

  describe('Website Model', function () {
    var mockWebsite,
      Website;

    // We can start by loading the main application module
    beforeEach(function () {
      module('asi');
      module('preloadProviderMock');
    });

    beforeEach(inject(function (_Website_) {
      Website = _Website_;

      mockWebsite = new Website({ Url: 'http://www.google.com' });
    }));

    it('defaults', function () {
      var model = new Website();

      expect(model.Type).toEqual('Corporate');
      expect(model.Url).toEqual('');
      expect(model.IsPrimary).toBeFalsy();
    });

    it('toString', function () {
      expect(mockWebsite.toString()).toEqual(mockWebsite.Url);
    });

    it('isDefined', function () {
      expect(mockWebsite.isDefined()).toBeTruthy();
    });

    it('isUndefined', function () {
      expect(mockWebsite.isUndefined()).toBeFalsy();
    });
  });
})();
