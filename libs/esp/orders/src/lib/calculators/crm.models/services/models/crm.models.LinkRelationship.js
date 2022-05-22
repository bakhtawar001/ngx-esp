(function () {
  'use strict';

  angular
    .module('crm.models')
    .factory('LinkRelationship', LinkRelationship);

  LinkRelationship.$inject = ['$simpleModelFactory'];

  function LinkRelationship($simpleModelFactory) {
    var model = $simpleModelFactory({
      pk: 'Id',
      defaults: {
        Id: 0,
        Reverse: false
      },
      list: {
        getPersonLinks: function () {
          var result = [];

          angular.forEach(this, function (link) {
            if (isTruthy(link) && isTruthy(link.To) && isTruthy(link.To.IsPerson)) {
              result.push(link);
            }
          });

          return result;
        },

        getCompanyLinks: function () {
          var result = [];

          angular.forEach(this, function (link) {
            if (isTruthy(link) && isTruthy(link.To) && isTruthy(link.To.IsCompany)) {
              result.push(link);
            }
          });

          return result;
        }
      },
      instance: {
        getRelationship: function (parent) {
          if (parent) {
            if (isTruthy(this.To) && ((isTruthy(parent.IsCompany) && isTruthy(this.To.IsCompany)) || (isTruthy(parent.IsPerson) && isTruthy(this.To.IsPerson)))) {
              if (isTruthy(this.Type)) {
                return ((this.Reverse ? this.Type.Reverse : this.Type.Forward) + ' ' + parent.Name).trim();
              }

              return ('unknown relationship ' + parent.Name).trim();
            }

            return this.Title;
          }
        },

        isCompanyContactRelationship: function (parent) {
          if (!parent) {
            throw new Error('LinkRelationship: isCompanyContactRelationship expects an object');
          }

          return (isTruthy(parent.IsCompany) && isTruthy(this.To.IsPerson)) || (isTruthy(parent.IsPerson) && isTruthy(this.To.IsCompany));
        },

        isDefined: function () {
          console.warn('Not implemented');
        },
        isUndefined: function () {
          return !this.isDefined();
        }
      }
    });

    function isTruthy(val) {
      return angular.isDefined(val) && val;
    }

    return model;
  }
})();
