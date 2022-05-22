(function () {
  'use strict';

  angular
    .module('crm.models')
    .factory('EmailAddress', EmailAddress);

  EmailAddress.$inject = ['$simpleModelFactory'];

  function EmailAddress($simpleModelFactory) {
    var model = $simpleModelFactory({
      pk: 'Id',
      defaults: {
        Type: 'Work',
        Address: '',
        IsPrimary: false
      },
      instance: {
        toString: function () {
          return this.Address;
        },
        isDefined: function () {
          return angular.isDefined(this.Address) && this.Address.length;
        },
        isUndefined: function () {
          return !this.isDefined();
        }
      }
    });

    return model;
  }
})();
