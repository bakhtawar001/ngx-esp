import { Injectable, Injector } from '@angular/core';
import { NgxsPlugin, NgxsNextPluginFn } from '@ngxs/store';
import { tap } from 'rxjs/operators';

import { LogRocketService, ActionStatus } from '../logrocket.service';

@Injectable()
export class LogRocketReduxMiddlewarePlugin implements NgxsPlugin {
  private logRocket: LogRocketService | null = null;

  constructor(private readonly injector: Injector) {}

  handle(state: any, action: any, next: NgxsNextPluginFn) {
    // Retrieve lazily to avoid cyclic dependency injection error.
    const logRocket =
      this.logRocket || (this.logRocket = this.injector.get(LogRocketService));

    // The `next(...)` observable will do following things:
    // * will emit `next` and then complete when the action is completed
    // * will emit `error` (not `next` or `complete`) when one of the @Action handlers errors
    // * will emit only `complete` (and not `next`) when the action is cancelled by another action of the same type
    const result = next(state, action);

    // Synchronous actions have been handled after the `next()` has been called.
    this.logRocket.logReduxEvent(null, action, ActionStatus.Dispatched);

    let hasBeenCancelled = true;

    return result.pipe(
      tap({
        next: (newState) => {
          hasBeenCancelled = false;
          logRocket.logReduxEvent(newState, action, ActionStatus.Successful);
        },
        error: () => {
          logRocket.logReduxEvent(null, action, ActionStatus.Errored);
        },
        complete: () => {
          if (hasBeenCancelled) {
            logRocket.logReduxEvent(null, action, ActionStatus.Canceled);
          }
        },
      })
    );
  }
}
