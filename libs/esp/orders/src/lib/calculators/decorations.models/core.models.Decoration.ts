import {
  DecorationLineItem,
  DecorationLineItemDetail,
  LineItemTotals,
  MediaLink,
  ProductAttribute,
  ServiceCharge,
  ServiceChargeDomainModel,
} from '@esp/models';
import { AttributeValue } from '@smartlink/models';
import {
  createImprintColorProductAttribute,
  createImprintLocationProductAttribute,
  createImprintMethodProductAttribute,
  createImprintSizeProductAttribute,
} from '../orders.models/services/models/orders.models.ProductAttribute';
import { createServiceCharge } from '../orders.models/services/models/orders.models.ServiceCharge';
import { ensureArrayIsSequenced } from '../orders.models/services/models/_shared';
import {
  CompanyDecoration,
  createCompanyDecoration,
} from './core.models.CompanyDecoration';
import {
  createDecorationDetail,
  decorationDetailPresent,
} from './core.models.DecorationDetail';

/* TODO: Remove - left here for reference during extraction
(function () {
  'use strict';

  angular.module('core.models').factory('Decoration', Decoration);

  Decoration.$inject = [
    '$simpleModelFactory',
    'ServiceCharge_XX',
    'ShippingDetail_XX',
    'Company',
    'ProductAttribute_XX',
    'DecorationDetail_XX',
    'CompanyDecoration_XX',
    'MediaLink_XX',
    'OrderStatus_XX',
  ];

  function Decoration(
    $simpleModelFactory,
    ServiceCharge,
    ShippingDetail,
    Company,
    ProductAttribute,
    DecorationDetail,
    CompanyDecoration,
    MediaLink,
    OrderStatus
  ) {
    var typeMap = {
      Decoration: 'IMMD', // Imprint method
      Location: 'IMLO',
    };

    var model = $simpleModelFactory({
      pk: 'Id',
      map: {
        ServiceCharges: ServiceCharge.List,
        ShippingDetail: ShippingDetail,
        Decorator: mapCompany,
        Decoration: mapAttribute,
        Details: DecorationDetail.List,
      },
      defaults: {
        Artwork: [],
        ProofType: null,
        ProofEmail: null,
        Status: 'Open',
        Details: [new DecorationDetail()],
        IsEditable: true,
      },
      init: init,
      instance: {
        addCharge: addCharge,
        addDetail: addDetail,
        calculateTotals: calculateTotals,
        getSetDecoration: imprintMethodMap,
        getSetLocation: imprintLocationMap,
        isDefined: isDefined,
        removeCharge: removeCharge,
        removeDetail: removeDetail,
        setCompanyDecoration: setCompanyDecoration,
        saveAsCompanyDecoration: saveAsCompanyDecoration,
        toCompanyDecoration: toCompanyDecoration,
        preSave: preSave,
      },
    });

    return model;

    function init(instance) {
      instance.$$selected = {};

      // MUTATES the DecorationLineItem and sets the isEditable and isLocked as well as remembers the initial isEditable setting
      OrderStatus.setSecurityPolicy(instance); // DecorationLineItem

      Object.keys(typeMap).forEach(function (property) {
        mapSelected.apply(instance, [property]);
      });

      calculateTotals.apply(instance);
    }

    function addCharge(options) {
      options = options || {};

      if (angular.isUndefined(options.CurrencyCode)) {
        options.CurrencyCode = this.CurrencyCode;
      }

      addItem(this.ServiceCharges, options, ServiceCharge, true);
      calculateTotals.apply(this);
    }

    function addDetail(options) {
      addItem(this.Details, options, DecorationDetail, false);
    }

    function removeDetail(item) {
      removeItem(this.Details, item);
    }

    function addItem(arr, options, Entity, hasSequence) {
      var item;

      if (options instanceof Entity) {
        item = options;
      } else {
        item = new Entity(options);
      }

      arr.push(item);

      if (hasSequence) setSequence(arr);
    }

    function calculateTotals(ignoreMargin) {
      this.Totals = calculateDecorationTotals(this);
    }

    function imprintMethodMap(newVal) {
      return mapSelection.apply(this, ['Decoration', newVal]);
    }

    function imprintLocationMap(newVal) {
      return mapSelection.apply(this, ['Location', newVal]);
    }

    function isDefined() {
      return decorationHasValues(this);
    }

    function mapSelected(property) {
      var instance = this;

      if ({}.hasOwnProperty.call(instance, property) && instance[property]) {
        const lookup = getBasicAttributeValue(instance[property]);
        if (!lookup) {
          delete instance.$$selected[property];
        } else {
          instance.$$selected[property] = lookup;
        }
      }
    }

    function mapSelection(property, newVal: AttributeValue) {
      if (typeof newVal !== 'undefined') {
        this.$$selected[property] = newVal;
        this[property] = getProductAttributeForAttributeValue(
          typeMap[property],
          newVal
        );
      }

      return this.$$selected[property];
    }

    function preSave() {
      // Remove any undefined Details.
      this.Details = this.Details.filter(decorationDetailPresent);
    }

    function removeCharge(item) {
      removeItem(this.ServiceCharges, item, true);
      calculateTotals.apply(this);
    }

    function removeItem(arr, item) {
      if (angular.isDefined(item)) {
        if (typeof item === 'number') {
          if (angular.isDefined(arr[item])) {
            arr.splice(item, 1);
          }
        } else {
          arr.splice(arr.indexOf(item), 1);
        }
      }
    }

    function setSequence(arr) {
      angular.forEach(arr, function (v, i) {
        v.Sequence = i;
      });
    }

    function mapAttribute(value) {
      if (value) {
        return new ProductAttribute(value);
      }
    }

    function mapCompany(company) {
      if (company) {
        return new Company(company);
      }
    }

    function setCompanyDecoration(companyDecoration) {
      // SIDE EFFECT - leaving this here to document this
      delete companyDecoration.Decoration.Id;
      const newProps = createDecorationLineItemFromCompanyDecoration(
        companyDecoration
      );
      Object.assign(this, newProps);
      mapSelected.apply(this, ['Decoration']);
    }

    function toCompanyDecoration(companyId) {
      // Left here to document the potential side effects
      this.preSave();

      return createCompanyDecorationFromDecorationLineItem(
        this,
        companyId,
        this.newDecoration
      );
    }

    function saveAsCompanyDecoration(companyId) {
      var decoration = this.toCompanyDecoration(companyId);

      var model = this;

      return decoration.$save().then(function (res) {
        model.newDecoration = new CompanyDecoration();

        return res;
      });
    }
  }
})();
*/

