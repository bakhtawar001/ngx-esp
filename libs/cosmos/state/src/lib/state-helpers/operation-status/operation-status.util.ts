import type { StateContext, StateOperator } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';
import { isObject } from 'lodash-es';
import { Observable } from 'rxjs';
import { OperationStatus } from './operation-status.model';
import {
  setOperationCancelled,
  setOperationError,
  setOperationInProgress,
  setOperationSuccess,
} from './operation-status.operators';
export interface SyncOperationOptions<T> {
  loadCompletesOn: 'FirstEmit' | 'StreamCompleted';
  errorMessage?: string;
  getErrorMessage?(error: Error): string;
}

export function syncOperationProgress<TStateModel>(
  ctx: StateContext<TStateModel>,
  modelPropToSync:
    | keyof TStateModel
    | ((
        statusUpdate: StateOperator<OperationStatus>
      ) => StateOperator<TStateModel>),
  options?: Partial<SyncOperationOptions<TStateModel>>
) {
  const _options: SyncOperationOptions<TStateModel> = {
    loadCompletesOn: 'FirstEmit',
    ...(options || {}),
  };
  function patchStatus(statusUpdate: StateOperator<OperationStatus>) {
    if (typeof modelPropToSync === 'function') {
      return modelPropToSync(statusUpdate);
    }
    return patch({
      [modelPropToSync]: statusUpdate,
    });
  }
  return function <T>(source: Observable<T>): Observable<T> {
    return new Observable((subscriber) => {
      ctx.setState(patchStatus(setOperationInProgress()));
      const subscription = source.subscribe({
        next(value) {
          if (_options.loadCompletesOn === 'FirstEmit') {
            ctx.setState(patchStatus(setOperationSuccess()));
          }
          subscriber.next(value);
        },
        error(error) {
          const errorMessage =
            _options.errorMessage ||
            (_options.getErrorMessage && _options.getErrorMessage(error)) ||
            (error && error.message);
          ctx.setState(
            patchStatus(
              setOperationError({
                message: errorMessage,
                devErrorMessage: isObject(error)
                  ? JSON.stringify(error)
                  : error,
              })
            )
          );
          subscriber.error(error);
        },
        complete() {
          if (_options.loadCompletesOn === 'StreamCompleted') {
            ctx.setState(patchStatus(setOperationSuccess()));
          }
          subscriber.complete();
        },
      });
      return () => {
        ctx.setState(patchStatus(setOperationCancelled()));
        subscription.unsubscribe();
      };
    });
  };
}
