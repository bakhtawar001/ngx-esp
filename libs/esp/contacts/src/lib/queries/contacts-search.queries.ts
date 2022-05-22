import {
  createLoadingSelectorsFor,
  createPropertySelectors,
  createSelectorX,
} from '@cosmos/state';
import { ContactsSearchState, ContactsSearchStateModel } from '../states';

export namespace ContactsSearchQueries {
  export const { isLoading, hasLoaded, getLoadError } =
    createLoadingSelectorsFor<ContactsSearchStateModel>(ContactsSearchState);

  export const { criteria: getCriteria, result: getResult } =
    createPropertySelectors<ContactsSearchStateModel>(ContactsSearchState);

  export const getHits = createSelectorX(
    [ContactsSearchState],
    (state: ContactsSearchStateModel) => state.result?.Results
  );

  export const getTotal = createSelectorX(
    [ContactsSearchState],
    (state: ContactsSearchStateModel) => state.result?.ResultsTotal ?? 0
  );
}
