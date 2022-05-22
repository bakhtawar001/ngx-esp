import { Injectable, InjectionToken, Injector, NgZone } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Actions, ofActionDispatched } from '@ngxs/store';
import { defer, Subject } from 'rxjs';
import { map, mergeMap, shareReplay } from 'rxjs/operators';
import { ToastActions } from '../actions';
import type { ToastConfig, ToastData } from './lazy-hot-toast';

// We'll be able to mock this service within unit tests so `getLazyHotToast` will emit synchronously.
@Injectable({ providedIn: 'root' })
export class LazyHotToastLoader {
  private lazyHotToast$ = defer(
    () =>
      import(
        /* webpackPreload: true */
        /* webpackChunkName: 'hot-toast' */ './lazy-hot-toast'
      )
  ).pipe(shareReplay({ refCount: true, bufferSize: 1 }));

  getLazyHotToast() {
    return this.lazyHotToast$;
  }
}

const defaultToastConfig: ToastConfig = {
  duration: 3000,
  position: 'bottom-right',
  className: 'cos-toast',
  autoClose: true,
  dismissible: false,
};

export const TOAST_COMPONENT_DATA = new InjectionToken<unknown>(
  'Toast Component Data'
);

@UntilDestroy()
@Injectable({ providedIn: 'root' })
export class CosToastService {
  private showToast$ = new Subject<{ data: ToastData; config?: ToastConfig }>();

  constructor(
    injector: Injector,
    actions$: Actions,
    ngZone: NgZone,
    lazyHotToastLoader: LazyHotToastLoader
  ) {
    actions$
      .pipe(ofActionDispatched(ToastActions.Show), untilDestroyed(this))
      .subscribe({
        next: ({ payload, config }: ToastActions.Show) => {
          NgZone.isInAngularZone()
            ? this.showToast(payload, config)
            : ngZone.run(() => {
                this.showToast(payload, config);
              });
        },
      });

    this.showToast$
      .pipe(
        mergeMap(({ data, config }) =>
          lazyHotToastLoader.getLazyHotToast().pipe(
            map(({ HotToastComponent, HotToastService }) => ({
              data,
              config,
              HotToastComponent,
              HotToastService,
            }))
          )
        ),
        untilDestroyed(this)
      )
      .subscribe(({ data, config, HotToastComponent, HotToastService }) => {
        // We're able to lazy-load services if they're not tightened to any NgModule, e.g. `HotToastService` is a root
        // provider (marked with `providedIn: root`).
        injector.get(HotToastService).show(HotToastComponent, {
          data,
          ...{ ...defaultToastConfig, ...config },
        });
      });
  }

  success(
    title: string,
    body?: string,
    componentData?: Record<string, unknown>,
    config?: ToastConfig
  ) {
    this.showToast({ title, body, componentData, type: 'confirm' }, config);
  }

  error(
    title: string,
    body?: string,
    componentData?: Record<string, unknown>,
    config?: ToastConfig
  ) {
    this.showToast({ title, body, componentData, type: 'error' }, config);
  }

  info(
    title: string,
    body?: string,
    componentData?: Record<string, unknown>,
    config?: ToastConfig
  ) {
    this.showToast({ title, body, componentData, type: 'info' }, config);
  }

  warning(
    title: string,
    body?: string,
    componentData?: Record<string, unknown>,
    config?: ToastConfig
  ) {
    this.showToast({ title, body, componentData, type: 'warn' }, config);
  }

  showToast(data: ToastData, config?: ToastConfig) {
    this.showToast$.next({ data, config });
  }
}
