const ACTION_SCOPE = '[Smartlink Product]';

export namespace ProductActions {
  export class SelectProduct {
    static readonly type = `${ACTION_SCOPE} Select Product`;

    constructor(public productId: number) {}
  }
}
