(function () {
  'use strict';

  describe('ProductLineItem Model', function () {
    var mockItem,
      ProductVariant,
      Decoration,
      Instruction,
      ServiceCharge,
      ProductLineItem;

    // We can start by loading the main application module
    beforeEach(function () {
      module('asi');
      module('preloadProviderMock');
    });

    beforeEach(inject(function (
      _ProductLineItem_,
      _ProductVariant_,
      _Decoration_,
      _Instruction_,
      _ServiceCharge_
    ) {
      ProductLineItem = _ProductLineItem_;
      ProductVariant = _ProductVariant_;
      Decoration = _Decoration_;
      Instruction = _Instruction_;
      ServiceCharge = _ServiceCharge_;
      mockItem = new ProductLineItem();
    }));

    it('defaults', function () {
      expect(mockItem.Type).toEqual('product');
      expect(mockItem.Decorations.length).toEqual(1);
      expect(mockItem.Instructions.length).toEqual(0);
      expect(mockItem.Variants.length).toEqual(1);
      expect(mockItem.Totals.Cost).toEqual(0);
      expect(mockItem.Totals.Amount).toEqual(0);
      expect(mockItem.Totals.Margin).toEqual(0);
      expect(mockItem.ImageUrl).toEqual('');
      expect(mockItem.ProductId).toEqual(0);
      expect(mockItem.CurrencyCode).toEqual('USD');
    });

    it('init', function () {
      mockItem = new ProductLineItem({
        Variants: [
          new ProductVariant({
            CurrencyCode: 'CAD',
          }),
        ],
        Decorations: [new Decoration()],
      });

      expect(mockItem.Variants.length).toEqual(1);
      expect(mockItem.Decorations.length).toEqual(1);
      expect(mockItem.CurrencyCode).toEqual('CAD');
      expect(mockItem.Decorations[0].CurrencyCode).toEqual('CAD');
    });

    it('calculateTotals', function () {
      mockItem = new ProductLineItem({
        ServiceCharges: [
          {
            IsRunCharge: true,
            Description: 'Test Description',
            Quantity: 10,
            Price: 20,
            Cost: 30,
            Margin: 40,
          },
        ],
      });

      mockItem.calculateTotals(true);
      expect(mockItem.Totals.QuantityOrdered).toEqual(0);
      expect(mockItem.Totals.Units).toEqual(1);
      expect(mockItem.Totals.Amount).toEqual(20);
      expect(mockItem.Totals.Cost).toEqual(30);
      expect(mockItem.Totals.Margin).toEqual(-10);

      mockItem.calculateTotals(false);
      expect(mockItem.Totals.QuantityOrdered).toEqual(0);
      expect(mockItem.Totals.Units).toEqual(1);
      expect(mockItem.Totals.Amount).toEqual(20);
      expect(mockItem.Totals.Cost).toEqual(30);
      expect(mockItem.Totals.Margin).toEqual(-10);
    });

    it('calculateConvertedTotals', function () {
      var charges = [
        {
          Quantity: 100,
          Price: 110,
          Cost: 120,
          Margin: 130,
          IsTaxable: true,
        },
      ];

      mockItem = new ProductLineItem({
        Variants: charges,
        Decorations: [{ ServiceCharges: charges }],
        ServiceCharges: charges,
      });

      var conversionRates = [{ CurrencyCode: 'USD', ConversionRate: 10 }];
      var orderCurrency = { CurrencyCode: 'CAD' };
      var totals = mockItem.calculateConvertedTotals(
        conversionRates,
        orderCurrency
      );

      expect(totals.TaxableAmount).toEqual(330000);
      expect(totals.Amount).toEqual(330000);
      expect(totals.Cost).toEqual(360000);
      expect(totals.Margin).toEqual(-30000);
    });

    it('addDecoration', function () {
      mockItem = new ProductLineItem({ CurrencyCode: 'CAD' });
      expect(mockItem.Decorations.length).toEqual(1);
      expect(mockItem.Decorations[0].CurrencyCode).toEqual('CAD');

      mockItem.addDecoration(new Decoration({ CurrencyCode: undefined }));
      expect(mockItem.Decorations.length).toEqual(2);
      expect(mockItem.Decorations[1].CurrencyCode).toEqual('CAD');

      mockItem.addDecoration({ CurrencyCode: 'USD' });
      expect(mockItem.Decorations.length).toEqual(3);
      expect(mockItem.Decorations[2].CurrencyCode).toEqual('USD');
    });

    it('removeDecoration', function () {
      var dec = { CurrencyCode: 'USD' };

      mockItem = new ProductLineItem({ CurrencyCode: 'CAD' });
      expect(mockItem.Decorations.length).toEqual(1);
      expect(mockItem.Decorations[0].CurrencyCode).toEqual('CAD');

      mockItem.addDecoration(dec);
      expect(mockItem.Decorations.length).toEqual(2);
      expect(mockItem.Decorations[1].CurrencyCode).toEqual('USD');

      mockItem.removeDecoration(dec);
      expect(mockItem.Decorations.length).toEqual(1);

      mockItem.removeDecoration(0);
      expect(mockItem.Decorations.length).toEqual(0);

      mockItem.removeDecoration(undefined);
      expect(mockItem.Decorations.length).toEqual(0);

      mockItem.removeDecoration(0);
      expect(mockItem.Decorations.length).toEqual(0);
    });

    it('addCharge', function () {
      var charge = {
        IsRunCharge: true,
        Description: 'Test Description',
        Quantity: 10,
        Price: 20,
        Cost: 30,
        Margin: 40,
      };
      mockItem = new ProductLineItem();

      mockItem.addCharge(new ServiceCharge(charge));
      expect(mockItem.ServiceCharges.length).toEqual(1);
      mockItem.addCharge(charge);
      expect(mockItem.ServiceCharges.length).toEqual(2);

      expect(mockItem.ServiceCharges[0].Sequence).toEqual(0);
      expect(mockItem.ServiceCharges[1].Sequence).toEqual(1);
    });

    it('removeCharge', function () {
      var charge = {
        IsRunCharge: true,
        Description: 'Test Description',
        Quantity: 10,
        Price: 20,
        Cost: 30,
        Margin: 40,
      };
      mockItem = new ProductLineItem();

      mockItem.addCharge(new ServiceCharge(charge));
      expect(mockItem.ServiceCharges.length).toEqual(1);
      mockItem.addCharge(charge);
      expect(mockItem.ServiceCharges.length).toEqual(2);

      expect(mockItem.ServiceCharges[0].Sequence).toEqual(0);
      expect(mockItem.ServiceCharges[1].Sequence).toEqual(1);

      mockItem.removeCharge(charge);
      expect(mockItem.ServiceCharges.length).toEqual(1);
      expect(mockItem.ServiceCharges[0].Sequence).toEqual(0);

      expect(mockItem.ServiceCharges[0].Totals.Amount).toEqual(200);
      expect(mockItem.ServiceCharges[0].Totals.Cost).toEqual(300);
      expect(mockItem.ServiceCharges[0].Totals.Margin).toEqual(-100);
    });

    it('addInstruction', function () {
      var instruction = {
        Type: 'Test Type',
        Content: 'Test Content',
      };
      mockItem = new ProductLineItem();

      mockItem.addInstruction(new Instruction(instruction));
      expect(mockItem.Instructions.length).toEqual(1);
      expect(mockItem.Instructions[0].Type).toEqual('Test Type');
      expect(mockItem.Instructions[0].Content).toEqual('Test Content');

      mockItem.addInstruction(instruction);
      expect(mockItem.Instructions.length).toEqual(2);
      expect(mockItem.Instructions[1].Type).toEqual('Test Type');
      expect(mockItem.Instructions[1].Content).toEqual('Test Content');
    });

    it('removeInstruction', function () {
      var instruction = {
        Type: 'Test Type',
        Content: 'Test Content',
      };
      mockItem = new ProductLineItem();

      mockItem.addInstruction(new Instruction(instruction));
      expect(mockItem.Instructions.length).toEqual(1);
      expect(mockItem.Instructions[0].Type).toEqual('Test Type');
      expect(mockItem.Instructions[0].Content).toEqual('Test Content');

      mockItem.removeInstruction(instruction);
      expect(mockItem.Instructions.length).toEqual(0);
    });

    it('addVariant', function () {
      var variant = {
        Quantity: 10,
        Price: 20,
        Cost: 30,
        Margin: 40,
      };

      mockItem = new ProductLineItem();
      expect(mockItem.Variants.length).toEqual(1);

      mockItem.addVariant(new ProductVariant(variant));
      expect(mockItem.Variants.length).toEqual(2);
      mockItem.addVariant(variant);
      expect(mockItem.Variants.length).toEqual(3);

      expect(mockItem.Variants[0].Sequence).toEqual(0);
      expect(mockItem.Variants[1].Sequence).toEqual(1);
      expect(mockItem.Variants[2].Sequence).toEqual(2);
    });

    it('removeVariant', function () {
      var variant = {
        Quantity: 10,
        Price: 20,
        Cost: 30,
        Margin: 40,
      };

      mockItem = new ProductLineItem();
      expect(mockItem.Variants.length).toEqual(1);

      mockItem.addVariant(new ProductVariant(variant));
      expect(mockItem.Variants.length).toEqual(2);
      mockItem.addVariant(variant);
      expect(mockItem.Variants.length).toEqual(3);

      expect(mockItem.Variants[0].Sequence).toEqual(0);
      expect(mockItem.Variants[1].Sequence).toEqual(1);
      expect(mockItem.Variants[2].Sequence).toEqual(2);

      mockItem.removeVariant(variant);
      expect(mockItem.Variants.length).toEqual(2);
      expect(mockItem.Variants[0].Sequence).toEqual(0);
      expect(mockItem.Variants[1].Sequence).toEqual(1);

      expect(mockItem.Variants[0].Totals.Amount).toEqual(0);
      expect(mockItem.Variants[0].Totals.Cost).toEqual(0);
      expect(mockItem.Variants[0].Totals.Margin).toEqual(0);
      expect(mockItem.Variants[1].Totals.Amount).toEqual(200);
      expect(mockItem.Variants[1].Totals.Cost).toEqual(300);
      expect(mockItem.Variants[1].Totals.Margin).toEqual(-100);
    });
  });
})();
