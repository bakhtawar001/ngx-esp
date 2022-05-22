/* TODO: Remove - left here for reference during extraction
(function () {
  'use strict';

  angular.module('orders.models').factory('Payment', Payment);

  Payment.$inject = ['$simpleModelFactory'];

  function Payment($simpleModelFactory) {
    var model = $simpleModelFactory({
      pk: 'Id',
      map: {
        Date: mapDate,
      },
      defaults: {
        Date: shortDate(new Date()),
      },
      init: function (instance) {
        // Fix any bad data.
        instance.Date = instance.Date ? instance.Date.startOf('day') : null;

        setCalendarFields.apply(instance);
      },
      instance: {
        paymentDay: paymentDay,
      },
    });

    return model;

    function datepickerDay(key, newVal) {
      if (typeof newVal !== 'undefined') {
        this[key] = mapDate(shortDate(newVal));

        return validate.apply(this);
      }

      return this._datepicker[key];
    }

    function mapDate(val) {
      if (val) {
        if (val instanceof moment) {
          return val.clone();
        }

        return moment.utc(val);
      }

      return null;
    }

    function paymentDay(newVal) {
      return datepickerDay.apply(this, ['Date', newVal]);
    }

    function setCalendarFields() {
      this._datepicker = {
        Date: this.Date ? moment(shortDate(this.Date)).toDate() : null,
      };
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

    function validate() {
      setCalendarFields.apply(this);
    }
  }
})();
*/