export function getProductAttributeForAttributeValue(
  type: any,
  newVal: AttributeValue
): any {
  if (!newVal) {
    return null;
  }
  return {
    Type: type,
    ValueType: newVal.Code,
    Value: newVal.Name,
    VendorCode: newVal.VendorCode,
    Charges: newVal.Charges,
  };
}

export function getBasicAttributeValue(
  attribute: ProductAttribute
): AttributeValue {
  if (!attribute.Value && attribute.ValueType === 'NONE') {
    return null;
  }
  return {
    Code: attribute.ValueType,
    Name: attribute.Value,
    Options: null,
  };
}

export function createDecoration(
  props: Partial<DecorationLineItem> = {}
): DecorationLineItem {
  // On the view model, isEditable and isLocked would be set by the security policy from the Status
  return {
    Id: null,
    Comments: '',
    Artwork: [],
    ProofType: null,
    ProofEmail: null,
    Status: 'Open',
    Details: [createDecorationDetail()],
    // IsEditable: true,
    // === Props without defaults in old code ===
    CommentsVisible: false,
    Decoration: createImprintMethodProductAttribute(),
    Location: createImprintLocationProductAttribute(),
    LogoColors: [createImprintColorProductAttribute()],
    LogoSize: createImprintSizeProductAttribute(),
    Decorator: null,
    Instructions: '',
    InstructionsVisible: false,
    MediaDescription: '',
    MediaType: '',
    MediaUrl: '',
    Personalization: [],
    RepeatLogo: false,
    ServiceCharges: [],
    ShippingDetail: null,
    ...props,
  };
}

export function createCompanyDecorationFromDecorationLineItem(
  decoration: DecorationLineItem,
  companyId: number,
  newDecorationProps: { Description: string; Name: string }
) {
  var newMediaLinks = decoration.Artwork
    ? decoration.Artwork.map<MediaLink>((mediaLink) => ({
        ...mediaLink,
        Id: null,
      }))
    : [];

  const newDetails = decoration.Details.filter(decorationDetailPresent);

  var companyDecoration = createCompanyDecoration({
    CompanyId: companyId,
    MediaLinks: newMediaLinks,
    Decoration: decoration.Decoration,
    Description: newDecorationProps.Description,
    Details: newDetails,
    Name: newDecorationProps.Name,
  });

  return companyDecoration;
}

export function createDecorationLineItemFromCompanyDecoration(
  companyDecoration: CompanyDecoration
) {
  var companyDetailProperties: (keyof DecorationLineItemDetail)[] = [
    'Instructions',
    'InstructionsVisible',
    'LogoColors',
    'LogoSize',
  ];

  return {
    Decoration: excludeId(companyDecoration.Decoration),
    Details: companyDecoration.Details.map(mapDetail),
    Artwork: companyDecoration.MediaLinks.map(mapMediaLink),
  };

  function mapDetail(detail: DecorationLineItemDetail) {
    return companyDetailProperties.reduce(
      (result, key) => ((result[key] = detail[key]), result),
      {}
    );
  }

  function excludeId<T extends { Id?: any }>(obj: T) {
    const { Id, ...rest } = obj;
    return { ...rest };
  }

  function mapMediaLink(media: MediaLink) {
    return {
      ...excludeId(media),
      IsVisible: true,
    };
  }
}

export function calculateDecorationTotals(decoration: {
  ServiceCharges: ServiceChargeDomainModel[];
}) {
  return {
    Amount: getTotalsPropSum(decoration.ServiceCharges, 'Amount'),
    Cost: getTotalsPropSum(decoration.ServiceCharges, 'Cost'),
    Margin: getTotalsPropSum(decoration.ServiceCharges, 'Margin'),
  };

  function getTotalsPropSum(
    serviceCharges: ServiceChargeDomainModel[],
    key: keyof LineItemTotals
  ) {
    var result = 0;
    serviceCharges.forEach((item) => {
      result += item.Totals[key];
    });
    return result;
  }
}

export function appendServiceCharge(
  serviceCharges: ServiceCharge[],
  props: { CurrencyCode: string } & Partial<ServiceCharge>
) {
  // Note: The old code had logic to copy the Currency Code from the decoration line item of it didn't exist in the props, but
  // the decoration line item does not have a Currency Code, so I opted to force the caller to specify it
  const serviceCharge = createServiceCharge({
    ...props,
    Sequence: serviceCharges.length,
  });
  return ensureArrayIsSequenced([...serviceCharges, serviceCharge]);
}

export function decorationHasValues(decoration: DecorationLineItem) {
  const isValid =
    (decoration.Decoration && decoration.Decoration.Value) ||
    decoration.Artwork.length;

  return isValid || decoration.Details.some(decorationDetailPresent);
}
