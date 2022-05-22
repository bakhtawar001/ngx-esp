import {
  createLoadingSelectorsFor,
  createPropertySelectors,
} from '@cosmos/state';
import { ProjectsSearchState, ProjectSearchStateModel } from '../states';
import { createSelector } from '@ngxs/store';
import { uniq, uniqBy } from 'lodash-es';
import { filterPillsMapper } from '../utils';

export namespace ProjectsSearchQueries {
  export const { isLoading, hasLoaded, getLoadError } =
    createLoadingSelectorsFor<ProjectSearchStateModel>(ProjectsSearchState);

  export const {
    projects: getProjects,
    total: getTotal,
    criteria: getCriteria,
    facets: getFacets,
  } = createPropertySelectors<ProjectSearchStateModel>(ProjectsSearchState);

  const filters = createSelector([getCriteria], (criteria) => criteria.filters);

  export const getStepNameFacets = createSelector(
    [getFacets, filters],
    (facets, filters) => {
      const checkedValues = filters?.StepName ?? { terms: [] };
      const facetsFromAlgolia = facets?.StepName ?? [];
      const checkedFacets = facetsFromAlgolia.filter((stepName) =>
        (checkedValues?.terms as string[]).includes(stepName)
      );

      return uniq([...checkedFacets, ...facetsFromAlgolia]);
    }
  );

  export const getOwnerFacets = createSelector(
    [getFacets, filters],
    (facets, filters) => {
      const checkedValues = filters?.Owners ?? { terms: [] };
      const facetsFromAlgolia = facets?.Owners ?? [];
      const checkedFacets = facetsFromAlgolia.filter((owner) =>
        (checkedValues?.terms as string[]).includes(owner?.Id)
      );

      return uniqBy([...checkedFacets, ...facetsFromAlgolia], 'Id');
    }
  );

  export const getFilterPills = createSelector(
    [filters, getFacets],
    (filters, facets) => {
      return filterPillsMapper(filters, facets);
    }
  );
}
