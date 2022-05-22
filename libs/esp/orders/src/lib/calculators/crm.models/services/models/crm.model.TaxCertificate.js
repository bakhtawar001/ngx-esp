(function () {
  'use strict';

  angular
    .module('crm.models')
    .factory('TaxCertificate', TaxCertificate);

  TaxCertificate.$inject = ['$simpleModelFactory'];

  function TaxCertificate($simpleModelFactory) {
    var model = $simpleModelFactory({
      pk: 'Id',
      map: {
        EffectiveDate: mapDate
      },
      defaults: {
        Id: 0,
        Name: '',
        State: '',
        Reason: '',
        EffectiveDate: null
      },
      init: function (instance) {
        // Fix any bad data.
        instance.EffectiveDate = instance.EffectiveDate ? instance.EffectiveDate.startOf('day') : null;

        instance.setCalendarFields();
      },
      instance: {
        effectiveDay: effectiveDay,
        setCalendarFields: setCalendarFields
      }
    });

    return model;

    function datepickerDay(key, newVal) {
      if (typeof newVal !== 'undefined') {
        this[key] = mapDate(shortDate(newVal));

        return validate.apply(this);
      }

      return this._datepicker[key];
    }

    function effectiveDay(newVal) {
      return datepickerDay.apply(this, ['EffectiveDate', newVal]);
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

    function setCalendarFields() {
      this._datepicker = {
        EffectiveDate: this.EffectiveDate ? moment(shortDate(this.EffectiveDate)).toDate() : null
      };
    }

    function shortDate(val) {
      if (val) {
        if (val instanceof moment) {
          return val.format('YYYY-MM-DD');
        }

        return val.getFullYear() + '-' + ('0' + (val.getMonth() + 1)).slice(-2) + '-' + ('0' + val.getDate()).slice(-2);
      }

      return null;
    }

    function validate() {
      setCalendarFields.apply(this);
    }
  }
})();
