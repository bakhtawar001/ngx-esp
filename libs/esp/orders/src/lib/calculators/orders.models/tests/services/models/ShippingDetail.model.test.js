(function () {
  'use strict';

  describe('ShippingDetail Model', function () {
    var mockDate, mockShipping, ShippingDetail;

    // We can start by loading the main application module
    beforeEach(function () {
      module('asi');
      module('preloadProviderMock');
    });

    beforeEach(inject(function (_ShippingDetail_) {
      ShippingDetail = _ShippingDetail_;

      mockDate = new Date('2016-02-21T00:00:00Z');

      mockShipping = new ShippingDetail({
        InHandsDate: mockDate,
        ShipDate: mockDate,
      });
    }));

    it('defaults', function () {
      mockShipping = new ShippingDetail();

      expect(mockShipping.Carrier).toEqual('');
      expect(mockShipping.Account).toEqual('');
      expect(mockShipping.InHandsDate).toEqual(null);
      expect(mockShipping.ShipDate).toEqual(null);
    });

    it('init', function () {
      expect(mockShipping.InHandsDate.valueOf()).toEqual(mockDate.valueOf());
      expect(mockShipping._datepicker.InHandsDate).toEqual(
        moment(shortDate(mapDate(mockDate))).toDate()
      );
      expect(mockShipping._datepicker.ShipDate).toEqual(
        moment(shortDate(mapDate(mockDate))).toDate()
      );
      expect(mapDate(moment(mockDate)).valueOf()).toEqual(
        moment(mockDate).valueOf()
      );
    });

    it('inHandsDay', function () {
      var newDate = new Date('2015-04-02');

      mockShipping.inHandsDay(newDate);
      mockShipping.shipDay(newDate);

      expect(mockShipping.InHandsDate.valueOf()).toEqual(
        mapDate(shortDate(newDate)).valueOf()
      );
      expect(mockShipping._datepicker.InHandsDate).toEqual(
        moment(shortDate(mapDate(shortDate(newDate)))).toDate()
      );
      expect(mockShipping.inHandsDay()).toEqual(
        moment(shortDate(mapDate(shortDate(newDate)))).toDate()
      );

      expect(mockShipping.ShipDate.valueOf()).toEqual(
        mapDate(shortDate(newDate)).valueOf()
      );
      expect(mockShipping._datepicker.ShipDate).toEqual(
        moment(shortDate(mapDate(shortDate(newDate)))).toDate()
      );
      expect(mockShipping.shipDay()).toEqual(
        moment(shortDate(mapDate(shortDate(newDate)))).toDate()
      );
    });
  });

  function mapDate(val) {
    if (val) {
      if (val instanceof moment) {
        return val.clone();
      }

      return moment.utc(val);
    }

    return null;
  }

  function shortDate(val) {
    if (val) {
      if (val instanceof moment) {
        return val.format('YYYY-MM-DD');
      }

      return (
        val.getFullYear() +
        '-' +
        ('0' + (val.getMonth() + 1)).slice(-2) +
        '-' +
        ('0' + val.getDate()).slice(-2)
      );
    }

    return null;
  }
})();
