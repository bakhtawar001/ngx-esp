import {
  createLoadingSelectorsFor,
  createPropertySelectors,
} from '@cosmos/state';
import {
  CollectionProductsState,
  CollectionProductsStateModel,
} from '../states/collection-products.state';

export namespace CollectionProductsQueries {
  export const { isLoading, hasLoaded, getLoadError } =
    createLoadingSelectorsFor<CollectionProductsStateModel>(
      CollectionProductsState
    );

  export const {
    products: getProducts,
    total: getTotal,
    criteria: getCriteria,
  } = createPropertySelectors<CollectionProductsStateModel>(
    CollectionProductsState
  );
}
