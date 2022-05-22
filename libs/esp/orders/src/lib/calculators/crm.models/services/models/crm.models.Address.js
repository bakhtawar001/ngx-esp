(function () {
  'use strict';

  angular
    .module('crm.models')
    .factory('Address', Address);

  Address.$inject = ['$simpleModelFactory', 'Phone'];

  function Address($simpleModelFactory, Phone) {
    var ADDRESS_COMPONENTS = ['Line1', 'Line2', 'Line3', 'Line4', 'City', 'City+State+PostalCode', 'State+PostalCode', 'Country'];

    var model = $simpleModelFactory({
      pk: 'Id',
      map: {
        Phone: Phone
      },
      defaults: {
        Name: '',
        Line1: '',
        IsPrimary: false

        // Id: 0,
        // Name: '',
        // Line2: '',
        // Line3: '',
        // Line4: '',
        // City: '',
        // State: '',
        // PostalCode: '',
        // County: '',
        // Country: '',
        // CountryType: '',
        // Latitude: '',
        // Longitude: ''
      },
      instance: {
        toString: function () {
          var result = [];

          for (var i = 0; i < ADDRESS_COMPONENTS.length; i++) {
            var value = '';

            if (ADDRESS_COMPONENTS[i] === 'State+PostalCode') {
              value = ((this.State || '') + ' ' + (this.PostalCode || '')).trim();
            } else if (angular.isDefined(this[ADDRESS_COMPONENTS[i]])) {
              value = this[ADDRESS_COMPONENTS[i]];
            }

            if (value.length) {
              result.push(value);
            }
          }

          return result.join(', ');
        },
        toHtmlFormat: function () {
          var result = [];

          for (var i = 0; i < ADDRESS_COMPONENTS.length; i++) {
            var value = '';

            if (ADDRESS_COMPONENTS[i] !== 'City') {
              if (ADDRESS_COMPONENTS[i] === 'City+State+PostalCode') {
                var component = [];

                if (this.City && this.City.length) {
                  component.push(this.City);
                }

                var statePostal = ((this.State || '') + ' ' + (this.PostalCode || '')).trim();

                if (statePostal.length) {
                  component.push(statePostal);
                }

                value = component.join(', ');
              } else if (angular.isDefined(this[ADDRESS_COMPONENTS[i]])) {
                value = this[ADDRESS_COMPONENTS[i]];
              }

              if (value.length) {
                result.push(value);
              }
            }
          }

          return result.join('<br />');
        },
        isDefined: function () {
          var result = false;

          for (var i = 0; i < ADDRESS_COMPONENTS.length; i++) {
            if (angular.isDefined(this[ADDRESS_COMPONENTS[i]]) && this[ADDRESS_COMPONENTS[i]].length) {
              result = true;
              break;
            }
          }

          return result;
        },
        isUndefined: function () {
          return !this.isDefined();
        }
      }
    });

    return model;
  }
})();
