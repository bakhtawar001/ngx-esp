(function () {
  'use strict';

  angular
    .module('orders.models')
    .factory('OrderTypeSettings', OrderTypeSettings);

  OrderTypeSettings.$inject = ['$filter'];

  function OrderTypeSettings($filter) {
    var typeSettings = {
      samplerequest: {
        Name: 'Sample Request',
        Instructions: { exclude: ['Vendor', 'Customer', 'None'] },
      },
      quote: {
        Name: 'Quote',
        Instructions: { include: ['Vendor', 'Customer'], exclude: ['None'] },
      },
      order: {
        Name: 'Order',
        Instructions: { exclude: ['Vendor', 'Customer', 'None'] },
      },
      invoice: {
        Name: 'Invoice',
        Instructions: { include: ['All', 'Invoice'], exclude: ['None'] },
      },
    };

    function isTypeSupportsInstruction(orderType, instructionCode) {
      if (typeSettings[orderType]) {
        if (typeSettings[orderType].Instructions.include) {
          var supported = $filter('filter')(
            typeSettings[orderType].Instructions.include,
            function (instruction) {
              return instruction === instructionCode;
            }
          );
          return (
            supported !== undefined && supported !== null && supported.length
          );
        } else {
          var unsupported = $filter('filter')(
            typeSettings[orderType].Instructions.exclude,
            function (instruction) {
              return instruction === instructionCode;
            }
          );
          return (
            unsupported === undefined ||
            unsupported === null ||
            !unsupported.length
          );
        }
      } else {
        return false;
      }
    }

    function getTypeName(orderType) {
      return typeSettings[orderType].Name;
    }

    return {
      isTypeSupportsInstruction: isTypeSupportsInstruction,
      getTypeName: getTypeName,
    };
  }
})();
