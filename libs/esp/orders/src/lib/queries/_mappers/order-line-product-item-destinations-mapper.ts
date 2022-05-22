import {
  OrderLineItemDomainModel,
  ProductLineItemDomainModel,
  ShippingDestination,
} from '@esp/models';
import { isProductLineItem } from '../../calculators';

export function mapLineItemsShippingDestinations(
  lineItems: OrderLineItemDomainModel[]
): ShippingDestination[] {
  const destinations = new Map<number, ShippingDestination>();
  for (let lineItem of lineItems) {
    if (isProductLineItem(lineItem)) {
      const destination =
        destinations.get(lineItem.ShippingDetail?.Id) ||
        getDefaultDestination(lineItem);
      const productExists =
        destination.Products.findIndex(
          (p) => p.ShippingDetail?.Id === destination.Id
        ) >= 0;
      if (!productExists) {
        destination.Products.push(lineItem);
        destinations.set(destination.Id, { ...destination });
      }
    }
  }

  function getDefaultDestination(
    lineItem: ProductLineItemDomainModel
  ): ShippingDestination {
    return {
      Id: lineItem.ShippingDetail?.Id,
      ShippingDetail: lineItem.ShippingDetail,
      Products: [],
    };
  }

  return Array.from(destinations.values());
}
