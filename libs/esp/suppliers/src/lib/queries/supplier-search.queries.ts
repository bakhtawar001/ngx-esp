import {
  createLoadingSelectorsFor,
  createPropertySelectors,
} from '@cosmos/state';
import {
  SupplierSearchState,
  SupplierSearchStateModel,
} from '../states/supplier-search.state';

export namespace SupplierSearchQueries {
  export const { isLoading, hasLoaded, getLoadError } =
    createLoadingSelectorsFor<SupplierSearchStateModel>(SupplierSearchState);

  export const {
    criteria: getCriteria,
    results: getResults,
    keywordSuggestions: getKeywordSuggestions,
  } = createPropertySelectors<SupplierSearchStateModel>(SupplierSearchState);

  export const { IndexName: getIndex, QueryId: getQueryId } =
    createPropertySelectors(getResults);
}
