import { LineItem } from '@esp/models';

export namespace OrderLineItemActions {
  export class LoadOrderLineItem {
    static type = '[OrderLineItem] Load OrderLineItem';
    constructor(
      public readonly orderId: number,
      public readonly lineItemId: number
    ) {}
  }

  export class UpdateOrderLineItem {
    static type = '[OrderLineItem] Update OrderLineItem';
    constructor(
      public readonly orderId: number,
      public readonly orderLineItem: LineItem,
      public readonly updateTaxes = 'none'
    ) {}
  }
}
