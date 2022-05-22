(function () {
  'use strict';

  describe('Payment Model', function () {
    var mockDate, mockPayment, Payment;

    // We can start by loading the main application module
    beforeEach(function () {
      module('asi');
      module('preloadProviderMock');
    });

    beforeEach(inject(function (_Payment_) {
      Payment = _Payment_;

      mockDate = new Date('2016-02-21T00:00:00Z');

      mockPayment = new Payment({
        Date: mockDate,
      });
    }));

    it('defaults', function () {
      mockPayment = new Payment();

      expect(mockPayment.Date).not.toEqual(null);
    });

    it('init', function () {
      expect(mockPayment.Date.valueOf()).toEqual(mockDate.valueOf());
      expect(mockPayment._datepicker.Date).toEqual(
        moment(shortDate(mapDate(mockDate))).toDate()
      );
      expect(mapDate(moment(mockDate)).valueOf()).toEqual(
        moment(mockDate).valueOf()
      );
    });

    it('paymentDay', function () {
      var newDate = new Date('2015-04-02');

      mockPayment.paymentDay(newDate);

      expect(mockPayment.Date.valueOf()).toEqual(
        mapDate(shortDate(newDate)).valueOf()
      );
      expect(mockPayment._datepicker.Date).toEqual(
        moment(shortDate(mapDate(shortDate(newDate)))).toDate()
      );
      expect(mockPayment.paymentDay()).toEqual(
        moment(shortDate(mapDate(shortDate(newDate)))).toDate()
      );
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
  });
})();
