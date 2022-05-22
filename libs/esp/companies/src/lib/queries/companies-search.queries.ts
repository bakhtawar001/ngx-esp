import {
  createLoadingSelectorsFor,
  createPropertySelectors,
  createSelectorX,
} from '@cosmos/state';
import { createSelector } from '@ngxs/store';
import { Aggregations, CompanySearchFilters } from '../models';
import { CompaniesSearchState, CompaniesSearchStateModel } from '../states';
import { mapFilterPills } from '../utils';

export namespace CompaniesSearchQueries {
  export const { isLoading, hasLoaded, getLoadError } =
    createLoadingSelectorsFor<CompaniesSearchStateModel>(CompaniesSearchState);

  export const {
    criteria: getCriteria,
    facets: getFacets,
    result: getResult,
  } = createPropertySelectors<CompaniesSearchStateModel>(CompaniesSearchState);

  export const getHits = createSelectorX(
    [CompaniesSearchState],
    (state: CompaniesSearchStateModel) => state.result?.Results ?? []
  );

  export const getTotal = createSelectorX(
    [CompaniesSearchState],
    (state: CompaniesSearchStateModel) => state.result?.ResultsTotal ?? 0
  );

  const filters = createSelector([getCriteria], (criteria) => criteria.filters);

  export const getOwnerFacets = createSelector(
    [filters, getFacets],
    (filters: CompanySearchFilters, facets: Aggregations) => {
      const terms = filters?.Owners?.terms ?? [];
      const uncheckedOwners = [];

      return facets?.Owners?.filter((owner) =>
        (terms as number[]).includes(owner.Id)
          ? true
          : uncheckedOwners.push(owner) && false
      ).concat(uncheckedOwners);
    }
  );

  export const getFilterPills = createSelector(
    [filters, getFacets],
    (filters, facets) => {
      return mapFilterPills(filters, facets);
    }
  );
}
