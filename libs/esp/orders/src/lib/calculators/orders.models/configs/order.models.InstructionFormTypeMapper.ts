(function () {
  'use strict';

  angular
    .module('orders.models')
    .factory('instructionFormTypeMapper', formTypeMapper);

  formTypeMapper.$inject = ['$filter'];

  function formTypeMapper($filter) {
    var map = [
      'All',
      'Customer',
      'Acknowledgement',
      'Invoice',
      'Vendor',
      'PurchaseOrder',
      'SpecialsPurchaseOrder',
    ];

    function getTypeFromTypes(types) {
      var result = 0;
      for (var i = 0; i < map.length; i++) {
        if (types.includes(map[i])) result += 1 << i;
      }
      return result;
    }

    function getTypesFromType(type) {
      var result = [];
      for (var i = 0; i < map.length; i++) {
        if (type & (1 << i)) result.push(map[i]);
      }
      return result;
    }

    return {
      getTypeFromTypes: getTypeFromTypes,
      getTypesFromType: getTypesFromType,
    };
  }
})();
