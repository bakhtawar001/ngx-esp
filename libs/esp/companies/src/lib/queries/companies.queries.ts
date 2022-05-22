import {
  createLoadingSelectorsFor,
  createPropertySelectors,
  createSelectorX,
} from '@cosmos/state';
import { CompaniesState, CompaniesStateModel } from '../states';

export namespace CompaniesQueries {
  export const { isLoading, hasLoaded, getLoadError } =
    createLoadingSelectorsFor<CompaniesStateModel>(CompaniesState);

  const { items, currentId } =
    createPropertySelectors<CompaniesStateModel>(CompaniesState);

  export const getCompany = createSelectorX(
    [items, currentId],
    (items, currentId) => (currentId && items?.[currentId]) || null
  );

  export const { links: getLinks } =
    createPropertySelectors<CompaniesStateModel>(CompaniesState);
}
