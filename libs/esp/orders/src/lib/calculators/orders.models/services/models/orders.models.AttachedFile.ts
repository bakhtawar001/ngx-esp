/* TODO: Remove - left here for reference during extraction
(function () {
  'use strict';

  angular.module('orders.models').factory('AttachedFile', AttachedFile);

  AttachedFile.$inject = ['$simpleModelFactory'];

  function AttachedFile($simpleModelFactory) {
    var model = $simpleModelFactory({
      pk: 'Id',
      defaults: {
        Purpose: '',
        OriginalFileName: '',
        OnDiskFileName: '',
      },
    });

    return model;
  }
})();
*/
