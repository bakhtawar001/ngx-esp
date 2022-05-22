(function() {
  'use strict';

  angular
    .module('crm.models')
    .factory('Website', Website);

  Website.$inject = ['$simpleModelFactory'];

  function Website($simpleModelFactory) {
    var model = $simpleModelFactory({
      pk: 'Id',
      defaults: {
        Type: 'Corporate',
        Url: '',
        IsPrimary: false
      },
      instance: {
        toString: function () {
          return this.Url;
        },
        isDefined: function () {
          return angular.isDefined(this.Url) && this.Url.length;
        },
        isUndefined: function () {
          return !this.isDefined();
        }
      }
    });

    return model;
  }
})();
