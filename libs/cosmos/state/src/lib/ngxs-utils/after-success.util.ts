import { Injectable, NgModule } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  Actions,
  ofActionSuccessful,
  Store,
  getActionTypeFromInstance,
} from '@ngxs/store';
import { delay, filter, map } from 'rxjs/operators';

type ActionType = string;
type ActionToDispatch =
  | { new (): unknown }
  | { new (...args: unknown[]): unknown };

/**
 * Use it on action declarations. Then which decorated action finishes with success,
 * action passed as the argument will be dispatched.
 * @param actionsToDispatch - actions which should be dispatched after success
 * @constructor - constructor of decorated action
 */

const DEFAULT_DELAY = 2000;

export function AfterSuccess(
  ...actionsToDispatch: ActionToDispatch[]
): // eslint-disable-next-line @typescript-eslint/ban-types
(constructor: Function) => void {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (constructor: Function): void => {
    const actionType = getActionTypeFromInstance(constructor);

    if (ngDevMode && !actionType) {
      throw new Error(`Unable to track class ${constructor.prototype}`);
    }

    AfterSuccessListener.trackAfterSuccess[actionType!] = (
      AfterSuccessListener.trackAfterSuccess[actionType!] || []
    ).concat(actionsToDispatch);
  };
}

@UntilDestroy()
@Injectable({ providedIn: 'root' })
class AfterSuccessListener {
  static readonly trackAfterSuccess: Record<ActionType, ActionToDispatch[]> =
    {};

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store
  ) {
    const allowedActionTypes = Object.keys(
      AfterSuccessListener.trackAfterSuccess
    ).map((actionType: ActionType) => ({ type: actionType }));

    this.actions$
      .pipe(
        ofActionSuccessful(...allowedActionTypes),
        delay(DEFAULT_DELAY),
        map((action) => getActionTypeFromInstance(action)),
        filter(Boolean),
        filter(
          (actionType: ActionType) =>
            !!AfterSuccessListener.trackAfterSuccess[actionType]
        ),
        map(
          (actionType: ActionType) =>
            AfterSuccessListener.trackAfterSuccess[actionType]
        ),
        untilDestroyed(this)
      )
      .subscribe((actions: ActionToDispatch[]) => {
        this.store.dispatch(actions.map((a) => new a()));
      });
  }
}

/**
 * Import this module in directory, where decorated actions are placed.
 */
@NgModule()
export class NgxsAfterSuccessModule {
  constructor(private readonly listener: AfterSuccessListener) {}
}
