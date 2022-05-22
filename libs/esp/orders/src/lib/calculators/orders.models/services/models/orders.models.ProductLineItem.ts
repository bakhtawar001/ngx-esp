import {
  DecorationLineItem,
  DecorationLineItemDomainModel,
  LineItemTotals,
  OrderCurrency,
  PricedLineItem,
  ProductLineItem,
  ProductLineItemDomainModel,
  ProductVariant,
  ServiceCharge,
  ServiceChargeDomainModel,
  Vendor,
} from '@esp/models';
import { sumBy } from 'lodash-es';
import {
  calculateDecorationTotals,
  createDecoration,
} from '../../../decorations.models/core.models.Decoration';
import * as LineItemCalculator from './orders.models.LineItemCalculator';
import { createProductVariant } from './orders.models.ProductVariant';
import { asNumber } from './utils';
import {
  calculateSalesTax,
  createCommonLineItemProps,
  ensureArrayIsSequenced,
  removeItem,
  roundToPlace,
  toFixedNumber,
} from './_shared';

/* TODO: Remove - left here for reference during extraction
(function () {
  'use strict';

  angular.module('orders.models').factory('ProductLineItem', ProductLineItem);

  ProductLineItem.$inject = [
    '$simpleModelFactory',
    '$filter',
    'ProductVariant_XX',
    'ServiceCharge_XX',
    'ShippingDetail_XX',
    'Decoration_XX',
    'Instruction',
    'Company',
    'LineItemCalculator_XX',
    'OrderStatus_XX',
    'uuidv4Service',
  ];

  function ProductLineItem(
    $simpleModelFactory,
    $filter,
    ProductVariant,
    ServiceCharge,
    ShippingDetail,
    Decoration,
    Instruction,
    Company,
    LineItemCalculator,
    OrderStatus,
    uuidv4Service
  ) {
    var model = $simpleModelFactory({
      pk: 'Id',
      map: {
        Decorations: mapDecorations,
        Instructions: Instruction.List,
        ServiceCharges: ServiceCharge.List,
        ShippingDetails: ShippingDetail.List,
        Supplier: Company,
        TaxRates: LineItemCalculator.TaxRate.List,
        Variants: ProductVariant.List,
      },
      defaults: {
        Type: 'product',
        Decorations: [],
        Instructions: [],
        TaxRates: [],
        Variants: [],
        Categories: [],
        Totals: {},
        ImageUrl: '',
        ProductId: 0,
        CurrencyCode: 'USD',
        Status: OrderStatus.Default,
        IsEditable: true,
      },
      init: init,
      instance: {
        calculateTotals: calculateTotals,
        calculateConvertedTotals: calculateConvertedTotals,

        addDecoration: function (options) {
          options = options || {};
          if (angular.isUndefined(options.CurrencyCode)) {
            options.CurrencyCode = this.CurrencyCode;
          }
          this.Decorations = appendDecorationLineItem(
            this.Supplier,
            this.Decorations,
            options
          );
        },
        removeDecoration: function (item) {
          this.Decorations = removeDecorationLineItem(this.Decorations, item);
        },

        addCharge: function (options) {
          addItem(this.ServiceCharges, options, ServiceCharge, true);
          this.calculateTotals();
        },

        removeCharge: function (item) {
          removeItem(this.ServiceCharges, item, true);
          this.calculateTotals();
        },

        addInstruction: function (options) {
          addItem(this.Instructions, options, Instruction);
          this.Instructions.checkForSpecial();
        },
        removeInstruction: function (item) {
          removeItem(this.Instructions, item);

          this.Instructions.checkForSpecial();
        },

        addShippingDetail: function (options) {
          addItem(this.ShippingDetails, options, ShippingDetail, true);
        },
        removeShippingDetail: function (item) {
          removeItem(this.ShippingDetails, item, true);
        },
        confirmLineItemRemove: function (orderType) {
          var hasRelationship =
            this.Relationships && this.Relationships.length >= 1;

          if (hasRelationship) {
            if (orderType === 'order') {
              var allFromOriginal =
                this.Relationships.filter(function (e) {
                  return e.Relationship === 'From Original';
                }).length === this.Relationships.length;
              var allToOriginal =
                this.Relationships.filter(function (e) {
                  return e.Relationship === 'To Original';
                }).length === this.Relationships.length;
              var hasMutipleRelationshipTypes =
                !allFromOriginal && !allToOriginal;
              if (hasMutipleRelationshipTypes) {
                return $filter('translate')(
                  'ORDERS.ALERTS.MULTIPLE_RELATIONSHIP_TYPE'
                );
              } else if (allFromOriginal) {
                return $filter('translate')('ORDERS.ALERTS.FROM_ORIGINAL');
              } else if (allToOriginal) {
                return $filter('translate')('ORDERS.ALERTS.TO_ORIGINAL');
              }
            } else if (orderType === 'invoice') {
              return $filter('translate')('ORDERS.ALERTS.INVOICE_ORDER_TYPE');
            } else if (orderType === 'quote') {
              return $filter('translate')('ORDERS.ALERTS.QUOTE_ORDER_TYPE');
            }
          }

          return $filter('translate')(
            'ORDERS.LABELS.CONFIRMATION_MSG_TO_DELETE_THIS_LINE_ITEM'
          );
        },
        addTaxRate: function (options) {
          addItem(this.TaxRates, options, LineItemCalculator.TaxRate);
          calculateTotals.apply(this);
        },
        removeTaxRate: function (item) {
          removeItem(this.TaxRates, item);
          calculateTotals.apply(this);
        },

        // Variants
        addVariant: function (options) {
          this.Variants = appendProductVariant(this.Variants, options);
          calculateTotals.apply(this);
        },
        removeVariant: function (item) {
          removeVariantFromDecoration(this.Decorations, item);
          removeItem(this.Variants, item, true);
          calculateTotals.apply(this);
        },
        setIsTaxable: setIsTaxable,
        setVariantSequence: function () {
          setSequence(this.Variants);
        },
      },
    });

    return model;

    function init(instance) {
      OrderStatus.setSecurityPolicy(instance);

      const updated = setupProductLineItem(instance);
      // MUTATE!
      Object.assign(instance, updated);

      if (instance.Decorations.length) {
        instance.Decorations = instance.Decorations.map(function (dec) {
          if (!dec.CurrencyCode) {
            dec.CurrencyCode = instance.CurrencyCode;
          }
          return dec;
        });
      }

      instance.Instructions.hasSpecial = hasSpecialInstruction(
        instance.Instructions
      );
      instance.calculateTotals();
    }

    function calculateTaxRate_() {
      var result = 0;

      if (this.TaxRates && this.TaxRates.length) {
        angular.forEach(this.TaxRates, function (taxRate) {
          result += taxRate.Rate;
        });
      }

      this._totalTaxRate = result;
    }

    function calculateTotals(ignoreMargin, formatValues) {
      const totalUnits = getTotalUnits(this);
      const quantityOrdered = getTotalOrderedUnits(this);
      const taxRate = calculateTaxRate(this.TaxRates);

      if (totalUnits !== this.Totals.Units) {
        updateServiceChargeUnits(this, totalUnits);
      }

      const totals = calculateProductLineItemTotals(
        this,
        taxRate,
        ignoreMargin
      );

      //MUTATE!!!
      Object.assign(this, {
        Totals: {
          ...totals,
          // Note: This should have been on the line for invoices, but it
          // seems to have been set here just for view purposes.
          QuantityOrdered: quantityOrdered,
        },
      });

      if (formatValues) {
        LineItemCalculator.formatLineItemValues(this);
      }

      function getTotalOrderedUnits(productLineItem: ProductLineItem) {
        return sumBy(productLineItem.Variants, (item) =>
          asNumber(item.QuantityOrdered)
        );
      }

      function getTotalUnits(productLineItem: ProductLineItem) {
        return sumBy(productLineItem.Variants, (item) =>
          asNumber(item.Quantity)
        );
      }
    }

    function calculateConvertedTotals(
      conversionRates,
      orderCurrency,
      orderDiscount
    ) {
      return calculateConvertedProductLineItemTotals(
        this,
        this._totalTaxRate,
        conversionRates,
        orderCurrency,
        orderDiscount
      );
    }

    function addItem(arr, options, Entity, hasSequence = false) {
      var item;

      if (options instanceof Entity) {
        item = options;
      } else {
        item = new Entity(options);
      }

      if (!item.Id) {
        var id = uuidv4Service.uuidv4();
        item.CorrelationId = id;
      }

      arr.push(item);

      hasSequence && setSequence(arr);
    }

    function removeItem(arr, item, hasSequence = false) {
      if (angular.isDefined(item)) {
        if (typeof item === 'number') {
          if (angular.isDefined(arr[item])) {
            arr.splice(item, 1);
          }
        } else {
          arr.splice(arr.indexOf(item), 1);
        }

        hasSequence && setSequence(arr);
      }
    }

    function removeVariantFromDecoration(decorations, variant) {
      if (variant) {
        angular.forEach(decorations, function (decoration) {
          angular.forEach(decoration.Details, function (detail) {
            var key = variant.Id || variant.CorrelationId;
            removeItem(detail.Variants, '' + key, false);
          });
        });
      }
    }

    function updateRunChargeUnits(charges, units) {
      angular.forEach(charges, function (charge) {
        if (charge.IsRunCharge) {
          charge.Quantity = units;
          charge.calculateTotals();
        }
      });
    }

    function setIsTaxable(isTaxable) {
      const newLine = setProductLineItemIsTaxable(this, isTaxable);
      // MUTATE
      Object.assign(this, newLine);
    }

    function setSequence(arr) {
      angular.forEach(arr, function (v, i) {
        v.Sequence = i;
      });
    }

    function updateServiceChargeUnits(lineItem, units) {
      updateRunChargeUnits(lineItem.ServiceCharges, units);

      angular.forEach(lineItem.Decorations, function (decoration) {
        updateRunChargeUnits(decoration.ServiceCharges, units);
        decoration.calculateTotals();
      });
    }

    function mapDecorations(val) {
      if (val && val.length) {
        return new Decoration.List(val);
      } else {
        var decoration = new Decoration();

        return new Decoration.List([decoration]);
      }
    }
  }
})();

*/

