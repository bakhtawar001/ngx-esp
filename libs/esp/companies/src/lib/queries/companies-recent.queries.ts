import {
  createLoadingSelectorsFor,
  createPropertySelectors,
  createSelectorX,
} from '@cosmos/state';
import { CompaniesRecentState, CompaniesRecentStateModel } from '../states';

export namespace CompaniesRecentQueries {
  export const { isLoading, hasLoaded, getLoadError } =
    createLoadingSelectorsFor<CompaniesRecentStateModel>(CompaniesRecentState);

  export const getRecents = createSelectorX(
    [CompaniesRecentState],
    (state: CompaniesRecentStateModel) => state?.result?.Results || []
  );

  export const { criteria: getCriteria } =
    createPropertySelectors<CompaniesRecentStateModel>(CompaniesRecentState);

  export const getTotal = createSelectorX(
    [CompaniesRecentState],
    (state: CompaniesRecentStateModel) => state?.result?.ResultsTotal ?? 0
  );
}
