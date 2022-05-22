(function () {
  'use strict';

  describe('TitleLineItem Model', function () {
    var mockTitle, TitleLineItem;

    // We can start by loading the main application module
    beforeEach(function () {
      module('asi');
      module('preloadProviderMock');
    });

    beforeEach(inject(function (_TitleLineItem_) {
      TitleLineItem = _TitleLineItem_;

      mockTitle = new TitleLineItem();
    }));

    it('defaults', function () {
      var model = new TitleLineItem();

      expect(model.Type).toEqual('title');
    });
  });
})();
