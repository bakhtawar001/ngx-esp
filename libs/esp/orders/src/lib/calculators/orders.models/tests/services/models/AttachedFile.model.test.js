(function () {
  'use strict';

  describe('AttachedFile Model', function () {
    var mockFile, AttachedFile;

    // We can start by loading the main application module
    beforeEach(function () {
      module('asi');
      module('preloadProviderMock');
    });

    beforeEach(inject(function (_AttachedFile_) {
      AttachedFile = _AttachedFile_;

      mockFile = new AttachedFile({ Purpose: 'Test' });
    }));

    it('defaults', function () {
      var model = new AttachedFile();

      expect(model.Purpose).toEqual('');
      expect(model.OriginalFileName).toEqual('');
      expect(model.OnDiskFileName).toEqual('');
    });
  });
})();
