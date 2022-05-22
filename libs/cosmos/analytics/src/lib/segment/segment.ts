import { Injectable, NgZone } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ReplaySubject } from 'rxjs';
import { filter, mergeMapTo } from 'rxjs/operators';
import { CosAnalyticsService, TrackEvent, TrackEventData } from '../core';
import { loadScript } from '../utils';
import type { SegmentConfig } from './types';

declare global {
  interface Window {
    analytics: any; // SegmentAnalytics.AnalyticsJS;
  }
}

@UntilDestroy()
@Injectable({ providedIn: 'root' })
export class SegmentService {
  private segmentHasBeenLoaded$ = new ReplaySubject<boolean>(1);

  constructor(
    private readonly ngZone: NgZone,
    private readonly analytics: CosAnalyticsService
  ) {}

  start(config: SegmentConfig): void {
    if (ngDevMode && !config.apiKey) {
      throw new Error('Segment is enabled, but `apiKey` is not provided.');
    }

    this.setupIdentifyListener();
    this.setupTrackEventsListener();
    this.setupRouterEventsListener();
    loadSegment(config.apiKey!, this.segmentHasBeenLoaded$);
  }

  private setupIdentifyListener(): void {
    this.segmentHasBeenLoaded$
      .pipe(mergeMapTo(this.analytics.userEvent$), untilDestroyed(this))
      .subscribe((event) => {
        if (event) {
          const { userId, traits } = event;

          this.ngZone.runOutsideAngular(() => {
            window.analytics.identify(userId, {
              firstName: traits.GivenName,
              lastName: traits.FamilyName,
              username: traits.UserName,
              email: traits.Email,
              company: { id: traits.CompanyId, name: traits.CompanyName },
            });
          });
        } else {
          this.ngZone.runOutsideAngular(() => {
            window.analytics.reset();
          });
        }
      });
  }

  private setupRouterEventsListener(): void {
    this.segmentHasBeenLoaded$
      .pipe(
        mergeMapTo(this.analytics.snapshot$),
        filter(Boolean),
        untilDestroyed(this)
      )
      .subscribe({
        next: (snapshot) => this._page(snapshot),
      });
  }

  private setupTrackEventsListener(): void {
    this.segmentHasBeenLoaded$
      .pipe(mergeMapTo(this.analytics.trackEvent$), untilDestroyed(this))
      .subscribe({
        next: (event) => this._track(event),
      });
  }

  private _page(snapshot: ActivatedRouteSnapshot): void {
    this.ngZone.runOutsideAngular(() => {
      const user = this.analytics.userEvent$.value?.traits;
      try {
        window.analytics.page(snapshot.data?.analytics?.page, {
          appCode: user?.TenantCode,
          appId: user?.TenantId,
          referrer: this.analytics.previousReferrerUrl$?.value ?? '',
        });
      } catch {
        // We shouldn't re-throw an error since it'll break the subscription.
      }
    });
  }

  private _track(event: TrackEvent<TrackEventData>) {
    this.ngZone.runOutsideAngular(() => {
      try {
        window.analytics.track(event.action, event.properties);
      } catch {
        // We shouldn't re-throw an error since it'll break the subscription.
      }
    });
  }
}

function loadSegment(
  apiKey: string,
  segmentHasBeenLoaded$: ReplaySubject<boolean>
): void {
  const analytics = (window.analytics = window.analytics || []);

  if (analytics.initialize) {
    return;
  }

  if (ngDevMode && analytics.invoked) {
    throw new Error('Segment snippet included twice.');
  }

  analytics.invoked = true;
  analytics.methods = [
    'trackSubmit',
    'trackClick',
    'trackLink',
    'trackForm',
    'pageview',
    'identify',
    'reset',
    'group',
    'track',
    'ready',
    'alias',
    'debug',
    'page',
    'once',
    'off',
    'on',
    'addSourceMiddleware',
    'addIntegrationMiddleware',
    'setAnonymousId',
    'addDestinationMiddleware',
  ];

  analytics.factory = (method: string) => {
    return function () {
      const args = Array.prototype.slice.call(arguments);
      args.unshift(method);
      analytics.push(args);
      return analytics;
    };
  };

  for (const method of analytics.methods) {
    analytics[method] = analytics.factory(method);
  }

  loadScript({
    src: `https://cdn.segment.com/analytics.js/v1/${apiKey}/analytics.min.js`,
    onLoad: () => {
      segmentHasBeenLoaded$.next(true);
      segmentHasBeenLoaded$.complete();
    },
  });

  analytics._writeKey = apiKey;
  analytics.SNIPPET_VERSION = '4.13.2';
  analytics._loadOptions = undefined;
}
