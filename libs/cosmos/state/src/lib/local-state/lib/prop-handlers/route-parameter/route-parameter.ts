import { ActivatedRoute, Params } from '@angular/router';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { isEqual } from 'lodash-es';

import { StatePropContext } from '../../state-context';
import { definePropHandlerFactory, PropHandler } from '../../prop-handler';

export const enum RouteParameterErrorMessage {
  Options = 'routeParameter: Options are required to be provided.',
  RouteIsMissing = 'routeParameter: The `ActivatedRoute` could not be injected, import the `RouterModule`.',
}

// The `Params` is always defined since it's emitted synchronously from the `params` stream.
type RouteParameterValue = Params | string;

function createRouteParameterPropHandler(
  parameter?: string
): PropHandler<RouteParameterValue> {
  let propName = 'UNKNOWN';
  let route: ActivatedRoute;
  let latestValue: RouteParameterValue;
  let ctx: StatePropContext<RouteParameterValue>;

  const propHandler: PropHandler<RouteParameterValue> = {
    init({ prop, stateContainer, injector, destroyed$ }) {
      propName = prop.toString();
      ctx = stateContainer.createPropStateContext<RouteParameterValue>(prop);

      if (ngDevMode) {
        const injectedRoute = injector.get(ActivatedRoute, null);
        if (injectedRoute === null) {
          throw new Error(RouteParameterErrorMessage.RouteIsMissing);
        }
        route = injectedRoute;
      } else {
        route = injector.get(ActivatedRoute);
      }

      route.params
        .pipe(
          map((params) => (parameter ? params[parameter] : params)),
          distinctUntilChanged(isEqual),
          takeUntil(destroyed$)
        )
        .subscribe((newValue: RouteParameterValue) => {
          latestValue = newValue;
          ctx.setState(() => newValue);
        });
    },
    get(): RouteParameterValue {
      return latestValue;
    },
    set(value: RouteParameterValue) {
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

interface RouteParameter {
  (): Params;
  (parameter: string): string;
}

export const routeParameter = definePropHandlerFactory(
  createRouteParameterPropHandler
) as RouteParameter;
