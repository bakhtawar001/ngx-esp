import {
  ErrorHandler,
  Inject,
  Injectable,
  InjectionToken,
  ModuleWithProviders,
  NgModule,
  NgZone,
} from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import type { Configuration } from 'rollbar';
import { defer, Observable } from 'rxjs';
import { map, pluck, shareReplay } from 'rxjs/operators';
import { CosAnalyticsService } from '../core';
import { UserEvent } from '../core/user-event';
import { LogRocketService } from '../logrocket/logrocket.service';

export const ROLLBAR_SERVICE_CONFIG = new InjectionToken<Configuration>(
  'rollbar'
);

@UntilDestroy()
@Injectable()
export class RollbarService {
  private readonly rollbar$: Observable<import('rollbar')> = defer(
    () =>
      import(
        /* webpackPrefetch: true */
        /* webpackChunkName: 'rollbar' */
        'rollbar'
      ) as unknown as Promise<{ default: typeof import('rollbar') }>
  ).pipe(
    pluck('default'),
    map((Rollbar: typeof import('rollbar')) =>
      new Rollbar(this.config).configure({
        transform: (payload: any) => {
          payload.sessionUrl = this.logRocket.sessionURL;
        },
      })
    ),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  private readonly enabled: boolean;

  constructor(
    private readonly ngZone: NgZone,
    private readonly analytics: CosAnalyticsService,
    private readonly logRocket: LogRocketService,
    @Inject(ROLLBAR_SERVICE_CONFIG) private readonly config: Configuration
  ) {
    this.enabled = config.enabled !== false;

    if (this.enabled) {
      this.initialize();
    }
  }

  handleError(error: any): void {
    error = error.originalError || error;

    if (this.enabled) {
      this.withRollbar((rollbar) => rollbar.error(error));
    } else {
      console.error(error);
    }
  }

  private initialize(): void {
    this.analytics.userEvent$.pipe(untilDestroyed(this)).subscribe({
      next: (event) => event && this._identify(event),
    });
  }

  private withRollbar(callback: (rollbar: import('rollbar')) => void): void {
    // Webpack triggers at least 3 change detection cycles when any library is loaded on demand,
    // when the `script.onload` macrotask is invoked and when promises are resolved.
    this.ngZone.runOutsideAngular(() => {
      this.rollbar$.subscribe(callback);
    });
  }

  private _identify({ userId, traits }: UserEvent) {
    this.withRollbar((rollbar) => {
      rollbar.configure({
        payload: {
          person: {
            id: userId,
            name: traits.displayName,
          },
          client: {
            javascript: {
              // https://docs.rollbar.com/docs/versions#enabling-versions
              code_version: process.env.GIT_SHA,
            },
          },
        },
      });
    });
  }
}

@Injectable()
export class RollbarErrorHandler implements ErrorHandler {
  constructor(private readonly rollbar: RollbarService) {}

  handleError(error: any): void {
    this.rollbar.handleError(error);
  }
}

@NgModule()
export class RollbarModule {
  constructor(rollbar: RollbarService) {}

  static forRoot(config: Configuration): ModuleWithProviders<RollbarModule> {
    return {
      ngModule: RollbarModule,
      providers: [
        RollbarService,
        {
          provide: ROLLBAR_SERVICE_CONFIG,
          useValue: config,
        },
        {
          provide: ErrorHandler,
          useClass: RollbarErrorHandler,
        },
      ],
    };
  }
}