export function createProductLineItem(
  props: Partial<ProductLineItem>
): ProductLineItem {
  const newLineItem: ProductLineItem = {
    Type: 'product',
    Decorations: [],
    Instructions: [],
    TaxRates: [],
    Variants: [],
    Categories: [],
    ServiceCharges: [],
    ImageUrl: '',
    ProductId: 0,
    // IsEditable: true, // on old type but not on type from api
    // === Props without defaults in old code ===
    Name: '',
    Relationships: [],
    Supplier: null,
    ...createCommonLineItemProps(),
    ...props,
  };
  return setupProductLineItem(newLineItem);
}

export function setupProductLineItem(productLineItem: ProductLineItem) {
  const currencyCode =
    productLineItem.CurrencyCode || productLineItem.Variants?.[0]?.CurrencyCode;

  const newProductLineItem: ProductLineItem = {
    ...productLineItem,
    CurrencyCode: currencyCode,
    Variants: productLineItem.Variants || [],
    ServiceCharges: productLineItem.ServiceCharges || [],
    Decorations: productLineItem.Decorations || [],
  };

  if (!newProductLineItem.Id && !newProductLineItem.ProductId) {
    if (!newProductLineItem.Variants.length) {
      newProductLineItem.Variants = appendProductVariant(
        newProductLineItem.Variants,
        {
          CurrencyCode: newProductLineItem.CurrencyCode,
        }
      );
    }

    if (!newProductLineItem.Decorations.length) {
      newProductLineItem.Decorations = appendDecorationLineItem(
        newProductLineItem.Supplier,
        newProductLineItem.Decorations
      );
    }
  }

  // The old code would pass the CurrencyCode to all Decorations at this point
  //  to make it available as a default to any service charges added to the decoration

  // The old code would run code here to add a 'hasSpecial' property to the instructions list
  // we could do similar and make it available on the eventual viewmodel
  /*
  viewModel.hasSpecialInstruction = hasSpecialInstruction(
    newProductLineItem.Instructions
  );
  */

  // On the view model, isEditable and isLocked would be set by the security policy from the Status
  // ie. viewModel.isEditableForUser, viewModel.isLockedFroUser;
  return newProductLineItem;
}

