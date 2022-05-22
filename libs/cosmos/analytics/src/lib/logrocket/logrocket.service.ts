import { Inject, Injectable, InjectionToken, NgZone } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { getActionTypeFromInstance, Store } from '@ngxs/store';
import * as LogRocket from 'logrocket';
import { CosAnalyticsService } from '../core';
import { UserEvent } from '../core/user-event';

export interface LogRocketConfig {
  appId: string;
  enabled?: boolean;
  options?: any;
}

export const LOGROCKET_SERVICE_CONFIG = new InjectionToken<LogRocketConfig>(
  'logrocket'
);

export const enum ActionStatus {
  Dispatched = 'DISPATCHED',
  Successful = 'SUCCESSFUL',
  Canceled = 'CANCELED',
  Errored = 'ERRORED',
}

@UntilDestroy()
@Injectable()
export class LogRocketService {
  // Don't call `reduxMiddleware` w/o named `LogRocket` import, since it'll lose `this`.
  private logRocketStore = LogRocket.reduxMiddleware()({
    getState: () => this.store.snapshot(),
  });

  constructor(
    private readonly ngZone: NgZone,
    private readonly store: Store,
    private readonly analytics: CosAnalyticsService,
    @Inject(LOGROCKET_SERVICE_CONFIG) private readonly config: LogRocketConfig
  ) {
    if (config.enabled) {
      this.initialize();
    }
  }

  logReduxEvent(newState: any, action: any, status: ActionStatus): void {
    newState = newState || this.store.snapshot();
    const newAction = {
      type: `${getActionTypeFromInstance(action)} (${status})`,
      payload: action.payload || { ...action },
    };
    // The `logRocketStore` function is doing asynchronous job internally (e.g. sending events),
    // thus we don't wanna trigger change detection.
    this.ngZone.runOutsideAngular(() => {
      try {
        this.logRocketStore(() => newState)(newAction);
      } catch {
        // We prolly don't need to handle `logRocketStore` errors if any occurs.
      }
    });
  }

  get sessionURL(): string | null {
    return LogRocket.sessionURL;
  }

  private initialize(): void {
    this.ngZone.runOutsideAngular(() => {
      LogRocket.init(this.config.appId, this.config.options);
    });

    this.analytics.userEvent$.pipe(untilDestroyed(this)).subscribe({
      next: (event) => event && this._identify(event),
    });
  }

  private _identify({ userId, traits }: UserEvent) {
    this.ngZone.runOutsideAngular(() => {
      LogRocket.identify(userId, {
        name: traits.displayName,
      });
    });
  }
}
