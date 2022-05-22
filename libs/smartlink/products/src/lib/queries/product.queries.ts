import {
  createLoadingSelectorsFor,
  createPropertySelectors,
  createSelectorX,
} from '@cosmos/state';
import { ProductsState, ProductsStateModel } from '../states/products.state';

export namespace ProductQueries {
  export const {
    isLoading,
    hasLoaded,
    getLoadError,
  } = createLoadingSelectorsFor<ProductsStateModel>(ProductsState);

  const { items, currentId } = createPropertySelectors<ProductsStateModel>(
    ProductsState
  );

  const getCurrentProductView = createSelectorX(
    [items, currentId],
    (items, currentId) => (currentId && items?.[currentId]) || null
  );

  export const {
    product: getProduct,
    inventory: getInventory,
    media: getMedia,
  } = createPropertySelectors(getCurrentProductView);
}
