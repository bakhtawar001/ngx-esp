import { createLoadingSelectorsFor, createSelectorX } from '@cosmos/state';
import { RecentCollectionsState, RecentCollectionsStateModel } from '../states';

export namespace RecentCollectionsQueries {
  export const {
    isLoading,
    hasLoaded,
    getLoadError,
  } = createLoadingSelectorsFor<RecentCollectionsStateModel>(
    RecentCollectionsState
  );

  export const getRecents = createSelectorX(
    [RecentCollectionsState],
    (state: RecentCollectionsStateModel) => state.items
  );
}
