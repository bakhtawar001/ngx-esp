export namespace OrderProductActions {
  export class LoadProduct {
    static type = '[Order] Load Product';
    constructor(public readonly productId: number) {}
  }
}
