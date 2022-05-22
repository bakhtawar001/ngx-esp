import { createLoadingSelectorsFor, createSelectorX } from '@cosmos/state';
import { ProjectsRecentState, ProjectsRecentStateModel } from '../states';

export namespace ProjectsRecentQueries {
  export const { isLoading, hasLoaded, getLoadError } =
    createLoadingSelectorsFor<ProjectsRecentStateModel>(ProjectsRecentState);

  export const getRecents = createSelectorX(
    [ProjectsRecentState],
    (state: ProjectsRecentStateModel) => state?.result?.Results || []
  );

  export const getCriteria = createSelectorX(
    [ProjectsRecentState],
    (state: ProjectsRecentStateModel) => state.criteria
  );
}
