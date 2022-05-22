(function () {
  'use strict';

  describe('Instruction FormType Mapper', function () {
    var mockMapper;
    var map = [
      'All',
      'Customer',
      'Acknowledgement',
      'Invoice',
      'Vendor',
      'PurchaseOrder',
      'SpecialsPurchaseOrder',
    ];
    // We can start by loading the main application module
    beforeEach(function () {
      module('asi');
      module('preloadProviderMock');
    });

    beforeEach(inject(function (_instructionFormTypeMapper_) {
      mockMapper = _instructionFormTypeMapper_;
    }));
    it('Type to Types', function () {
      for (var i = 0; i < map.length; i++) {
        expect(mockMapper.getTypesFromType(1 << i)).toEqual([map[i]]);
      }
      expect(mockMapper.getTypesFromType(127)).toEqual(map);
    });
    it('Types to Type', function () {
      for (var i = 0; i < map.length; i++) {
        expect(mockMapper.getTypeFromTypes([map[i]])).toEqual(1 << i);
      }
      expect(mockMapper.getTypeFromTypes(map)).toEqual(127);
    });
  });
})();
