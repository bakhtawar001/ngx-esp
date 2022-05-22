(function () {
  'use strict';

  describe('Instruction Model', function () {
    var mockInstruction, mockInstructionList, Instruction;

    // We can start by loading the main application module
    beforeEach(function () {
      module('asi');
      module('preloadProviderMock');
    });

    beforeEach(inject(function (_Instruction_) {
      Instruction = _Instruction_;

      mockInstruction = new Instruction({
        Content: 'Test',
      });

      mockInstructionList = new Instruction.List();
    }));

    it('defaults', function () {
      var model = new Instruction();

      expect(model.Type).toEqual('All');
      expect(model.Content).toEqual('');
    });

    it('toString', function () {
      expect(mockInstruction.toString()).toEqual('Test');
    });

    it('toHtmlString', function () {
      expect(mockInstruction.toHtmlString()).toEqual('Test');
    });

    it('isDefined', function () {
      expect(mockInstruction.isDefined()).toBeTruthy();
    });

    it('isUndefined', function () {
      expect(mockInstruction.isUndefined()).toBeFalsy();
    });

    it('Types', function () {
      var model = new Instruction({ Type: 47 });
      // 32 8 4 2 1

      expect(model.Type).toEqual(47);
      expect(model.Types).toEqual([
        'All',
        'Customer',
        'Acknowledgement',
        'Invoice',
        'PurchaseOrder',
      ]);

      // Removed block 5/22/18 bc addType + removeType no longer in model
      /*
        model.addType('SpecialsPurchaseOrder');
        expect(model.Types).toEqual(['All', 'Customer', 'Acknowledgement', 'Invoice', 'PurchaseOrder', 'SpecialsPurchaseOrder']);

        model.removeType('Customer');
        expect(model.Types).toEqual(['All', 'Acknowledgement', 'Invoice', 'PurchaseOrder', 'SpecialsPurchaseOrder']);

        expect(model.Type).toEqual(109);
        // 64 32 8 4 1
      */
    });

    describe('List Methods', function () {
      describe('checkForSpecials', function () {
        it('returns/sets hasSpecial to false if no specials instruction exists', function () {
          expect(mockInstructionList.checkForSpecial()).toBeFalsy();
          expect(mockInstructionList.hasSpecial).toBeFalsy();

          mockInstructionList.push({ Type: 4, Content: '' });

          expect(mockInstructionList.checkForSpecial()).toBeFalsy();
          expect(mockInstructionList.hasSpecial).toBeFalsy();
        });

        it('returns/sets hasSpecial to true if specials instruction exists', function () {
          mockInstructionList.push({ Type: 4, Content: '' });
          mockInstructionList.push({ Type: 64, Content: 'Blah' });
          mockInstructionList.push({
            Type: 'SpecialsPurchaseOrder',
            Content: 'Blah',
          });

          expect(mockInstructionList.checkForSpecial()).toBeTruthy();
          expect(mockInstructionList.hasSpecial).toBeTruthy();
        });
      });
    });
  });
})();
