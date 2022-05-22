import { KeywordPrefix } from '@smartlink/models';

import { ProductSearchCriteria, TypeAheadSearchCriteria } from '../types';

const ACTION_SCOPE = '[Product Search]';

export namespace ProductSearchActions {
  export class Search {
    static readonly type = `${ACTION_SCOPE} Search`;

    constructor(public criteria?: ProductSearchCriteria) {}
  }

  export class FacetSearch {
    static readonly type = `${ACTION_SCOPE} Facet Search`;

    constructor(public criteria: TypeAheadSearchCriteria) {}
  }

  export class LoadKeywordSuggestions {
    static type = `${ACTION_SCOPE} LoadKeywordSuggestions`;
    constructor(public params: KeywordPrefix) {}
  }

  export class ResetLoading {
    static readonly type = `${ACTION_SCOPE} Reset Loading`;
  }
}
