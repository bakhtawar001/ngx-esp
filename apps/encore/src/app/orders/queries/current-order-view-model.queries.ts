import { createSelectorX, ErrorResult } from '@cosmos/state';
import { Order, OrderSearch } from '@esp/models';
import { CurrentOrderQueries, OrdersSearchQueries } from '@esp/orders';

export namespace CurrentOrderViewModelQueries {
  export const {
    isLoading,
    getLoadError,
    getCurrentOrder,
    getCurrentOrderDomainModel,
  } = CurrentOrderQueries;

  export const isFirstTimeLoading = createSelectorX(
    [getCurrentOrder, isLoading],
    (currentOrder: Order, isLoading: boolean) => {
      return !currentOrder && isLoading;
    }
  );

  export const isReloading = createSelectorX(
    [getCurrentOrder, isLoading],
    (currentOrder: Order, isLoading: boolean) => {
      return currentOrder && isLoading;
    }
  );

  export const isLocked = createSelectorX(
    [getCurrentOrderDomainModel],
    (currentOrder: Order) => {
      // TODO: update when we have requirenments
      return !currentOrder?.IsEditable;
    }
  );

  export const loadErrorMessage = createSelectorX(
    [getCurrentOrder, isLoading, getLoadError],
    (currentOrder: Order, isLoading: boolean, loadError: ErrorResult) => {
      let errorMessage = loadError?.message;
      if (!errorMessage && !isLoading && !currentOrder) {
        errorMessage = 'Order not found.';
      }
      return errorMessage || null;
    }
  );

  export const { getHits: orders } = OrdersSearchQueries;

  // Current order should be first in the list
  export const sortedOrders = createSelectorX(
    [OrdersSearchQueries.getHits, CurrentOrderViewModelQueries.getCurrentOrder],
    (searchOrders, currentOrder) => {
      if (!searchOrders || !currentOrder) {
        return [];
      }

      return searchOrders.reduce((acc: OrderSearch[], curr: OrderSearch) => {
        if (currentOrder.Id === curr.Id) {
          acc.unshift(curr);
        } else {
          acc.push(curr);
        }

        return acc;
      }, []);
    }
  );
}
