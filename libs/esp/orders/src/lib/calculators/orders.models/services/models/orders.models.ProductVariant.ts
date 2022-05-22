import { isUndefined } from 'lodash-es';

import { ProductAttribute, ProductVariant } from '@esp/models';

import { createCommonLineItemProps } from './_shared';

/* TODO: Remove - left here for reference during extraction
(function () {
  'use strict';

  angular.module('orders.models').factory('ProductVariant', ProductVariant);

  ProductVariant.$inject = [
    '$simpleModelFactory',
    'LineItemCalculator_xx',
    'ProductAttribute_XX',
  ];

  function ProductVariant(
    $simpleModelFactory,
    LineItemCalculator,
    ProductAttribute
  ) {
    var model = $simpleModelFactory({
      pk: 'Id',
      map: {
        Totals: LineItemCalculator,
        ProductAttributes: ProductAttribute.List,
      },
      defaults: {
        Quantity: 1,
        Price: 0,
        Cost: 0,
        Margin: 0,
        ConvertedPrice: 0,
        ConvertedCost: 0,
        ConvertedMargin: 0,
        Totals: {},
        ProductAttributes: [],
        IsTaxable: true,
        IsVisible: true,
        CurrencyCode: 'USD',
      },
      init: function (instance) {
        instance.calculateTotals();
      },
      instance: {
        addProductAttribute: function (
          options: Partial<ProductAttribute>,
          tryUpdate: boolean
        ) {
          // Replaced by the addProductAttribute function below
          var item,
            attrsLength = this.ProductAttributes.length;

          if (tryUpdate) {
            for (var i = 0; i < attrsLength; i++) {
              if (this.ProductAttributes[i].Type === options.Type) {
                this.ProductAttributes[i] = angular.extend(
                  {},
                  this.ProductAttributes[i],
                  options
                );
                return true;
              }
            }
          }

          if (options instanceof ProductAttribute) {
            item = options;
          } else {
            item = new ProductAttribute(options);
          }

          this.ProductAttributes.push(item);
        },

        removeProductAttribute: function (item: number | ProductAttribute) {
          this.ProductAttributes = removeProductAttribute(
            this.ProductAttributes,
            item
          );
        },

        getAttributesByType: function (type: string) {
          const productAttributes = this.ProductAttributes;
          return getAttributesByType(productAttributes, type);
        },

        getAttributeByValue: function (value: string) {
          const productAttributes = this.ProductAttributes;
          return getAttributeByValue(productAttributes, value);
        },

        calculateTotals: function (
          ignoreMargin: boolean,
          formatValues: boolean
        ) {
          calculateTotals(this, ignoreMargin, formatValues);
        },
      },
      list: {
        setIsTaxable: setIsTaxable,
      },
    });

    function setIsTaxable(isTaxable) {
      var instance = this;

      instance.forEach(function (variant) {
        variant.IsTaxable = isTaxable;
      });
    }

    return model;
  }
})();
*/

export function createProductVariant(
  props: Partial<ProductVariant>
): ProductVariant {
  return {
    Quantity: 1,
    Price: 0,
    Cost: 0,
    // Margin: 0, // on old type but not on type from api
    // ConvertedPrice: 0,
    // ConvertedCost: 0,
    // ConvertedMargin: 0, // on old type but not on type from api
    ProductAttributes: [],
    IsTaxable: true,
    IsVisible: true,
    // === Props without defaults in old code ===
    SKU: '',
    ...createCommonLineItemProps(),
    ...props,
  };
}

export function getAttributeByValue(
  productAttributes: ProductAttribute[],
  value: string
) {
  var attributes = productAttributes.filter(function (attr) {
    return attr.Value === value;
  });
  return attributes.length ? attributes[0] : null;
}

export function getAttributesByType(
  productAttributes: ProductAttribute[],
  type: string
) {
  var attributes = productAttributes.filter(function (attr) {
    return attr.Type === type;
  });
  return attributes;
}

export function addProductAttribute(
  productAttributes: ProductAttribute[],
  options: Partial<ProductAttribute>,
  tryUpdate: boolean
) {
  if (tryUpdate) {
    const index = productAttributes.findIndex(
      (item) => item.Type === options.Type
    );
    if (index >= 0) {
      const matchingAttribute = productAttributes[index];
      const updated = { ...matchingAttribute, options };
      return [...productAttributes].splice(index, 1, updated);
    }
  }

  const defaultProps = {
    Type: '',
    Value: '',
    ValueType: 'NONE',
    VendorCode: '',
    Sequence: 0,
  };
  const newAttribute = {
    ...defaultProps,
    ...options,
  };

  return [...productAttributes, newAttribute];
}

export function removeProductAttribute(
  arr: ProductAttribute[],
  item: number | ProductAttribute
) {
  if (isUndefined(item)) {
    return arr;
  }
  if (typeof item === 'number') {
    if (!isUndefined(arr[item])) {
      return [...arr].splice(item, 1);
    }
  } else {
    const index = arr.indexOf(item);
    return [...arr].splice(index, 1);
  }
}
