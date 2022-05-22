import { Injectable, NgZone } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ReplaySubject } from 'rxjs';
import { mergeMapTo } from 'rxjs/operators';

import { loadScript } from '../utils';
import { CosAnalyticsService } from '../core';
import { UserEvent } from '../core/user-event';
import type { HeapIoConfig, HeapIoOptions } from './types';

const heap = window.heap || [];

declare global {
  interface Window {
    heap: any;
  }
}

@UntilDestroy()
@Injectable({ providedIn: 'root' })
export class HeapIoService {
  private heapHasBeenLoaded$ = new ReplaySubject<boolean>(1);

  constructor(
    private readonly ngZone: NgZone,
    private readonly analytics: CosAnalyticsService
  ) {}

  // Caretaker note: any `heapanalytics` method should be wrapped into `runOutsideAngular` since
  // they're making HTTP requests internally.

  // public track(event_name: string, properties: { [name: string]: any }) {
  //   this.ngZone.runOutsideAngular(() => {
  //     window.heap?.track(event_name, properties);
  //   });
  // }

  start(config: HeapIoConfig): void {
    heap.load = loadHeap;

    window.heap = heap;

    window.heap.load(config.appId, config.options, this.heapHasBeenLoaded$);

    this.heapHasBeenLoaded$
      .pipe(mergeMapTo(this.analytics.userEvent$), untilDestroyed(this))
      .subscribe({
        next: (event) => (event ? this._identify(event) : this._reset()),
      });
  }

  private _identify({ userId, traits }: UserEvent) {
    const {
      Name,
      Email: email, // heap requires lowercase for id
      TenantId,
      CompanyName,
      AsiNumber: CompanyASINumber,
      IsInternal: InternalCompany,
    } = traits;

    this.ngZone.runOutsideAngular(() => {
      window.heap.identify(userId);
      window.heap.addUserProperties({
        Name,
        email,
        TenantId,
        CompanyName,
        CompanyASINumber,
        InternalCompany,
      });
    });
  }

  private _reset() {
    this.ngZone.runOutsideAngular(() => {
      window.heap.resetIdentity();
    });
  }
}

function loadHeap(
  appId: string,
  appOptions: HeapIoOptions,
  heapHasBeenLoaded$: ReplaySubject<boolean>
) {
  window.heap.appid = appId;
  window.heap.config = appOptions || {};

  loadScript({
    src: 'https://cdn.heapanalytics.com/js/heap-' + appId + '.js',
    onLoad: () => {
      heapHasBeenLoaded$.next(window.heap.loaded);
      heapHasBeenLoaded$.complete();
    },
  });
  for (
    let n = function (e: string) {
        return function () {
          heap.push([e].concat(Array.prototype.slice.call(arguments, 0)));
        };
      },
      p = [
        'addEventProperties',
        'addUserProperties',
        'clearEventProperties',
        'identify',
        'resetIdentity',
        'removeEventProperty',
        'setEventProperties',
        'track',
        'unsetEventProperty',
      ],
      o = 0;
    o < p.length;
    o++
  )
    heap[p[o]] = n(p[o]);
}
