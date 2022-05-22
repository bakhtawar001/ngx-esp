import {
  Presentation,
  PresentationProductSortOrder,
  PresentationStatus,
  ProductSequence,
} from '@esp/models';

const ACTION_SCOPE = '[Presentations]';

export namespace PresentationsActions {
  export class Create {
    static readonly type = `${ACTION_SCOPE} Create presentation`;
    constructor(public projectId: number, public productIds: number[] = []) {}
  }

  export class Get {
    static readonly type = `${ACTION_SCOPE} Get presentation`;
    constructor(public presentationId: number) {}
  }

  // Temporary
  export class UpdatePresentationStatus {
    static readonly type = `${ACTION_SCOPE} Update presenation Status`;
    constructor(public status: PresentationStatus) {}
  }

  export class Update {
    static readonly type = `${ACTION_SCOPE} Update presentation`;
    constructor(public presentation: Presentation) {}
  }

  // https://asiservice.uat-asicentral.com/venus/swagger/index.html
  // Presentations -> `PUT /api/presentations/${id}/products`
  export class AddProducts {
    static readonly type = `${ACTION_SCOPE} Add products to an existing presentation`;
    constructor(
      public presentationId: number,
      public projectName: string,
      public productIds: number[]
    ) {}
  }

  export class RemoveProduct {
    static readonly type = `${ACTION_SCOPE} Remove product from an existing presentation`;
    constructor(public presentationId: number, public productId: number) {}
  }

  export class SequenceProducts {
    static readonly type = `${ACTION_SCOPE} Sequence products in a presentation`;
    constructor(
      public presentationId: number,
      public sequence: ProductSequence[]
    ) {}
  }
  export class SortProducts {
    static readonly type = `${ACTION_SCOPE} Sort products in a presentation`;
    constructor(
      public presentationId: number,
      public sortOrder: PresentationProductSortOrder
    ) {}
  }

  export class UpdatePresentationProductVisibility {
    static readonly type = `${ACTION_SCOPE} Update presentation product visibility`;
    constructor(public productId: number, public isVisible: boolean) {}
  }
}
