/* TODO: Remove - left here for reference during extraction
(function () {
  'use strict';

  angular.module('orders.models').factory('OrderContact', OrderContact);

  OrderContact.$inject = [
    '$simpleModelFactory',
    'Party',
    'Address',
    'EmailAddress',
  ];

  function OrderContact($simpleModelFactory, Party, Address, EmailAddress) {
    var model = $simpleModelFactory({
      pk: 'Id',
      map: {
        Address: Address,
        Company: Party.Company,
        Party: Party.map,
      },
      instance: {
        reset: reset,
        setAddress: setAddress,
        setCompany: setCompany,
        setEmail: setEmail,
        setParty: setParty,
      },
    });

    function reset(ignoreCompany) {
      this.Name = '';
      this.EmailAddress = '';
      this.Address = new Address();
      delete this.CompanyName;
      delete this.Party;

      if (!ignoreCompany) {
        delete this.Company;
      }
    }

    function setAddress(options) {
      var item;

      if (options instanceof Address) {
        item = options;
      } else {
        item = new Address(options);
      }

      this.Address = item;
    }

    function setCompany(options) {
      var item;

      if (options instanceof Party.Company) {
        item = angular.copy(options);
      } else {
        item = new Party.Company(options);
      }

      this.Company = item;
      this.CompanyName = item.Name;
    }

    function setEmail(options) {
      var address;

      if (typeof options === 'string') {
        address = options;
      } else if (options instanceof EmailAddress) {
        address = angular.copy(options.Address);
      } else {
        address = new EmailAddress(options).Address;
      }

      this.EmailAddress = address;
    }

    function setParty(options) {
      var item;

      if (
        options instanceof Party.Company ||
        options instanceof Party.Contact
      ) {
        item = angular.copy(options);
      } else {
        item = Party.map(options);
      }

      this.Party = item;

      if (item && !item.IsCompany) {
        this.Name = item.Name;
      }
    }

    return model;
  }
})();
*/