export function appendProductVariant(
  productVariants: ProductVariant[],
  props: Partial<ProductVariant>
) {
  const productVariant = createProductVariant({
    ...props,
    Sequence: productVariants.length,
  });
  return ensureArrayIsSequenced([...productVariants, productVariant]);
}

export function appendDecorationLineItem(
  productSupplier: Vendor,
  decorations: DecorationLineItem[],
  props: Partial<DecorationLineItem> = {}
) {
  // The old code would pass the CurrencyCode from the ProductLintItem to the
  //  Decoration, which in turn got used during creation of any ServiceCharges on the decoration
  /*
  if (angular.isUndefined(props.CurrencyCode)) {
    props.CurrencyCode = this.CurrencyCode;
  }
  */

  // The old code would overwrite any Decorator supplied on the appended decoration line item
  //  with the one from the last decoartion line item. This does not seem correct! - Mark
  const lastDecoration = decorations && decorations[decorations.length - 1];
  const decoration = createDecoration({
    ...props,
    Decorator: lastDecoration?.Decorator || productSupplier,
    ProofType: props.ProofType || null,
  });
  return [...decorations, decoration];
}

export function removeDecorationLineItem(
  arr: DecorationLineItem[],
  item: number | DecorationLineItem
) {
  return removeItem(arr, item);
}

