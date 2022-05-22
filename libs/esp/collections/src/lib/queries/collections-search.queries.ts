import {
  createLoadingSelectorsFor,
  createPropertySelectors,
} from '@cosmos/state';
import { CollectionSearchStateModel, CollectionsSearchState } from '../states';

export namespace CollectionsSearchQueries {
  export const { isLoading, hasLoaded, getLoadError } =
    createLoadingSelectorsFor<CollectionSearchStateModel>(
      CollectionsSearchState
    );

  export const {
    criteria: getCriteria,
    items: getCollections,
    total: getTotal,
  } = createPropertySelectors<CollectionSearchStateModel>(
    CollectionsSearchState
  );
}
