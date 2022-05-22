import { Order } from './order.model';

export declare enum OrderRelationshipDirection {
  Parent = 0,
  Child = 1,
}

export declare interface OrderRelationship {
  Type: string;
  Direction: OrderRelationshipDirection;
  Order: Order;
}
