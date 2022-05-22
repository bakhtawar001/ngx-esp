import type { StateContext } from '@ngxs/store';
import {
  SyncOperationOptions,
  syncOperationProgress,
} from '../operation-status';
import { ModelWithLoadingStatus } from './loading-status.operators';

export function syncLoadProgress<TStateModel extends ModelWithLoadingStatus>(
  ctx: StateContext<TStateModel>,
  options?: Partial<SyncOperationOptions<TStateModel>>
) {
  return syncOperationProgress<TStateModel>(ctx, 'loading', options);
}
