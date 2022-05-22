import {
  createLoadingSelectorsFor,
  createPropertySelectors,
  createSelectorX,
} from '@cosmos/state';
import {
  CollectionsState,
  CollectionsStateModel,
} from '../states/collections.state';

export namespace CollectionsQueries {
  export const { isLoading, hasLoaded, getLoadError } =
    createLoadingSelectorsFor<CollectionsStateModel>(CollectionsState);

  const { items, currentId } =
    createPropertySelectors<CollectionsStateModel>(CollectionsState);

  export const getCollection = createSelectorX(
    [items, currentId],
    (items, currentId) => (currentId && items?.[currentId]) || null
  );

  export const { criteria: getCriteria, total: getTotal } =
    createPropertySelectors<CollectionsStateModel>(CollectionsState);

  export const canEdit = createSelectorX(
    [getCollection],
    (collection) =>
      collection && collection.Status !== 'Archived' && collection.IsEditable
  );
}
