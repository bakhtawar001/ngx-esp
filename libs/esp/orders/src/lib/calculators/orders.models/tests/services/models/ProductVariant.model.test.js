(function () {
  'use strict';

  describe('ProductVariant Model', function () {
    var mockVariant, mockVariantList, ProductAttribute, ProductVariant;

    // We can start by loading the main application module
    beforeEach(function () {
      module('asi');
      module('preloadProviderMock');
    });

    beforeEach(inject(function (_ProductVariant_, _ProductAttribute_) {
      ProductVariant = _ProductVariant_;
      ProductAttribute = _ProductAttribute_;
      mockVariant = new ProductVariant();
      mockVariantList = new ProductVariant.List();
    }));

    it('defaults', function () {
      expect(mockVariant.Quantity).toEqual(1);
      expect(mockVariant.Price).toEqual(0);
      expect(mockVariant.Cost).toEqual(0);
      expect(mockVariant.Margin).toEqual(0);
      expect(mockVariant.ConvertedPrice).toEqual(0);
      expect(mockVariant.ConvertedCost).toEqual(0);
      expect(mockVariant.ConvertedMargin).toEqual(0);
      expect(mockVariant.Totals.Cost).toEqual(0);
      expect(mockVariant.Totals.Amount).toEqual(0);
      expect(mockVariant.Totals.Margin).toEqual(0);
      expect(mockVariant.ProductAttributes.length).toEqual(0);
      expect(mockVariant.IsTaxable).toBeTruthy();
      expect(mockVariant.IsVisible).toBeTruthy();
      expect(mockVariant.CurrencyCode).toEqual('USD');
    });

    it('addProductAttribute', function () {
      var attr = {
        Type: 'Test Type',
        Value: 'Test Value',
      };
      mockVariant = new ProductVariant();

      mockVariant.addProductAttribute(new ProductAttribute(attr), false);
      expect(mockVariant.ProductAttributes.length).toEqual(1);
      expect(mockVariant.ProductAttributes[0].Type).toEqual('Test Type');
      expect(mockVariant.ProductAttributes[0].Value).toEqual('Test Value');

      mockVariant.addProductAttribute(attr, false);
      expect(mockVariant.ProductAttributes.length).toEqual(2);
      expect(mockVariant.ProductAttributes[1].Type).toEqual('Test Type');
      expect(mockVariant.ProductAttributes[1].Value).toEqual('Test Value');

      mockVariant.addProductAttribute(attr, true);
      expect(mockVariant.ProductAttributes.length).toEqual(2);
      expect(mockVariant.ProductAttributes[0].Type).toEqual('Test Type');
      expect(mockVariant.ProductAttributes[0].Value).toEqual('Test Value');
      expect(mockVariant.ProductAttributes[1].Type).toEqual('Test Type');
      expect(mockVariant.ProductAttributes[1].Value).toEqual('Test Value');
    });

    it('removeProductAttribute', function () {
      var attr = {
        Type: 'Test Type',
        Value: 'Test Value',
      };
      mockVariant = new ProductVariant();

      mockVariant.addProductAttribute(new ProductAttribute(attr), false);
      expect(mockVariant.ProductAttributes.length).toEqual(1);
      expect(mockVariant.ProductAttributes[0].Type).toEqual('Test Type');
      expect(mockVariant.ProductAttributes[0].Value).toEqual('Test Value');

      mockVariant.removeProductAttribute(attr);
      expect(mockVariant.ProductAttributes.length).toEqual(0);

      mockVariant.addProductAttribute(new ProductAttribute(attr), false);
      expect(mockVariant.ProductAttributes.length).toEqual(1);
      expect(mockVariant.ProductAttributes[0].Type).toEqual('Test Type');
      expect(mockVariant.ProductAttributes[0].Value).toEqual('Test Value');

      mockVariant.removeProductAttribute(0);
      expect(mockVariant.ProductAttributes.length).toEqual(0);
    });

    it('getAttributesByType', function () {
      var attrs,
        attr1 = {
          Type: 'Test Type1',
          Value: 'Test Value1',
        },
        attr2 = {
          Type: 'Test Type2',
          Value: 'Test Value2',
        };

      mockVariant = new ProductVariant();
      mockVariant.addProductAttribute(attr1, true);
      mockVariant.addProductAttribute(attr2, true);

      attrs = mockVariant.getAttributesByType('Test');
      expect(attrs.length).toEqual(0);

      attrs = mockVariant.getAttributesByType('Test Type1');
      expect(attrs.length).toEqual(1);
      expect(attrs[0].Type).toEqual('Test Type1');
      expect(attrs[0].Value).toEqual('Test Value1');

      attrs = mockVariant.getAttributesByType('Test Type2');
      expect(attrs.length).toEqual(1);
      expect(attrs[0].Type).toEqual('Test Type2');
      expect(attrs[0].Value).toEqual('Test Value2');
    });

    it('getAttributesByValue', function () {
      var attr,
        attr1 = {
          Type: 'Test Type1',
          Value: 'Test Value1',
        },
        attr2 = {
          Type: 'Test Type2',
          Value: 'Test Value2',
        };

      mockVariant = new ProductVariant();
      mockVariant.addProductAttribute(attr1, true);
      mockVariant.addProductAttribute(attr2, true);

      attr = mockVariant.getAttributeByValue('Test');
      expect(attr).toEqual(null);

      attr = mockVariant.getAttributeByValue('Test Value1');
      expect(attr.Type).toEqual('Test Type1');
      expect(attr.Value).toEqual('Test Value1');

      attr = mockVariant.getAttributeByValue('Test Value2');
      expect(attr.Type).toEqual('Test Type2');
      expect(attr.Value).toEqual('Test Value2');
    });

    it('setIsTaxable will set all ProductVariants IsTaxable to true', function () {
      mockVariantList.push({ IsTaxable: false });
      mockVariantList.push({ IsTaxable: true });
      mockVariantList.push({ IsTaxable: false });

      mockVariantList.setIsTaxable(true);

      mockVariantList.forEach(function (variant) {
        expect(variant.IsTaxable).toEqual(true);
      });
    });

    it('setIsTaxable will set all ProductVariants IsTaxable to false', function () {
      mockVariantList.push({ IsTaxable: false });
      mockVariantList.push({ IsTaxable: true });
      mockVariantList.push({ IsTaxable: false });

      mockVariantList.setIsTaxable(false);

      mockVariantList.forEach(function (variant) {
        expect(variant.IsTaxable).toEqual(false);
      });
    });
  });
})();
