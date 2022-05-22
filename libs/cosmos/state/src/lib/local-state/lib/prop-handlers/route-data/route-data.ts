import { ActivatedRoute, Data } from '@angular/router';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { isEqual } from 'lodash-es';

import { StatePropContext } from '../../state-context';
import { definePropHandlerFactory, PropHandler } from '../../prop-handler';

export const enum RouteDataErrorMessage {
  Options = 'routeData: Options are required to be provided.',
  Converter = 'routeData: The converter is required to be provided.',
  RouteIsMissing = 'routeData: The `ActivatedRoute` could not be injected, import the `RouterModule`.',
}

// The `Data` is always defined since it's emitted synchronously from the `data` stream.
// If the developer is trying to pluck some value out of the `data` then it might be `undefined`.
type RouteDataValue<T> = T extends Data ? T : T | undefined;

function createRouteDataPropHandler<T = never>(
  key?: string
): PropHandler<RouteDataValue<T>> {
  let propName = 'UNKNOWN';
  let route: ActivatedRoute;
  let latestValue: RouteDataValue<T>;
  let ctx: StatePropContext<RouteDataValue<T>>;

  const propHandler: PropHandler<RouteDataValue<T>> = {
    init({ prop, stateContainer, injector, destroyed$ }) {
      propName = prop.toString();
      ctx = stateContainer.createPropStateContext<RouteDataValue<T>>(prop);

      if (ngDevMode) {
        const injectedRoute = injector.get(ActivatedRoute, null);
        if (injectedRoute === null) {
          throw new Error(RouteDataErrorMessage.RouteIsMissing);
        }
        route = injectedRoute;
      } else {
        route = injector.get(ActivatedRoute);
      }

      route.data
        .pipe(
          map((data) => (key ? data[key] : data)),
          distinctUntilChanged(isEqual),
          takeUntil(destroyed$)
        )
        .subscribe((newValue: RouteDataValue<T>) => {
          latestValue = newValue;
          ctx.setState(() => newValue);
        });
    },
    get(): RouteDataValue<T> {
      return latestValue;
    },
    set(value: RouteDataValue<T>) {
      if (ngDevMode) {
        throw new Error(
          `'${propName}' is a read-only property. It cannot be altered.`
        );
      }

      return false;
    },
  };

  return propHandler;
}

export const routeData = definePropHandlerFactory(createRouteDataPropHandler);
