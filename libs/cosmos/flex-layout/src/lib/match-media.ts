import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, merge, Observer } from 'rxjs';
import { filter } from 'rxjs/operators';

import { MediaChange } from './media-change';

/**
 * MediaMonitor configures listeners to mediaQuery changes and publishes an Observable facade to
 * convert mediaQuery change callbacks to subscriber notifications. These notifications will be
 * performed within the ng Zone to trigger change detections and component updates.
 *
 * NOTE: both mediaQuery activations and de-activations are announced in notifications
 */
@Injectable({ providedIn: 'root' })
export class MatchMedia implements OnDestroy {
  /** Initialize source with 'all' so all non-responsive APIs trigger style updates */
  readonly source = new BehaviorSubject<MediaChange>(new MediaChange(true));
  registry = new Map<string, MediaQueryList>();

  private readonly observable$ = this.source.asObservable();
  private readonly pendingRemoveListenerFns: Array<() => void> = [];

  constructor(private ngZone: NgZone) {}

  /**
   * Publish list of all current activations
   */
  get activations(): string[] {
    const results: string[] = [];
    this.registry.forEach((mql: MediaQueryList, key: string) => {
      if (mql.matches) {
        results.push(key);
      }
    });
    return results;
  }

  /**
   * For the specified mediaQuery?
   */
  isActive(mediaQuery: string): boolean {
    const mql = this.registry.get(mediaQuery);
    return mql
      ? mql.matches
      : this.registerQuery(mediaQuery).some((m) => m.matches);
  }

  /**
   * External observers can watch for all (or a specific) mql changes.
   *
   * If a mediaQuery is not specified, then ALL mediaQuery activations will
   * be announced.
   */
  observe(): Observable<MediaChange>;
  observe(mediaQueries: string[]): Observable<MediaChange>;
  observe(
    mediaQueries: string[],
    filterOthers: boolean
  ): Observable<MediaChange>;

  /**
   * External observers can watch for all (or a specific) mql changes.
   * Typically used by the MediaQueryAdaptor; optionally available to components
   * who wish to use the MediaMonitor as mediaMonitor$ observable service.
   *
   * Use deferred registration process to register breakpoints only on subscription
   * This logic also enforces logic to register all mediaQueries BEFORE notify
   * subscribers of notifications.
   */
  observe(mqList?: string[], filterOthers = false): Observable<MediaChange> {
    if (mqList && mqList.length) {
      const matchMedia$: Observable<MediaChange> = this.observable$.pipe(
        filter((change: MediaChange) =>
          !filterOthers ? true : mqList.indexOf(change.mediaQuery) > -1
        )
      );
      const registration$: Observable<MediaChange> = new Observable(
        (observer: Observer<MediaChange>) => {
          // tslint:disable-line:max-line-length
          const matches: Array<MediaChange> = this.registerQuery(mqList);
          if (matches.length) {
            const lastChange = matches.pop()!;
            matches.forEach((e: MediaChange) => {
              observer.next(e);
            });
            this.source.next(lastChange); // last match is cached
          }
          observer.complete();
        }
      );
      return merge(registration$, matchMedia$);
    }

    return this.observable$;
  }

  /**
   * Based on the BreakPointRegistry provider, register internal listeners for each unique
   * mediaQuery. Each listener emits specific MediaChange data to observers
   */
  registerQuery(mediaQuery: string | string[]) {
    const list = Array.isArray(mediaQuery) ? mediaQuery : [mediaQuery];
    const matches: MediaChange[] = [];

    buildQueryCss(list);

    list.forEach((query: string) => {
      const onMQLEvent = ({ matches }: MediaQueryListEvent) => {
        if (NgZone.isInAngularZone()) {
          this.source.next(new MediaChange(matches, query));
        } else {
          this.ngZone.run(() =>
            this.source.next(new MediaChange(matches, query))
          );
        }
      };

      let mql = this.registry.get(query);
      if (!mql) {
        mql = window.matchMedia(query);
        mql.addEventListener('change', onMQLEvent);
        this.pendingRemoveListenerFns.push(() =>
          mql!.removeEventListener('change', onMQLEvent)
        );
        this.registry.set(query, mql);
      }

      if (mql.matches) {
        matches.push(new MediaChange(true, query));
      }
    });

    return matches;
  }

  ngOnDestroy(): void {
    while (this.pendingRemoveListenerFns.length) {
      this.pendingRemoveListenerFns.pop()!();
    }
  }
}

/**
 * Private global registry for all dynamically-created, injected style tags
 * @see prepare(query)
 */
const ALL_STYLES: { [key: string]: any } = {};

/**
 * For Webkit engines that only trigger the MediaQueryList Listener
 * when there is at least one CSS selector for the respective media query.
 */
function buildQueryCss(mediaQueries: string[]): void {
  const list = mediaQueries.filter((it) => !ALL_STYLES[it]);

  if (list.length === 0) {
    return;
  }

  const query = list.join(', ');

  try {
    const styleEl = document.createElement('style');

    styleEl.setAttribute('type', 'text/css');
    if (!(styleEl as any).styleSheet) {
      const cssText = `
 /*
   @angular/flex-layout - workaround for possible browser quirk with mediaQuery listeners
   see http://bit.ly/2sd4HMP
 */
 @media ${query} {.fx-query-test{ }}
 `;
      styleEl.appendChild(document.createTextNode(cssText));
    }

    document.head!.appendChild(styleEl);

    // Store in private global registry
    list.forEach((mq) => (ALL_STYLES[mq] = styleEl));
  } catch (e) {
    console.error(e);
  }
}
