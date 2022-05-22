import {
  createLoadingSelectorsFor,
  createPropertySelectors,
  createSelectorX,
} from '@cosmos/state';
import { ProjectsState, ProjectsStateModel } from '../states';

export namespace ProjectQueries {
  export const { isLoading, hasLoaded, getLoadError } =
    createLoadingSelectorsFor<ProjectsStateModel>(ProjectsState);

  const { items, currentId } =
    createPropertySelectors<ProjectsStateModel>(ProjectsState);

  export const getProject = createSelectorX(
    [items, currentId],
    (items, currentId) => (currentId && items?.[currentId]) || null
  );

  export const canEdit = createSelectorX(
    [getProject],
    (project) =>
      project && project.StatusName !== 'Closed' && project.IsEditable
  );
}
