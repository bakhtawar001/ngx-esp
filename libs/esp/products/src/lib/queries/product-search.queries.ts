import {
  createLoadingSelectorsFor,
  createPropertySelectors,
} from '@cosmos/state';
import {
  ProductSearchState,
  ProductSearchStateModel,
} from '../states/product-search.state';
import { createSelector } from '@ngxs/store';
import { filterPillsMapper } from '../utils';

export namespace ProductSearchQueries {
  export const {
    criteria: getCriteria,
    facets: getFacets,
    results: getResults,
    keywordSuggestions: getKeywordSuggestions,
  } = createPropertySelectors<ProductSearchStateModel>(ProductSearchState);

  export const { isLoading, hasLoaded, getLoadError } =
    createLoadingSelectorsFor<ProductSearchStateModel>(ProductSearchState);

  export const facets = createPropertySelectors(getFacets);

  export const { IndexName: getIndex, QueryId: getQueryId } =
    createPropertySelectors(getResults);

  export const getFilterPills = createSelector([getCriteria], (criteria) => {
    return filterPillsMapper(criteria);
  });
}
