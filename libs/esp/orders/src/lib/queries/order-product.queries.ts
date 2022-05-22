import { createLoadingSelectorsFor, createSelectorX } from '@cosmos/state';
import { OrderProductState, OrderStateModel } from '../states';

export namespace OrderProductQueries {
  export const { isLoading, hasLoaded, getLoadError } =
    createLoadingSelectorsFor<OrderStateModel>(OrderProductState);

  export const getProduct = createSelectorX(
    [OrderProductState.props.product],
    (product) => {
      return product;
    }
  );
}
