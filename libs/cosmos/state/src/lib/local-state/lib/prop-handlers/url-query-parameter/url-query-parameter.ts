import { ErrorHandler, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  takeUntil,
} from 'rxjs/operators';
import { definePropHandlerFactory, PropHandler } from '../../prop-handler';
import { StatePropContext } from '../../state-context';
import { observeOutsideAngularZone } from '../../zone-helpers';

export const enum UrlQueryParameterErrorMessage {
  ParameterName = 'urlQueryParameter: The parameter name is required to be provided.',
  Options = 'urlQueryParameter: Options are required to be provided.',
  Converter = 'urlQueryParameter: The converter is required to be provided.',
  RouterIsMissing = 'urlQueryParameter: The `Router` could not be injected, import the `RouterModule`.',
}

export interface UrlQueryParameterConverter<T> {
  fromQuery(
    queryParameterValues: string[],
    defaultValue: T | undefined,
    currentValue: T | null
  ): T;
  toQuery(
    value: T,
    defaultValue: T | undefined,
    currentQueryParameterValues: string[]
  ): string[];
}

export interface UrlQueryParameterOptions<T> {
  debounceTime?: number;
  defaultValue?: T;
  converter: UrlQueryParameterConverter<T>;
}

const NavigationHasBeenTriggeredThroughLocalState =
  'NavigationHasBeenTriggeredThroughLocalState';

function createUrlQueryParameterPropHandler<T>(
  parameterName: string,
  options: UrlQueryParameterOptions<T>
): PropHandler<T | undefined> {
  if (ngDevMode) {
    if (!parameterName) {
      throw new Error(UrlQueryParameterErrorMessage.ParameterName);
    }

    if (!options) {
      throw new Error(UrlQueryParameterErrorMessage.Options);
    }

    if (!options.converter) {
      throw new Error(UrlQueryParameterErrorMessage.Converter);
    }
  }

  let ngZone: NgZone;
  let router: Router;
  let route: ActivatedRoute;
  let errorHandler: ErrorHandler;
  let latestValue: T | undefined;
  let lastQueryParameterValues: string[] | null = null;

  let ctx: StatePropContext<T>;

  // This is `null | string[]` since we want to cancel the existing timer. It'll be cancelled if `null` is emitted.
  const navigateWithQueryParameters$ = new Subject<null | string[]>();

  const propHandler: PropHandler<T | undefined> = {
    init({ prop, stateContainer, injector, destroyed$ }): void {
      ctx = stateContainer.createPropStateContext<T>(prop);

      ngZone = injector.get(NgZone);
      errorHandler = injector.get(ErrorHandler);

      // This shouldn't be extracted into a separate function since we want this to be tree-shaken away in production,
      // the `else` condition body will be moved to a top-level scope when app is built in production mode.
      if (ngDevMode) {
        const injectedRouter = injector.get(Router, null);
        if (injectedRouter === null) {
          throw new Error(UrlQueryParameterErrorMessage.RouterIsMissing);
        }
        router = injectedRouter;
      } else {
        router = injector.get(Router);
      }

      route = injector.get(ActivatedRoute);

      navigateWithQueryParameters$
        .pipe(
          // Caretaker note: it's important to call the `next()` inside the `<root>` zone so `debounceTime` will
          // schedule an async action through the `setInterval` in the `<root>` zone. That will help avoid triggering
          // multiple change detections when multiple values are set in a row, and `setInterval` is re-scheduled multiple times.
          observeOutsideAngularZone(ngZone),
          // If the page changes during the debounce period, then the URL should NOT be updated on the new page
          // when the debounce period completes.
          debounceTime(options.debounceTime ?? 500),
          filter((queryParameters) => queryParameters !== null),
          takeUntil(destroyed$)
        )
        .subscribe((newQueryParameterValues: string[] | null) => {
          if (router.getCurrentNavigation()) {
            navigateWithQueryParameters$.next(newQueryParameterValues);
            return;
          }
          const oldQueryParameterValues: string[] =
            route.snapshot.queryParamMap.getAll(parameterName) || [];

          const queryParamsAreUnchanged = arraysAreEqual(
            oldQueryParameterValues,
            newQueryParameterValues
          );

          if (!queryParamsAreUnchanged) {
            // Caretaker note: the current callback is running inside the `<root>` zone since we
            // are observing `navigateWithQueryParameters$` outside of the Angular zone.
            ngZone.run(() => {
              lastQueryParameterValues = newQueryParameterValues;
              router.navigate([], {
                queryParams: {
                  [parameterName]: newQueryParameterValues,
                },
                queryParamsHandling: 'merge',
                state: {
                  [NavigationHasBeenTriggeredThroughLocalState]: true,
                },
              });
            });
          }
        });

      let isInitialEvent = true;

      route.queryParamMap
        .pipe(
          map((queryParamMap) => queryParamMap.getAll(parameterName)),
          distinctUntilChanged<string[]>(arraysAreEqual),
          filter(
            (queryParameterValues) =>
              !arraysAreEqual(lastQueryParameterValues, queryParameterValues)
          ),
          takeUntil(destroyed$)
        )
        .subscribe((queryParameterValues: string[]) => {
          try {
            lastQueryParameterValues = queryParameterValues;
            const newValue = options.converter.fromQuery(
              queryParameterValues,
              options.defaultValue,
              latestValue || null
            );

            if (isInitialEvent) {
              isInitialEvent = false;
              propHandler.set(newValue);
            } else {
              setValue(newValue);
              navigateWithQueryParameters$.next(null);
            }
          } catch (error) {
            if (typeof options.defaultValue !== 'undefined') {
              setValue(options.defaultValue);
            }
            errorHandler.handleError(error);
          }
        });
    },
    get(): T | undefined {
      return latestValue;
    },
    set(value: T): boolean {
      const queryParameterValues: string[] =
        route.snapshot.queryParamMap.getAll(parameterName) || [];

      const newQueryParameterValues: string[] =
        options.converter.toQuery(
          value,
          options.defaultValue,
          queryParameterValues
        ) || [];

      setValue(value);

      navigateWithQueryParameters$.next(newQueryParameterValues);

      return true;
    },
  };

  return propHandler;

  function setValue(newValue: T) {
    if (latestValue !== newValue) {
      latestValue = newValue;
      ctx.setState(() => newValue);
    }
  }
}

function arraysAreEqual(a: string[] | null, b: string[] | null) {
  return !!(
    (!a && !b) ||
    (a && b && a.length === b.length && JSON.stringify(a) === JSON.stringify(b))
  );
}

export const urlQueryParameter = definePropHandlerFactory(
  createUrlQueryParameterPropHandler
);
