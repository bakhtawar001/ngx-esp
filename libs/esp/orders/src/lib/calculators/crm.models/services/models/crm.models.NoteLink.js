(function () {
  'use strict';

  angular
    .module('crm.models')
    .factory('NoteLink', NoteLink);

  NoteLink.$inject = ['$simpleModelFactory'];

  function NoteLink($simpleModelFactory) {
    var model = $simpleModelFactory({
      pk: 'Id',
      defaults: {
        Id: 0,
        Name: '',
        IsCompany: false,
        IsPerson: false
      },
      instance: {
        toString: function () {
          return this.Name;
        },
        isDefined: function () {
          console.warn('Not implemented');
        },
        isUndefined: function () {
          return !this.isDefined();
        }
      }
    });

    return model;
  }
})();
