import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ActivationEnd,
  NavigationEnd,
  NavigationStart,
  Router,
} from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, Subject } from 'rxjs';
import type { TrackEvent, TrackEventData } from './track-event';
import type { UserEvent } from './user-event';

@UntilDestroy()
@Injectable({ providedIn: 'root' })
export class CosAnalyticsService {
  //--------------------------------------------------------------------------------------------------------------
  // @Private Accessories
  //----------------------------------------------------------------------------------------------------------------
  private currentUrl = '';

  //-------------------------------------------------------------------------------------------------------------
  // @Public Accessories
  //----------------------------------------------------------------------------------------------------------------
  readonly snapshot$ = new BehaviorSubject<ActivatedRouteSnapshot | null>(null);
  private readonly _trackEvent$ = new Subject<TrackEvent<TrackEventData>>();
  private readonly _hoverEvent$ = new Subject<TrackEvent<TrackEventData>>();
  readonly userEvent$ = new BehaviorSubject<UserEvent | null>(null);
  readonly previousReferrerUrl$ = new BehaviorSubject<string | null>(null);

  readonly previousSnapshot$ =
    new BehaviorSubject<ActivatedRouteSnapshot | null>(null);

  constructor(private readonly router: Router) {
    this.setupRouterEventsListener();
  }

  get trackEvent$() {
    return this._trackEvent$.asObservable();
  }
  get hoverEvent$() {
    return this._hoverEvent$.asObservable();
  }

  track(event: TrackEvent<TrackEventData>) {
    const user = this.userEvent$.value?.traits;
    const pageUrlName = this.snapshot$.value!.data?.analytics?.page;
    const referrerPageUrlName =
      this.previousSnapshot$.value?.data?.analytics?.page;

    const properties = {
      ...event.properties,
      appCode: user?.TenantCode,
      appId: user?.TenantId,
      pageUrlName,
      referrerPageUrlName,
    };

    this._trackEvent$.next({
      action: event.action,
      properties,
    });
  }

  trackHover(event: TrackEvent<TrackEventData>) {
    const user = this.userEvent$.value?.traits;
    const pageUrlName = this.snapshot$.value!.data?.analytics?.page;
    const referrerPageUrlName =
      this.previousSnapshot$.value?.data?.analytics?.page;

    const properties = {
      ...event.properties,
      appCode: user?.TenantCode,
      appId: user?.TenantId,
      pageUrlName,
      referrerPageUrlName,
    };

    this._hoverEvent$.next({
      action: event.action,
      properties,
    });
  }

  private setupRouterEventsListener(): void {
    let lastRouteSnapshot: ActivatedRouteSnapshot | null = null;

    this.router.events.pipe(untilDestroyed(this)).subscribe({
      next: (event) => {
        if (event instanceof NavigationStart) {
          lastRouteSnapshot = null;
        } else if (event instanceof ActivationEnd && !lastRouteSnapshot) {
          lastRouteSnapshot = event.snapshot;
        } else if (event instanceof NavigationEnd && lastRouteSnapshot) {
          this.previousSnapshot$.next(this.snapshot$.value);
          this.previousReferrerUrl$.next(this.currentUrl);
          this.currentUrl = window.location.href;
          this.snapshot$.next(lastRouteSnapshot);
        }
      },
    });
  }
}