function updateRunChargeUnits<
  T extends ServiceCharge | ServiceChargeDomainModel
>(charges: T[], totalUnits: number, taxRate: number) {
  return charges.map((charge) => {
    if (charge.IsRunCharge) {
      const newServiceCharge: T = {
        ...charge,
        Quantity: totalUnits,
      };
      const newTotals = LineItemCalculator.calculateTotals(newServiceCharge);
      return <T>{
        ...newServiceCharge,
        Totals: {
          ...newTotals,
          TaxRate: taxRate,
          // SalesTax calc added, it was missing. Is it required or optional?
          SalesTax: calculateSalesTax(newTotals.TaxableAmount, taxRate, 0),
        },
        Margin: LineItemCalculator.calculateMarginPercent(newServiceCharge),
      };
    }
    return charge;
  });
}

export function updateAllServiceChargeUnits(
  productLineItem: ProductLineItemDomainModel,
  totalUnits: number,
  taxRate: number
): ProductLineItem {
  const newServiceCharges = updateRunChargeUnits(
    productLineItem.ServiceCharges,
    totalUnits,
    taxRate
  );

  const newDecorations = (productLineItem.Decorations || []).map(
    (decoration) => {
      const updatedDecoration: DecorationLineItemDomainModel = {
        ...decoration,
        ServiceCharges: updateRunChargeUnits(
          decoration.ServiceCharges,
          totalUnits,
          taxRate
        ),
      };
      return {
        ...updatedDecoration,
        Totals: calculateDecorationTotals(updatedDecoration),
      };
    }
  );
  return {
    ...productLineItem,
    ServiceCharges: newServiceCharges,
    Decorations: newDecorations,
  };
}

type DomainModelWithTotalsProp = {
  Totals: LineItemTotals;
};

