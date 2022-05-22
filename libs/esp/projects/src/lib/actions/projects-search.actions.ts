import { ProjectClosePayload, ProjectSearch, SearchCriteria } from '../models';

const ACTION_SCOPE = '[Search Projects]';

export namespace ProjectSearchActions {
  export class Search {
    static readonly type = `${ACTION_SCOPE} Search`;

    constructor(public readonly criteria: SearchCriteria) {}
  }

  export class TransferOwner {
    static readonly type = `${ACTION_SCOPE} Transfer owner`;

    constructor(
      public readonly payload: ProjectSearch,
      public readonly ownerId: number
    ) {}
  }

  export class CloseProject {
    static readonly type = `${ACTION_SCOPE} CloseProject`;

    constructor(public readonly payload: ProjectClosePayload) {}
  }

  export class ReopenProject {
    static readonly type = `${ACTION_SCOPE} ReopenProject`;

    constructor(public readonly project: ProjectSearch) {}
  }
}
