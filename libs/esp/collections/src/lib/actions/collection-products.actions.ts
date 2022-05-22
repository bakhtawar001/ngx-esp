import { SearchCriteria } from '@esp/models';

const ACTION_SCOPE = '[Collection Products]';

export namespace CollectionProductsActions {
  export class Remove {
    static readonly type = `${ACTION_SCOPE} Remove products`;

    constructor(public id: number, public productIds: number[]) {}
  }

  export class RemoveSuccess {
    static readonly type = `${ACTION_SCOPE} Removed products`;

    constructor(public id: number, public productIds: number[]) {}
  }

  export class Search {
    static readonly type = `${ACTION_SCOPE} Search products`;

    constructor(public id: number, public criteria?: SearchCriteria) {}
  }
}
