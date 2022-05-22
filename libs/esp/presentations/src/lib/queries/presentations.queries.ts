import {
  createLoadingSelectorsFor,
  createPropertySelectors,
  createSelectorX,
} from '@cosmos/state';
import { PresentationsState, PresentationsStateModel } from '../states';

export namespace PresentationsQueries {
  export const { isLoading, hasLoaded, getLoadError } =
    createLoadingSelectorsFor<PresentationsStateModel>(PresentationsState);

  export const { presentation: getPresentation } =
    createPropertySelectors<PresentationsStateModel>(PresentationsState);

  export const getVisibleProducts = createSelectorX(
    [getPresentation],
    (presentation) =>
      presentation?.Products.filter((product) => product.IsVisible)
  );

  export const getHiddenProducts = createSelectorX(
    [getPresentation],
    (presentation) =>
      presentation?.Products.filter((product) => !product.IsVisible)
  );
}
