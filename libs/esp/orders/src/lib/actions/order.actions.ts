export namespace OrderActions {
  export class LoadOrder {
    static type = '[Order] Load Order';
    constructor(public readonly orderId: number) {}
  }
}
