import {
  Order,
  PricedLineItem,
  ProductLineItem,
  ProductLineItemDomainModel,
} from '@esp/models';
import { sumBy } from 'lodash-es';
import {
  asNumber,
  calculateConvertedProductLineItemTotals,
  calculateProductLineItemTotals,
  calculateTaxRate,
  setupProductLineItem,
} from '../../calculators';
import { mapProductLineItemDecoration } from './order-line-product-item-decoration-mapper';
import { mapProductLineItemVariant } from './order-line-product-item-variant-mapper';
import { mapServiceCharge } from './service-charge-mapper';

export function mapProductLineItem(
  productLineItem: ProductLineItem,
  order: Order,
  ignoreMargin: boolean
): ProductLineItemDomainModel {
  productLineItem = setupProductLineItem(productLineItem);

  const taxRate = calculateTaxRate(productLineItem.TaxRates || []);

  const totalUnits = getTotalUnits(productLineItem.Variants);
  const quantityOrdered = getTotalOrderedUnits(productLineItem.Variants);

  const preparedSubItems = {
    Variants: productLineItem.Variants.map((item) =>
      mapProductLineItemVariant(
        item,
        order.Currencies,
        order.CurrencyCode,
        order.Discount,
        taxRate,
        ignoreMargin
      )
    ),
    ServiceCharges: productLineItem.ServiceCharges.map((item) =>
      mapServiceCharge(
        item,
        totalUnits,
        order.Currencies,
        productLineItem.CurrencyCode,
        order.Discount,
        taxRate,
        ignoreMargin
      )
    ),
    Decorations: productLineItem.Decorations.map((item) =>
      mapProductLineItemDecoration(
        item,
        totalUnits,
        order.Currencies,
        productLineItem.CurrencyCode,
        order.Discount,
        taxRate,
        ignoreMargin
      )
    ),
  };

  return {
    ...productLineItem,
    ...preparedSubItems,
    QuantityOrdered: quantityOrdered,
    Totals: calculateProductLineItemTotals(
      preparedSubItems,
      taxRate,
      ignoreMargin
    ),
    ConversionTotals: calculateConvertedProductLineItemTotals(
      productLineItem,
      taxRate,
      order.Currencies,
      order.CurrencyCode,
      order.Discount
    ),
    // TotalUnits: '===== TODO =====' as null,
    // TotalPrice: '===== TODO =====' as null,
    // TotalCost: '===== TODO =====' as null,
    // ConvertedTotalPrice: '===== TODO =====' as null,
    // ConvertedTotalCost: '===== TODO =====' as null,
  };

  /*
    function init(instance: ProductLineItem) {
      OrderStatus.setSecurityPolicy(instance);

      ✔ const updated = setupProductLineItem(instance);
      ✔ // MUTATE!
      ✔ Object.assign(instance, updated);

      ✔ if (instance.Decorations.length) {
      ✔   instance.Decorations = instance.Decorations.map(function (dec) {
      ✔     if (!dec.CurrencyCode) {
      ✔       dec.CurrencyCode = instance.CurrencyCode;
      ✔     }
      ✔     return dec;
      ✔   });
      ✔ }

      instance.Instructions.hasSpecial = hasSpecialInstruction(
        instance.Instructions
      );
      instance.calculateTotals();
    }

    function calculateTotals(ignoreMargin, formatValues) {

      ✔ const totalUnits = getTotalUnits(this);
      ✔ const quantityOrdered = getTotalOrderedUnits(this);
      ✔ const taxRate = calculateTaxRate(this.TaxRates);

      ✔ if (totalUnits !== this.Totals.Units) {
      ✔   updateServiceChargeUnits(this, totalUnits);
      ✔ }

      ✔ const totals = calculateProductLineItemTotals(
      ✔   this,
      ✔   taxRate,
      ✔   ignoreMargin
      ✔ );

      ✔ //MUTATE!!!
      ✔ Object.assign(this, {
      ✔   Totals: {
      ✔     ...totals,
          // Note: This should have been on the line for invoices, but it
          // seems to have been set here just for view purposes.
      ✔     QuantityOrdered: quantityOrdered,
      ✔   },
      ✔ });

      if (formatValues) {
        LineItemCalculator.formatLineItemValues(this);
      }
    }
  */
}

function getTotalUnits(pricedItems: PricedLineItem[]) {
  return sumBy(pricedItems, (item) => asNumber(item.Quantity));
}

function getTotalOrderedUnits(pricedItems: PricedLineItem[]) {
  return sumBy(pricedItems, (item) => asNumber(item.QuantityOrdered));
}
