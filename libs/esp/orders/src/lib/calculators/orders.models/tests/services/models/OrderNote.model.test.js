(function () {
  'use strict';

  describe('OrderNote Model', function () {
    var mockNote, OrderNote;

    // We can start by loading the main application module
    beforeEach(function () {
      module('asi');
      module('preloadProviderMock');
    });

    beforeEach(inject(function (_OrderNote_) {
      OrderNote = _OrderNote_;

      mockNote = new OrderNote({ Content: 'Test' });
    }));

    it('defaults', function () {
      var model = new OrderNote();

      expect(model.Content).toEqual('');
      expect(model.CreateDate).toEqual(null);
      expect(model.UpdateDate).toEqual(null);
    });

    it('toString', function () {
      expect(mockNote.toString()).toEqual(mockNote.Content);
    });

    it('isDefined', function () {
      expect(mockNote.isDefined()).toBeTruthy();
    });

    it('isUndefined', function () {
      expect(mockNote.isUndefined()).toBeFalsy();
    });
  });
})();
