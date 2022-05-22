const ACTION_SCOPE = '[Smartlink Supplier]';

export namespace SupplierActions {
  export class SelectSupplier {
    static readonly type = `${ACTION_SCOPE} Select Supplier`;

    constructor(public supplierId: number) {}
  }
}
