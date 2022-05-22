import {
  createLoadingSelectorsFor,
  createPropertySelectors,
  createSelectorX,
} from '@cosmos/state';
import { SuppliersState, SuppliersStateModel } from '../states/suppliers.state';

export namespace SupplierQueries {
  export const {
    isLoading,
    hasLoaded,
    getLoadError,
  } = createLoadingSelectorsFor<SuppliersStateModel>(SuppliersState);

  const { items, currentId } = createPropertySelectors<SuppliersStateModel>(
    SuppliersState
  );

  const getCurrentSupplierView = createSelectorX(
    [items, currentId],
    (items, currentId) => (currentId && items?.[currentId]) || null
  );

  export const {
    supplier: getSupplier,
    ratings: getRatings,
  } = createPropertySelectors(getCurrentSupplierView);
}