export function calculateProductLineItemTotals(
  // Explicit about required props so that the caller knows what is needed
  productLineItem: {
    Variants: (DomainModelWithTotalsProp & { Quantity: number })[];
    ServiceCharges: DomainModelWithTotalsProp[];
    Decorations: { ServiceCharges?: DomainModelWithTotalsProp[] }[];
  },
  taxRate: number,
  // NOTE: ignoreMargin not used!
  // this is definitely still applicable but at the variant level
  // in the old code there is some sequencial coupling that relied
  // on the fact that the variants would have their calculation methods
  // run with this flag before this function runs.
  ignoreMargin: boolean
): LineItemTotals & { TaxRate: number } {
  const lineItemComponents = [
    ...productLineItem.Variants,
    ...productLineItem.ServiceCharges,
    ...productLineItem.Decorations.reduce((arr, item) => {
      return [...arr, ...(item.ServiceCharges || [])];
    }, [] as DomainModelWithTotalsProp[]),
  ];

  const lineItemComponentTotals = lineItemComponents.map((item) => item.Totals);

  const taxableAmount = toFixedNumber(
    sumBy(lineItemComponentTotals, (item) => item?.TaxableAmount),
    4
  );

  return {
    Units: toFixedNumber(
      sumBy(productLineItem.Variants, (item) => asNumber(item.Quantity)),
      4
    ),
    Amount: toFixedNumber(
      sumBy(lineItemComponentTotals, (item) => item.Amount),
      4
    ),
    Cost: toFixedNumber(
      sumBy(lineItemComponentTotals, (item) => item.Cost),
      4
    ),
    Margin: toFixedNumber(
      sumBy(lineItemComponentTotals, (item) => item.Margin),
      4
    ),
    TaxableAmount: taxableAmount,
    SalesTax: taxRate ? calculateSalesTax(taxableAmount, taxRate, 0) : 0,
    TaxRate: taxRate || 0,
  };
}

export function calculateConvertedProductLineItemTotals(
  productLineItem: {
    Variants: PricedLineItem[];
    ServiceCharges: PricedLineItem[];
    Decorations: { ServiceCharges?: PricedLineItem[] }[];
  },
  taxRate: number,
  conversionRates: OrderCurrency[],
  orderCurrency: string,
  orderDiscount: number
) {
  var convertedTotals = {
    Amount: 0,
    Cost: 0,
    Margin: 0,
    TaxableAmount: 0,
    SalesTax: 0,
    TaxRate: taxRate,
  };

  productLineItem.Variants.forEach(addToConvertedTotals);

  productLineItem.Decorations.forEach(function (decoration) {
    (decoration.ServiceCharges || []).forEach(addToConvertedTotals);
  });

  productLineItem.ServiceCharges.forEach(addToConvertedTotals);

  convertedTotals.SalesTax = calculateSalesTax(
    convertedTotals.TaxableAmount,
    taxRate,
    orderDiscount
  );

  return convertedTotals;

  function addToConvertedTotals(item: PricedLineItem) {
    var result = LineItemCalculator.calculateConvertedItemTotals(
      item,
      conversionRates,
      orderCurrency
      // NOTE: discount is not passed through here.
      // Apparently this is because the discount is applied at an order level.
      // It is still used for the sales tax through, which I will need to investigate
      // as to how this fits into the scheme of things with the discount at the order level
    );

    convertedTotals.TaxableAmount = roundToPlace(
      convertedTotals.TaxableAmount + result.TaxableAmount,
      4
    );
    convertedTotals.Amount = roundToPlace(
      convertedTotals.Amount + result.Amount,
      4
    );
    convertedTotals.Cost = roundToPlace(convertedTotals.Cost + result.Cost, 4);
    convertedTotals.Margin = roundToPlace(
      convertedTotals.Margin + result.Margin,
      4
    );
  }
}

export function setProductLineItemIsTaxable(
  productLineItem: ProductLineItem,
  isTaxable: boolean
): ProductLineItem {
  return {
    ...productLineItem,
    Variants: productLineItem.Variants.map(setIsTaxable),
    ServiceCharges: productLineItem.ServiceCharges.map(setIsTaxable),
    Decorations: productLineItem.Decorations.map(
      (decoration): DecorationLineItem => {
        return {
          ...decoration,
          ServiceCharges: decoration.ServiceCharges.map(setIsTaxable),
        };
      }
    ),
  };

  function setIsTaxable<T extends { IsTaxable: boolean }>(item: T): T {
    return {
      ...item,
      IsTaxable: isTaxable,
    };
  }
}
