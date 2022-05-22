import { Order, OrderDomainModel } from '@esp/models';
import { calculateOrderTotals } from '../../calculators';
import { mapOrderLineItem } from './order-line-item-mapper';
import { mapLineItemsShippingDestinations } from './order-line-product-item-destinations-mapper';

export function mapOrder(
  order: Order,
  ignoreMargin: boolean
): OrderDomainModel {
  if (!order) {
    return null;
  }
  const lineItems =
    order.LineItems?.map((item) =>
      mapOrderLineItem(item, order, ignoreMargin)
    ) || [];

  const totals = calculateOrderTotals(lineItems, order);

  const shippingDestinations = mapLineItemsShippingDestinations(lineItems);

  return {
    ...order,
    LineItems: lineItems,
    Totals: totals,
    ShippingDestinations: shippingDestinations,
  };
}
