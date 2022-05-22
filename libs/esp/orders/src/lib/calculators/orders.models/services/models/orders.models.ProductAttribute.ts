import { ProductAttribute } from '@esp/models';
import { defaultVisibleProductAttributeTypes } from '../../configs/orders.models.constants';

/* TODO: Remove - left here for reference during extraction
(function () {
  'use strict';

  angular.module('orders.models').factory('ProductAttribute', ProductAttribute);

  ProductAttribute.$inject = [
    '$simpleModelFactory',
    'defaultVisibleProductAttributeTypes',
  ];

  function ProductAttribute(
    $simpleModelFactory,
    _defaultVisibleProductAttributeTypes
  ) {
    var model = $simpleModelFactory({
      pk: 'Id',
      defaults: {
        Type: '',
        Value: '',
        ValueType: 'NONE',
        VendorCode: '',
        Sequence: 0,
      },
      init: init,
      instance: {
        getSetType: getSetType,
        _setVisibility: setVisibility,
      },
    });

    function init(instance) {
      if (instance.Type && instance.IsVisible === undefined)
        setVisibility.apply(instance);
    }

    function getSetType(newVal) {
      if (typeof newVal !== 'undefined') {
        this.Type = newVal;

        this._setVisibility();
      }

      return this.Type;
    }

    function setVisibility() {
      if (this.IsVisible === undefined)
        this.IsVisible =
          isProductAttributeVisibleByDefault(this);
    }

    return model;
  }
})();
*/

export function createProductAttribute(
  options: Partial<ProductAttribute> = {}
): ProductAttribute {
  return {
    Id: null,
    Description: '',
    Type: '',
    TypeName: '',
    Value: '',
    ValueType: 'NONE',
    VendorCode: '',
    ...options,
  };
}

export function createImprintColorProductAttribute(): ProductAttribute {
  return createProductAttribute({
    Type: 'IMCL',
    TypeName: 'Imprint Color',
    Value: '',
  });
}

export function createImprintSizeProductAttribute(): ProductAttribute {
  return createProductAttribute({
    Type: 'IMSZ',
    TypeName: 'Imprint Size',
    Value: '',
  });
}

export function createImprintLocationProductAttribute(): ProductAttribute {
  return createProductAttribute({
    Type: 'IMLO',
    TypeName: 'Imprint Location',
    Value: '',
  });
}

export function createImprintMethodProductAttribute(): ProductAttribute {
  return createProductAttribute({
    Type: 'IMMD',
    TypeName: 'Imprint Method',
    Value: '',
  });
}

export function isProductAttributeVisibleByDefault(
  productAttribute: ProductAttribute
): any {
  return (
    defaultVisibleProductAttributeTypes.indexOf(productAttribute.Type) > -1
  );
}
