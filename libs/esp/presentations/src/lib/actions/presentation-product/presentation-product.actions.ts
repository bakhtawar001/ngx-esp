import { PresentationProduct } from '@esp/models';
import { Price, PriceGrid } from '@smartlink/models';

const ACTION_SCOPE = '[PresentationProduct]';

export namespace PresentationProductActions {
  export class Get {
    static readonly type = `${ACTION_SCOPE} Get product`;
    constructor(public productId: number) {}
  }

  export class Save {
    static readonly type = `${ACTION_SCOPE} Save product`;
    constructor(public product: PresentationProduct) {}
  }

  export class Delete {
    static readonly type = `${ACTION_SCOPE} Delete product`;
    constructor(public product: PresentationProduct) {}
  }

  export class SaveVisibility {
    static readonly type = `${ACTION_SCOPE} Update visibility for product`;
    constructor(public productId: number, public isVisible: boolean) {}
  }

  export class PatchPriceGrid {
    static readonly type = `${ACTION_SCOPE} Patch price grid`;
    constructor(
      public priceGrid: PriceGrid,
      public patchSpec: Partial<PriceGrid>
    ) {}
  }

  export class TogglePriceVisibility {
    static readonly type = `${ACTION_SCOPE} Toggle price visibility`;
    constructor(
      public priceGrid: PriceGrid,
      public price: Price,
      public isVisible: boolean
    ) {}
  }

  export class RemovePrice {
    static readonly type = `${ACTION_SCOPE} Remove price`;
    constructor(public priceGrid: PriceGrid, public price: Price) {}
  }

  export class AddAllPriceGrids {
    static readonly type = `${ACTION_SCOPE} Add all price grids`;
  }

  export class UpdateMarginWhenNetCostOrPriceChanges {
    static readonly type = `${ACTION_SCOPE} Update margin when net cost or price changes`;

    constructor(
      public priceGrid: PriceGrid,
      public price: Price,
      public newNetCost: number,
      public newPrice: number
    ) {}
  }

  export class AddCustomQuantity {
    static readonly type = `${ACTION_SCOPE} Add custom quantity`;
    constructor(public priceGrid: PriceGrid) {}
  }

  export class RestoreToDefault {
    static readonly type = `${ACTION_SCOPE} Restore price grid to default prices`;
    constructor(
      public priceGrid: PriceGrid,
      public originalPriceGrid: PriceGrid
    ) {}
  }
}

export namespace PresentationProductOriginalPriceGridsActions {
  export class Get {
    static readonly type = `${ACTION_SCOPE} Get original price grid`;
    constructor(public productId: number, public priceGridId: number) {}
  }
}
