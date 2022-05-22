(function () {
  'use strict';

  angular
    .module('crm.models')
    .factory('Phone', Phone);

  Phone.$inject = ['$simpleModelFactory'];

  function Phone($simpleModelFactory) {
    var model = $simpleModelFactory({
      pk: 'Id',
      defaults: {
        Type: 'Mobile',
        Country: 'US',
        PhoneCode: '1',
        Number: '',
        Extension: '',
        IsPrimary: false
      },
      instance: {
        // toString: function () {
        //    var result = [];

        //    for (var i = 0; i < ADDRESS_COMPONENTS.length; i++) {
        //        var value = '';

        //        if (this[ADDRESS_COMPONENTS[i]] === 'State+PostalCode') {
        //            value = (this.State || '' + ' ' + this.PostalCode || '').trim()
        //        } else if (angular.isDefined(this[ADDRESS_COMPONENTS[i]])) {
        //            value = this[ADDRESS_COMPONENTS[i]];
        //        }

        //        if (value.length) {
        //            result.push(value);
        //        }
        //    }

        //    return result.join(' ');
        // },
        isDefined: function () {
          return angular.isDefined(this.Number) && this.Number.length;
        },
        isUndefined: function () {
          return !this.isDefined();
        }
      }
    });

    return model;
  }
})();
