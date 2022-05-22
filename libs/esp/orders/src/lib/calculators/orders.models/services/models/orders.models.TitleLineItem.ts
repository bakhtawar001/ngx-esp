import { TitleLineItem } from '@esp/models';
import { createAuditProps } from './_shared';

/* TODO: Remove - left here for reference during extraction
(function () {
  'use strict';

  angular.module('orders.models').factory('TitleLineItem', TitleLineItem);

  TitleLineItem.$inject = ['$simpleModelFactory'];

  function TitleLineItem($simpleModelFactory) {
    var model = $simpleModelFactory({
      pk: 'Id',
      init: init,
      defaults: {
        Type: 'title',
      },
    });

    return model;

    function init(instance) {
      // temporary id to solve EO-10921 without saving after each title add - DJL 2/8/2019
      instance.correlationId = generateUUID();
    }

    // https://stackoverflow.com/a/8809472/526704
    function generateUUID() {
      // Public Domain/MIT
      var d = new Date().getTime();
      if (
        typeof performance !== 'undefined' &&
        typeof performance.now === 'function'
      ) {
        d += performance.now(); // use high-precision timer if available
      }
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
        /[xy]/g,
        function (c) {
          var r = (d + Math.random() * 16) % 16 | 0; // eslint-disable-line no-mixed-operators
          d = Math.floor(d / 16);
          return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16); // eslint-disable-line no-mixed-operators
        }
      );
    }
  }
})();
*/

export function createTitleLineItem(
  props: Partial<TitleLineItem>
): TitleLineItem {
  // old code had a correlationId property set to new guid on creation to solve EO-10921. To see if this is still necessary.
  return {
    Type: 'title',
    Name: '',
    Attributes: [],
    ...createAuditProps(),
    ...props,
  };
}
