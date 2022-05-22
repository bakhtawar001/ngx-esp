/* TODO: Remove - left here for reference during extraction
(function () {
  'use strict';

  angular.module('orders.models').factory('LineItem', LineItem);

  LineItem.$inject = [
    'ProductLineItem_XX',
    'TitleLineItem_XX',
    'ServiceCharge_XX',
    'Decoration_XX',
  ];

  function LineItem(ProductLineItem, TitleLineItem, ServiceCharge, Decoration) {
    return new Factory();

    function Factory() {
      function Model(value) {
        value = value || {};

        switch (value.Type) {
          case 'product':
            return new ProductLineItem(value);
          case 'service':
            return new ServiceCharge(value);
          default:
            return new TitleLineItem(value);
        }
      }

      function ModelCollection(value) {
        value = value || [];

        value.allProductsConfigured = allProductsConfigured;

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
        var inst = rawObj.constructor === Model ? rawObj : new Model(rawObj);

        // set a pointer to the array
        inst.$$array = arrayInst;

        return inst;
      }

      Model.$strip = ProductLineItem.$strip;

      Model.List = ModelCollection;

      Model.ProductLineItem = ProductLineItem;
      Model.ServiceCharge = ServiceCharge;
      Model.TitleLineItem = TitleLineItem;

      return Model;
    }

    function allProductsConfigured() {
      return allProductsAreConfigured(this);
    }
  }
})();
*/

import {
  LineItem,
  OrderLineItemDomainModel,
  ProductLineItem,
  ProductLineItemDomainModel,
  ServiceLineItem,
  ServiceLineItemDomainModel,
  TitleLineItem,
} from '@esp/models';

export function allProductsAreConfigured(lineItems: LineItem[]) {
  const products = lineItems.filter(isProductLineItem);

  return (
    !products.length ||
    products.every(function (p) {
      return p.Variants.length;
    })
  );
}

export function isProductLineItem(
  lineItem: LineItem
): lineItem is ProductLineItem;
export function isProductLineItem(
  lineItem: OrderLineItemDomainModel
): lineItem is ProductLineItemDomainModel;
export function isProductLineItem(
  lineItem: LineItem | OrderLineItemDomainModel
) {
  return lineItem.Type === 'product';
}

export function isServiceLineItem(
  lineItem: LineItem
): lineItem is ServiceLineItem;
export function isServiceLineItem(
  lineItem: OrderLineItemDomainModel
): lineItem is ServiceLineItemDomainModel;
export function isServiceLineItem(
  lineItem: LineItem | OrderLineItemDomainModel
) {
  return lineItem.Type === 'service';
}

export function isTitleLineItem(lineItem: LineItem): lineItem is TitleLineItem {
  return lineItem.Type === 'title';
}
