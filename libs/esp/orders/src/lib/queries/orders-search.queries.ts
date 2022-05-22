import {
  createLoadingSelectorsFor,
  createPropertySelectors,
  createSelectorX,
} from '@cosmos/state';
import { OrdersSearchState, OrdersSearchStateModel } from '../states';

export namespace OrdersSearchQueries {
  export const { isLoading, hasLoaded, getLoadError } =
    createLoadingSelectorsFor<OrdersSearchStateModel>(OrdersSearchState);

  export const {
    criteria: getCriteria,
    result: getResult,
    creatingOrder,
  } = createPropertySelectors<OrdersSearchStateModel>(OrdersSearchState);

  export const getHits = createSelectorX(
    [OrdersSearchState],
    (state: OrdersSearchStateModel) => state.result?.Results
  );

  export const getTotal = createSelectorX(
    [OrdersSearchState],
    (state: OrdersSearchStateModel) => state.result?.ResultsTotal ?? 0
  );
}
