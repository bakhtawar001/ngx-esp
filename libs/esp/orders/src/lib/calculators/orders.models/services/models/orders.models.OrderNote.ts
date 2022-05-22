/* TODO: Remove - left here for reference during extraction
(function () {
  'use strict';

  angular.module('orders.models').factory('OrderNote', OrderNote);

  OrderNote.$inject = ['$simpleModelFactory', '$filter', 'LookupTypes'];

  function OrderNote($simpleModelFactory, $filter, LookupTypes) {
    var Model = $simpleModelFactory({
      pk: 'Id',
      defaults: {
        Content: '',
        CreateDate: null,
        UpdateDate: null,
        UserName: null,
      },
      instance: {
        toString: function () {
          return this.Content;
        },
        isDefined: function () {
          return angular.isDefined(this.Content) && this.Content.length;
        },
        isUndefined: function () {
          return !this.isDefined();
        },
      },
      list: {
        groupNotes: groupNotes,
      },
    });

    /* List Methods */ /*
    function groupNotes() {
      var instance = this;

      instance.groups = $filter('notesGroupBy')(instance, {
        sortBy: { params: { updateDate: true } },
      });
    }

    return Model;
  }
})();
*/
