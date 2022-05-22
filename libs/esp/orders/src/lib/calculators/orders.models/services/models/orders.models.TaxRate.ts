/* TODO: Remove - left here for reference during extraction
(function () {
  'use strict';

  angular.module('orders.models').factory('TaxRate', TaxRate);

  TaxRate.$inject = ['$simpleModelFactory'];

  function TaxRate($simpleModelFactory) {
    var model = $simpleModelFactory({
      pk: 'Id',
      defaults: {
        Name: '',
        Rate: 0,
      },
      instance: {
        isDefined: isDefined,
        isUndefined: isUndefined,
      },
    });

    return model;

    function isDefined() {
      return angular.isDefined(this.Rate) && this.Rate > 0;
    }

    function isUndefined() {
      return !this.isDefined();
    }
  }
})();
*/
