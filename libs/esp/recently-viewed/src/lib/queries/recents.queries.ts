import { createSelectorX } from '@cosmos/state';
import { RecentlyViewedState } from '../states';

export namespace RecentsQueries {
  const recentsStateSelector = RecentlyViewedState.getRecentlyViewed;

  export const getAllRecentlyViewed = recentsStateSelector;

  export const getCompanies = createSelectorX(
    [recentsStateSelector],
    (state) => state.companies
  );

  export const getOrders = createSelectorX(
    [recentsStateSelector],
    (state) => state.orders
  );

  export const getProducts = createSelectorX(
    [recentsStateSelector],
    (state) => state.products
  );

  export const getSuppliers = createSelectorX(
    [recentsStateSelector],
    (state) => state.suppliers
  );

  export const getTasks = createSelectorX(
    [recentsStateSelector],
    (state) => state.tasks
  );
}
