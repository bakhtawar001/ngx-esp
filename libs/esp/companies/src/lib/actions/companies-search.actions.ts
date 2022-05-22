import { CompanySearch, SearchCriteria } from '@esp/models';

const ACTION_SCOPE = '[CompaniesSearch]';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace CompaniesSearchActions {
  export class Delete {
    static readonly type = `${ACTION_SCOPE} Delete`;

    constructor(public company: CompanySearch) {}
  }

  export class Search {
    static type = `${ACTION_SCOPE} Search`;
    constructor(public criteria: SearchCriteria) {}
  }

  export class ToggleStatus {
    static readonly type = `${ACTION_SCOPE} ToggleStatus`;
    constructor(public partyId: number, public isActive: boolean) {}
  }
}
