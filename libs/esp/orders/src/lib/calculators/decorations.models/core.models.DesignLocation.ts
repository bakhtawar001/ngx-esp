(function () {
  'use strict';

  angular.module('core.models').factory('DesignLocation', DesignLocation);

  DesignLocation.$inject = ['$simpleModelFactory'];

  function DesignLocation($simpleModelFactory) {
    var model = $simpleModelFactory({
      pk: 'Id',
      map: {
        Json: mapJson,
      },
      defaults: {
        Name: '',
      },
      instance: {
        isDefined: function () {
          return angular.isDefined(this.Name) && this.Name.length;
        },
        isUndefined: function () {
          return !this.isDefined();
        },
      },
    });

    return model;

    function mapJson(val) {
      if (val) {
        if (typeof val === 'string') return angular.fromJson(val);

        return val;
      }

      return null;
    }
  }
})();
