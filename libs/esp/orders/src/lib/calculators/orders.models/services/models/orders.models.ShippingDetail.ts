import { ShippingDetail } from '@esp/models';
import parseISO from 'date-fns/parseISO';
import startOfDay from 'date-fns/startOfDay';

/* TODO: Remove - left here for reference during extraction
(function () {
  'use strict';

  angular.module('orders.models').factory('ShippingDetail', ShippingDetail);

  ShippingDetail.$inject = ['$simpleModelFactory', 'OrderContact_XX'];

  function ShippingDetail($simpleModelFactory, OrderContact) {
    var model = $simpleModelFactory({
      pk: 'Id',
      map: {
        To: OrderContact,
        From: OrderContact,
        InHandsDate: mapDate,
        ShipDate: mapDate,
      },
      defaults: {
        Carrier: '',
        Account: '',
        ShippingAccountVisible: false,
        InHandsDate: null,
        ShipDate: null,
      },
      init: function (instance) {
        // Fix any bad data.
        instance.InHandsDate = instance.InHandsDate
          ? instance.InHandsDate.startOf('day')
          : null;
        instance.ShipDate = instance.ShipDate
          ? instance.ShipDate.startOf('day')
          : null;
        setCalendarFields.apply(instance);
      },
      instance: {
        inHandsDay: inHandsDay,
        shipDay: shipDay,
        setCalendarFields: setCalendarFields,

        clearInHandsDateOption: function () {
          this.IsInHandsDateFlexible = null;
        },
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

    function inHandsDay(newVal) {
      return datepickerDay.apply(this, ['InHandsDate', newVal]);
    }

    function shipDay(newVal) {
      return datepickerDay.apply(this, ['ShipDate', newVal]);
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
        InHandsDate: this.InHandsDate
          ? moment(shortDate(this.InHandsDate)).toDate()
          : null,
        ShipDate: this.ShipDate
          ? moment(shortDate(this.ShipDate)).toDate()
          : null,
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

export function createShippingDetail(
  options: Partial<
    Exclude<ShippingDetail, 'ShipDate' | 'InHandsDate' | 'ExpectedDate'>
  > & {
    ShipDate?: string | Date;
    InHandsDate?: string | Date;
    ExpectedDate?: string | Date;
  }
): ShippingDetail {
  const { ShipDate, InHandsDate, ExpectedDate, ...rest } = options;
  return {
    Id: null,
    Sequence: null,
    Carrier: '',
    AccountNumber: null,
    CarrierName: null,
    ExpectedDate: asDate(ExpectedDate), // Not in original code but logical to include
    From: null,
    To: null,
    ShippingFiles: [],
    // Account: '', // what is this used for?
    ShippingAccountVisible: false,
    InHandsDate: asDateStart(InHandsDate),
    ShipDate: asDateStart(ShipDate),
    ...rest,
  };
}

function asDateStart(dateOrString: string | Date) {
  const date = asDate(dateOrString);
  return date ? startOfDay(date) : null;
}

function asDate(dateOrString: string | Date) {
  if (!dateOrString) {
    return null;
  }
  return typeof dateOrString === 'string'
    ? parseISO(dateOrString)
    : dateOrString;
}
