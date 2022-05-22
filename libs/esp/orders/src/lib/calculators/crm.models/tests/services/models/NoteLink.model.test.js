(function () {
  'use strict';

  describe('NoteLink Model', function () {
    var mockLink,
      NoteLink;

    // We can start by loading the main application module
    beforeEach(function () {
      module('asi');
      module('preloadProviderMock');
    });

    beforeEach(inject(function (_NoteLink_) {
      NoteLink = _NoteLink_;

      mockLink = new NoteLink({ Name: 'Test' });

      spyOn(console, 'warn');
    }));

    it('defaults', function () {
      var model = new NoteLink();

      expect(model.Id).toEqual(0);
      expect(model.Name).toEqual('');
      expect(model.IsCompany).toBeFalsy();
      expect(model.IsPerson).toBeFalsy();
    });

    it('toString', function () {
      expect(mockLink.toString()).toEqual(mockLink.Name);
    });

    it('isDefined', function () {
      mockLink.isDefined();
      expect(console.warn).toHaveBeenCalledWith('Not implemented');
    });

    it('isUndefined', function () {
      mockLink.isUndefined();
      expect(console.warn).toHaveBeenCalledWith('Not implemented');
    });
  });
})();
