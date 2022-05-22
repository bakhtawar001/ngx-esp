(function () {
  'use strict';

  angular
    .module('crm.models')
    .factory('Party', Party);

  Party.$inject = ['Company', 'Contact'];

  function Party(Company, Contact) {
    return new Factory();

    function Factory() {
      function Model(value) {
        value = value || {};

        if (value.IsPerson && !value.IsCompany) {
          return new Contact(value);
        } else if (value.IsCompany && !value.IsPerson) {
          return new Company(value);
        }
      }

      function ModelCollection(value) {
        value = value || [];

        // wrap each obj
        value.forEach(function (v, i) {
          // this should not happen but prevent blow up
          if (v === null || v === undefined) return;

          // reset to new instance
          value[i] = wrapAsNewModelInstance(v, value);
        });

        // override push to set an instance
        // of the list on the model so destroys will chain
        var __oldPush = value.push;
        value.push = function () {
          // Array.push(..) allows to pass in multiple params
          var args = Array.prototype.slice.call(arguments);

          for (var i = 0; i < args.length; i++) {
            args[i] = wrapAsNewModelInstance(args[i], value);
          }

          __oldPush.apply(value, args);
        };

        return value;
      }

      // helper function for creating a new instance of a model from
      // a raw JavaScript obj. If it is already a model, it will be left
      // as it is
      function wrapAsNewModelInstance(rawObj, arrayInst) {
        // create an instance
        var inst = rawObj.constructor === Model ?
          rawObj : new Model(rawObj);

        // set a pointer to the array
        inst.$$array = arrayInst;

        return inst;
      }

      Model.$strip = Company.$strip;

      Model.map = Model;
      Model.Company = Company;
      Model.Contact = Contact;
      Model.List = ModelCollection;

      return Model;
    }
  }
})();
