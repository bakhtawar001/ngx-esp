(function () {
  'use strict';

  describe('MediaLink Model', function () {
    var mockLink, MediaLink;

    // We can start by loading the main application module
    beforeEach(function () {
      module('asi');
      module('preloadProviderMock');
    });

    beforeEach(inject(function (_MediaLink_) {
      MediaLink = _MediaLink_;

      mockLink = new MediaLink();
    }));

    it('defaults', function () {
      var model = new MediaLink();

      expect(model.DownloadFileName).toEqual('');
      expect(model.DownloadFileUrl).toEqual('');
      expect(model.FileType).toEqual('');
      expect(model.FileUrl).toEqual('');
      expect(model.MediaId).toEqual('');
      expect(model.OnDiskFileName).toEqual('');
      expect(model.OriginalFileName).toEqual('');
      expect(model.Extension).toEqual('');
    });

    it('init', function () {
      expect(mockLink.OriginalFileName).toEqual('');
      expect(mockLink.Extension).toEqual('');

      mockLink = new MediaLink({ OriginalFileName: 'test.png' });
      expect(mockLink.Extension).toEqual('png');
    });
  });
})();
