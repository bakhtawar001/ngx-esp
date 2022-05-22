(function () {
  'use strict';

  describe('ProductAttribute Model', function () {
    var mockAttribute, ProductAttribute;

    // We can start by loading the main application module
    beforeEach(function () {
      module('asi');
      module('preloadProviderMock');
    });

    beforeEach(inject(function (_ProductAttribute_) {
      ProductAttribute = _ProductAttribute_;

      mockAttribute = new ProductAttribute();
    }));

    it('defaults', function () {
      var model = new ProductAttribute();

      expect(model.Type).toEqual('');
      expect(model.Value).toEqual('');
      expect(model.ValueType).toEqual('NONE');
    });
  });
})();
