import * as faker from 'faker';
import { OrderStatusKind, OrderStatusType } from '../../models';

let orderStatusId = 0;
export function createOrderStatus(options: Partial<OrderStatusType> = {}) {
  orderStatusId++;
  const sampleOrderStatus: OrderStatusType = {
    Id: orderStatusId,
    Label: `Status ${orderStatusId}`,
    Kind: OrderStatusKind.Open,
    Color: 'blue',
    OwnerId: faker.datatype.number(500),
    TenantId: faker.datatype.number(20),
  };
  return { ...sampleOrderStatus, ...options };
}
