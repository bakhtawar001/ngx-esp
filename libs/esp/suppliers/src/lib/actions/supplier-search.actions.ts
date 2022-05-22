import { SupplierSearchCriteria } from '@esp/suppliers';
import { KeywordPrefix } from '@smartlink/models';

const ACTION_SCOPE = '[Supplier Search]';

export namespace SupplierSearchActions {
  export class Search {
    static readonly type = `${ACTION_SCOPE} Search`;

    constructor(public criteria?: SupplierSearchCriteria) {}
  }

  export class LoadKeywordSuggestions {
    static type = `${ACTION_SCOPE} LoadKeywordSuggestions`;
    constructor(public params: KeywordPrefix) {}
  }

  export class ResetLoading {
    static readonly type = `${ACTION_SCOPE} Reset Loading`;
  }
}
