import { Instruction } from '@esp/models';

/* TODO: Remove - left here for reference during extraction
(function () {
  'use strict';

  angular.module('orders.models').factory('Instruction', Instruction);

  Instruction.$inject = ['$simpleModelFactory', 'instructionFormTypeMapper'];

  function Instruction($simpleModelFactory, instructionFormTypeMapper) {

    var model = $simpleModelFactory({
      pk: 'Id',
      defaults: {
        Type: 'All',
        Content: '',
      },
      instance: {
        toString: function () {
          return this.Content;
        },
        toHtmlString: function () {
          return instructionAsHtml(this.Content);
        },
        isDefined: function () {
          return angular.isDefined(this.Content) && this.Content.length;
        },
        isUndefined: function () {
          return !this.isDefined();
        },
      },
      init: function (instance) {
        instance.Types = instructionFormTypeMapper.getTypesFromType(
          instance.Type
        );
      },
      list: {
        hasSpecial: false,
        checkForSpecial: checkForSpecial,
      },
    });

    /* List Methods /
    function checkForSpecial() {
      var instance = this;
      instance.hasSpecial = hasSpecialInstruction(instance);
      return instance.hasSpecial;
    }

    return model;
  }
})();
*/

export function hasSpecialInstruction(instructions: Instruction[]): any {
  return (instructions || []).some(function (ins) {
    return ins.Type === 'SpecialsPurchaseOrder';
  });
}

export function instructionAsHtml(content: any) {
  return content.replace(/(?:\r\n|\r|\n)/g, '<br />');
}
