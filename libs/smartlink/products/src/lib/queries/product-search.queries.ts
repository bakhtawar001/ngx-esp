import {
  createLoadingSelectorsFor,
  createPropertySelectors,
} from '@cosmos/state';
import { ProductSearchState, ProductSearchStateModel } from '../states';

export namespace ProductSearchQueries {
  export const {
    isLoading,
    hasLoaded,
    getLoadError,
  } = createLoadingSelectorsFor<ProductSearchStateModel>(ProductSearchState);

  export const {
    keywordSuggestions: getKeywordSuggestions,
  } = createPropertySelectors<ProductSearchStateModel>(ProductSearchState);
}
