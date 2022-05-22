import { DecorationLineItemDetail } from '@esp/models';
import { createImprintSizeProductAttribute } from '../orders.models/services/models/orders.models.ProductAttribute';

/* TODO: Remove - left here for reference during extraction
(function () {
  'use strict';

  angular.module('core.models').factory('DecorationDetail', DecorationDetail);

  DecorationDetail.$inject = ['$simpleModelFactory', 'ProductAttribute_XX'];

  function DecorationDetail($simpleModelFactory, ProductAttribute) {
    var model = $simpleModelFactory({
      pk: 'Id',
      map: {
        Location: mapAttribute,
        LogoSize: mapAttribute,
        LogoColors: ProductAttribute.List,
      },
      defaults: {
        Instructions: '',
        LogoColors: [], // IMCL
        LogoSize: { Type: 'IMSZ', Value: '' },
        VariantLinkType: 'All',
        Variants: [],
      },
      instance: {
        isDefined: function () {
          return decorationHasDetails(this);
        },
        isUndefined: function () {
          return !this.isDefined();
        },
      },
    });

    return model;

    function mapAttribute(value) {
      if (value) {
        return new ProductAttribute(value);
      }
    }
  }
})();
*/

export function createDecorationDetail(
  props: Partial<DecorationLineItemDetail> = {}
): DecorationLineItemDetail {
  return {
    Id: null,
    InstructionsVisible: true, // default value assumed
    Instructions: '',
    LogoColors: [],
    LogoSize: createImprintSizeProductAttribute(),
    VariantLinkType: 'All',
    Variants: [],
    ...props,
  };
}

export function decorationDetailPresent(
  decorationDetail: DecorationLineItemDetail
) {
  return (
    decorationDetail.Instructions ||
    (decorationDetail.LogoSize && decorationDetail.LogoSize.Value) ||
    (decorationDetail.LogoColors &&
      decorationDetail.LogoColors.length &&
      decorationDetail.LogoColors[0].Value)
  );
}
