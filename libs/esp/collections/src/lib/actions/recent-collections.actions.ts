import { SearchCriteria } from '@esp/models';

const ACTION_SCOPE = '[Recent Collections]';

export namespace RecentCollectionsActions {
  export class Get {
    static readonly type = `${ACTION_SCOPE} Get`;
  }

  export class Search {
    static readonly type = `${ACTION_SCOPE} Search`;

    constructor(public criteria: SearchCriteria) {}
  }
}
