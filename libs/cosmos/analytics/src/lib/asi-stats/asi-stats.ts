import { HttpBackend, HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
  InjectionToken,
  ModuleWithProviders,
  NgModule,
  NgZone,
} from '@angular/core';
import { ServiceConfig } from '@cosmos/common';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { lastValueFrom } from 'rxjs';
import { CosAnalyticsService, TrackEvent, TrackEventData } from '../core';

export const ASI_STATS_SERVICE_CONFIG = new InjectionToken<ServiceConfig>(
  'Segment url for manual track calls'
);

@UntilDestroy()
@Injectable()
export class AsiStatsService {
  private http!: HttpClient;
  constructor(
    private readonly ngZone: NgZone,
    private readonly analytics: CosAnalyticsService,
    @Inject(ASI_STATS_SERVICE_CONFIG) private readonly config: ServiceConfig,
    handler: HttpBackend
  ) {
    this.http = new HttpClient(handler);

    this.setupTrackEventsListener();
  }

  private setupTrackEventsListener(): void {
    this.analytics.hoverEvent$.pipe(untilDestroyed(this)).subscribe({
      next: (event) => this._track(event),
    });
  }

  private _track(event: TrackEvent<TrackEventData>): void {
    this.ngZone.runOutsideAngular(() => {
      try {
        const user = this.analytics.userEvent$.value;

        const { action, properties } = event;

        lastValueFrom(
          this.http.post(this.config.Url, {
            event: action,
            properties,
            userId: user?.userId,
            originalTimestamp: new Date().toISOString(),
            type: 'track',
          })
        );
      } catch {
        // We shouldn't re-throw an error since it'll break the subscription.
      }
    });
  }
}

@NgModule()
export class AsiStatsModule {
  constructor(service: AsiStatsService) {}

  static forRoot(config: ServiceConfig): ModuleWithProviders<AsiStatsModule> {
    return {
      ngModule: AsiStatsModule,
      providers: [
        AsiStatsService,
        {
          provide: ASI_STATS_SERVICE_CONFIG,
          useValue: config,
        },
      ],
    };
  }
}
