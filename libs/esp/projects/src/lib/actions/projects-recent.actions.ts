import { SearchCriteria } from '@esp/models';

const ACTION_SCOPE = '[Recent Projects]';

export namespace ProjectsRecentActions {
  export class Load {
    static readonly type = `${ACTION_SCOPE} Load`;
  }

  export class Search {
    static readonly type = `${ACTION_SCOPE} Search`;

    constructor(public criteria: SearchCriteria) {}
  }
}
