(function () {
  'use strict';

  angular
    .module('crm.models')
    .factory('ShippingAccount', ShippingAccount);

  ShippingAccount.$inject = ['$simpleModelFactory'];

  function ShippingAccount($simpleModelFactory) {
    var model = $simpleModelFactory({
      pk: 'Id',
      defaults: {
        Type: '',
        Number: ''
      },
      instance: {
        toString: function () {
          return this.Number;
        },
        isDefined: function () {
          return (angular.isDefined(this.Type) && this.Type.length) ||
            (angular.isDefined(this.Number) && this.Number.length);
        },
        isUndefined: function () {
          return !this.isDefined();
        }
      }
    });

    return model;
  }
})();
