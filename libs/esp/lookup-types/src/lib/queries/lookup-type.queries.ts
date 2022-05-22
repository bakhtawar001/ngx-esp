import {
  createLoadingSelectorsFor,
  createPropertySelectors,
} from '@cosmos/state';
import { LookupTypesState, LookupTypesStateModel } from '../states';

export namespace LookupTypeQueries {
  export const {
    isLoading,
    hasLoaded,
    getLoadError,
  } = createLoadingSelectorsFor<LookupTypesStateModel>(LookupTypesState);

  export const lookups = createPropertySelectors(
    LookupTypesState.getAllLookups
  );
}
