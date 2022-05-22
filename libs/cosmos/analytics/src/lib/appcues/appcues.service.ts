import {
  Inject,
  Injectable,
  InjectionToken,
  ModuleWithProviders,
  NgModule,
  NgZone,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ReplaySubject } from 'rxjs';
import { filter, mergeMapTo } from 'rxjs/operators';
import { CosAnalyticsService } from '../core';
import { UserEvent } from '../core/user-event';
import { loadScript } from '../utils';

export interface AppCuesConfig {
  appId: string;
  enabled?: boolean;
  options?: any;
}

export const APPCUES_SERVICE_CONFIG = new InjectionToken<AppCuesConfig>(
  'appcues'
);

const appcues = window.Appcues || [];

declare global {
  interface Window {
    Appcues: any;
  }
}

@UntilDestroy()
@Injectable()
export class AppCuesService {
  private scriptHasBeenLoaded$ = new ReplaySubject<boolean>(1);

  constructor(
    private readonly ngZone: NgZone,
    private readonly router: Router,
    private readonly analytics: CosAnalyticsService,
    @Inject(APPCUES_SERVICE_CONFIG) private readonly config: AppCuesConfig
  ) {
    if (config.enabled) {
      this.initialize();

      this.router.events
        .pipe(
          filter((event) => event instanceof NavigationEnd),
          untilDestroyed(this)
        )
        .subscribe(() => {
          this.ngZone.runOutsideAngular(() => {
            window.Appcues?.page();
          });
        });
    }
  }

  private initialize(): void {
    appcues.load = loadAppCues;

    appcues.load(this.config.appId, this.scriptHasBeenLoaded$);

    this.scriptHasBeenLoaded$
      .pipe(mergeMapTo(this.analytics.userEvent$), untilDestroyed(this))
      .subscribe({
        next: (event) => (event ? this._identify(event) : this._reset()),
      });
  }

  private _identify({ userId, traits }: UserEvent) {
    const {
      GivenName: FirstName,
      FamilyName: LastName,
      Email,
      TenantId,
      AsiNumber,
      CompanyId,
      CompanyName,
      IsAdmin,
      IsDistributor,
      IsSupplier,
      IsCorporate,
      IsInternal,
    } = traits;

    this.ngZone.runOutsideAngular(() => {
      window.Appcues?.identify(userId, {
        Id: userId,
        FirstName,
        LastName,
        Email,
        TenantId,
        AsiNumber,
        CompanyId,
        CompanyName,
        IsAdmin,
        IsDistributor,
        IsSupplier,
        IsCorporate,
        IsInternal,
      });
    });
  }

  private _reset() {
    this.ngZone.runOutsideAngular(() => {
      window.Appcues?.reset();
    });
  }
}

function loadAppCues(
  appId: string,
  scriptHasBeenLoaded$: ReplaySubject<boolean>
) {
  loadScript({
    src: '//fast.appcues.com/' + appId + '.js',
    onLoad: () => {
      scriptHasBeenLoaded$.next(window.Appcues.invoked);
      scriptHasBeenLoaded$.complete();
    },
  });
}

@NgModule()
export class AppCuesModule {
  constructor(appcues: AppCuesService) {}

  static forRoot(config: AppCuesConfig): ModuleWithProviders<AppCuesModule> {
    return {
      ngModule: AppCuesModule,
      providers: [
        AppCuesService,
        {
          provide: APPCUES_SERVICE_CONFIG,
          useValue: config,
        },
      ],
    };
  }
}
