import { NgZone } from '@angular/core';
import { MonoTypeOperatorFunction, Observable } from 'rxjs';

function assertHasNgZone(ngZone: NgZone, caller: string) {
  if (!ngZone) {
    throw new Error(`ngZone must be provided for '${caller}' rxjs operator`);
  }
}

export function observeInsideAngularZone<TValue>(
  ngZone: NgZone
): MonoTypeOperatorFunction<TValue> {
  ngDevMode && assertHasNgZone(ngZone, 'observeInsideAngularZone');
  return wrapObserverCalls<TValue>((fn: () => void) => {
    if (NgZone.isInAngularZone()) {
      fn();
    } else {
      ngZone.run(fn);
    }
  });
}

export function observeOutsideAngularZone<TValue>(
  ngZone: NgZone
): MonoTypeOperatorFunction<TValue> {
  ngDevMode && assertHasNgZone(ngZone, 'observeOutsideAngularZone');
  return wrapObserverCalls<TValue>((fn: () => void) => {
    if (NgZone.isInAngularZone()) {
      ngZone.runOutsideAngular(fn);
    } else {
      fn();
    }
  });
}

function wrapObserverCalls<TValue>(
  invokeObserverCall: (fn: () => void) => void
): MonoTypeOperatorFunction<TValue> {
  return (source: Observable<TValue>) => {
    return new Observable<TValue>((subscriber) => {
      const subscription = source.subscribe({
        next(value) {
          invokeObserverCall(() => subscriber.next(value));
        },
        error(error) {
          invokeObserverCall(() => subscriber.error(error));
        },
        complete() {
          invokeObserverCall(() => subscriber.complete());
        },
      });
      return () => {
        invokeObserverCall(() => subscription.unsubscribe());
      };
    });
  };
}
