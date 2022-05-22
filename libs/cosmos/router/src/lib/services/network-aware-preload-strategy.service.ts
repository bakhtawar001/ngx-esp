import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';

type EffectiveType = 'slow-2g' | '2g' | '3g' | '4g';

const avoidTheseConnections: EffectiveType[] = [
  'slow-2g',
  '2g',
  '3g' /* ,  '4g' */,
];

declare global {
  interface NetworkInformation {
    // Chrome 65+ | Edge 79+ | Opera
    saveData?: boolean;
    // Chrome 61+ | Edge 79+ | Opera
    effectiveType?: EffectiveType;
  }
}

@Injectable({ providedIn: 'root' })
export class NetworkAwarePreloadStrategy
  implements OnDestroy, PreloadingStrategy
{
  private alreadyPreloading = new Set<Route>();

  constructor(private ngZone: NgZone) {}

  ngOnDestroy(): void {
    this.alreadyPreloading.clear();
  }

  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    // Do not preload the same route twice.
    if (this.alreadyPreloading.has(route)) {
      return EMPTY;
    }

    const shouldPreload =
      route.data?.preload === 'always' || this.hasGoodConnection();

    if (shouldPreload) {
      this.preloadWhenIdling(route, load);
    }

    return EMPTY;
  }

  private hasGoodConnection(): boolean {
    // This is a known TS types definition issue.
    const { connection } = navigator as unknown as {
      connection: NetworkInformation;
    };

    if (connection) {
      if (
        connection.saveData ||
        (connection.effectiveType &&
          avoidTheseConnections.includes(connection.effectiveType))
      ) {
        return false;
      }
    }

    return true;
  }

  private preloadWhenIdling(
    route: Route,
    load: () => Observable<unknown>
  ): void {
    this.alreadyPreloading.add(route);

    this.ngZone.runOutsideAngular(() => {
      (window.requestIdleCallback || window.requestAnimationFrame)(() => {
        load();
      });
    });
  }
}
