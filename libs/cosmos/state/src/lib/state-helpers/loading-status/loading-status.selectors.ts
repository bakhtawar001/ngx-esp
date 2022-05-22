import { createSelectorX, SelectorDef } from '../../ngxs-utils';
import { createOperationSelectorsFor } from '../operation-status';
import { ModelWithLoadingStatus } from './loading-status.operators';

export function createLoadingSelectorsFor<T extends ModelWithLoadingStatus>(
  stateType: SelectorDef<T>
) {
  const loadingProp = createSelectorX(
    [stateType] as [SelectorDef<any>],
    (state: ModelWithLoadingStatus) => state.loading
  );
  const loadingSelectors = createOperationSelectorsFor(loadingProp);
  return {
    isLoading: loadingSelectors.isInProgress,
    hasLoaded: loadingSelectors.hasSucceeded,
    getLoadError: loadingSelectors.getError,
  };
}
