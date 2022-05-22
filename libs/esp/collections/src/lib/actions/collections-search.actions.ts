import { SearchCriteria } from '../models';

const ACTION_SCOPE = '[Search Collections]';

export namespace CollectionSearchActions {
  export class Search {
    static readonly type = `${ACTION_SCOPE} Search`;

    constructor(public criteria: SearchCriteria) {}
  }

  export class RemoveItem {
    static readonly type = `${ACTION_SCOPE} Remove Item`;

    constructor(public id: number) {}
  }

  export class Reset {
    static readonly type = `${ACTION_SCOPE} Reset`;
  }
}
