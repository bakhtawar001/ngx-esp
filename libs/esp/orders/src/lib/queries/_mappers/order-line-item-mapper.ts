import { LineItem, Order, OrderLineItemDomainModel } from '@esp/models';
import { isProductLineItem, isServiceLineItem } from '../../calculators';
import { mapProductLineItem } from './order-line-product-item-mapper';
import { mapServiceLineItem } from './order-line-service-item-mapper';

export function mapOrderLineItem(
  orderLineItem: LineItem,
  order: Order,
  ignoreMargin: boolean
): OrderLineItemDomainModel {
  if (isProductLineItem(orderLineItem)) {
    return mapProductLineItem(orderLineItem, order, ignoreMargin);
  } else if (isServiceLineItem(orderLineItem)) {
    return mapServiceLineItem(orderLineItem, order);
  }
  return {
    ...orderLineItem,
  };
}
