(function () {
  'use strict';

  describe('Decoration Model', function () {
    var mockDecoration, ServiceCharge, ProductAttribute, Decoration;

    // We can start by loading the main application module
    beforeEach(function () {
      module('asi');
      module('preloadProviderMock');
    });

    beforeEach(inject(function (
      _ProductAttribute_,
      _Decoration_,
      _ServiceCharge_
    ) {
      ProductAttribute = _ProductAttribute_;
      Decoration = _Decoration_;
      ServiceCharge = _ServiceCharge_;
      mockDecoration = new Decoration();
    }));

    it('init', function () {
      mockDecoration.Decoration = new ProductAttribute();
      expect(
        mockDecoration.$$selected.Decoration
          ? mockDecoration.$$selected.Decoration.Code
          : 'NONE'
      ).toEqual('NONE');
      expect(
        mockDecoration.$$selected.Decoration
          ? mockDecoration.$$selected.Decoration.Name
          : ''
      ).toEqual('');

      expect(mockDecoration.Totals.Amount).toEqual(0);
      expect(mockDecoration.Totals.Cost).toEqual(0);
      expect(mockDecoration.Totals.Margin).toEqual(0);
    });

    it('calculateTotals', function () {
      var charge = {
        ServiceType: 'Setup Charge',
        Quantity: 10,
        Price: 20,
        Cost: 30,
        IsVisible: true,
        CurrencyCode: 'CAD',
      };

      mockDecoration.addCharge(new ServiceCharge(charge));
      expect(mockDecoration.ServiceCharges.length).toEqual(1);
      expect(mockDecoration.ServiceCharges[0].ServiceType).toEqual(
        'Setup Charge'
      );
      expect(mockDecoration.ServiceCharges[0].Quantity).toEqual(10);
      expect(mockDecoration.ServiceCharges[0].Price).toEqual(20);
      expect(mockDecoration.ServiceCharges[0].Cost).toEqual(30);
      expect(mockDecoration.ServiceCharges[0].IsVisible).toEqual(true);
      expect(mockDecoration.ServiceCharges[0].CurrencyCode).toEqual('CAD');

      mockDecoration.calculateTotals();
      expect(mockDecoration.Totals.Amount).toEqual(200);
      expect(mockDecoration.Totals.Cost).toEqual(300);
      expect(mockDecoration.Totals.Margin).toEqual(-100);
    });

    it('addCharge', function () {
      var charge = {
        ServiceType: 'Setup Charge',
        Quantity: 10,
        Price: 20,
        Cost: 30,
        IsVisible: true,
        CurrencyCode: 'CAD',
      };

      mockDecoration.addCharge(new ServiceCharge(charge));
      expect(mockDecoration.ServiceCharges.length).toEqual(1);
      expect(mockDecoration.ServiceCharges[0].ServiceType).toEqual(
        'Setup Charge'
      );
      expect(mockDecoration.ServiceCharges[0].Quantity).toEqual(10);
      expect(mockDecoration.ServiceCharges[0].Price).toEqual(20);
      expect(mockDecoration.ServiceCharges[0].Cost).toEqual(30);
      expect(mockDecoration.ServiceCharges[0].IsVisible).toEqual(true);
      expect(mockDecoration.ServiceCharges[0].CurrencyCode).toEqual('CAD');

      mockDecoration.addCharge(charge);
      expect(mockDecoration.ServiceCharges.length).toEqual(2);
      expect(mockDecoration.ServiceCharges[1].ServiceType).toEqual(
        'Setup Charge'
      );
      expect(mockDecoration.ServiceCharges[1].Quantity).toEqual(10);
      expect(mockDecoration.ServiceCharges[1].Price).toEqual(20);
      expect(mockDecoration.ServiceCharges[1].Cost).toEqual(30);
      expect(mockDecoration.ServiceCharges[1].IsVisible).toEqual(true);
      expect(mockDecoration.ServiceCharges[1].CurrencyCode).toEqual('CAD');

      mockDecoration.CurrencyCode = 'CAD';
      charge.CurrencyCode = undefined;
      mockDecoration.addCharge(charge);
      expect(mockDecoration.ServiceCharges.length).toEqual(3);
      expect(mockDecoration.ServiceCharges[2].CurrencyCode).toEqual('CAD');
    });

    it('removeCharge', function () {
      var charge = {
        ServiceType: 'Setup Charge',
        Quantity: 10,
        Price: 20,
        Cost: 30,
        IsVisible: true,
        CurrencyCode: 'CAD',
      };

      mockDecoration.addCharge(new ServiceCharge(charge));
      expect(mockDecoration.ServiceCharges.length).toEqual(1);
      expect(mockDecoration.ServiceCharges[0].ServiceType).toEqual(
        'Setup Charge'
      );
      expect(mockDecoration.ServiceCharges[0].Quantity).toEqual(10);
      expect(mockDecoration.ServiceCharges[0].Price).toEqual(20);
      expect(mockDecoration.ServiceCharges[0].Cost).toEqual(30);
      expect(mockDecoration.ServiceCharges[0].IsVisible).toEqual(true);
      expect(mockDecoration.ServiceCharges[0].CurrencyCode).toEqual('CAD');

      mockDecoration.removeCharge(charge);
      expect(mockDecoration.ServiceCharges.length).toEqual(0);
    });

    it('getSetDecoration', function () {
      mockDecoration = new Decoration({
        Decoration: {
          Type: '',
          ValueType: 'Test Code1',
          Value: 'Test Name1',
          VendorCode: 'Test Vendor1',
        },
      });

      var newVal = {
        Code: 'Test Code2',
        Name: 'Test Name2',
        VendorCode: 'Test Vendor2',
      };
      mockDecoration.getSetDecoration(newVal);

      expect(mockDecoration.Decoration.Type).toEqual('IMMD');
      expect(mockDecoration.Decoration.ValueType).toEqual('Test Code2');
      expect(mockDecoration.Decoration.Value).toEqual('Test Name2');
      expect(mockDecoration.Decoration.VendorCode).toEqual('Test Vendor2');

      expect(mockDecoration.$$selected.Decoration.Code).toEqual('Test Code2');
      expect(mockDecoration.$$selected.Decoration.Name).toEqual('Test Name2');
      expect(mockDecoration.$$selected.Decoration.VendorCode).toEqual(
        'Test Vendor2'
      );
    });
  });
})();
