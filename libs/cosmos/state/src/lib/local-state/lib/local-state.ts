import {
  inject,
  Injectable,
  Injector,
  NgZone,
  OnDestroy,
  ɵdetectChanges,
  ɵgetLContext,
  ɵmarkDirty,
} from '@angular/core';
import { getZoneUnPatchedApi } from '@cosmos/zone-less';
import { concat, EMPTY, Observable, ReplaySubject, timer } from 'rxjs';
import {
  ignoreElements,
  map,
  switchMap,
  take,
  takeUntil,
  takeWhile,
  tap,
} from 'rxjs/operators';
import { mutableProp } from './core-prop-handlers';
import { Connection, StateMetaData } from './extensibility/connector';
import { CONNECT_TO_STATE, OpenConnectionFn } from './internal';
import { isPropHandler, PropHandler, PropMetadata } from './prop-handler';
import { createLifeCycleAwarePropertyMediator } from './proxy/property-mediator';
import { createPropHandlerProxy } from './proxy/proxy-utils';
import { createStateContainer, StateContainer } from './state-container';
import { observeInsideAngularZone } from './zone-helpers';

const PRIVATE_PROPS = Symbol('_PrivateLocalStateProps');

interface PrivateProps<T> {
  stateContainer: StateContainer<T>;
  injector: Injector;
  destroyed$: ReplaySubject<void>;
}

function getPrivateProps<T>(localState: any): PrivateProps<T> {
  return (localState as any)[PRIVATE_PROPS] || {};
}

export const enum LocalStateRenderStrategy {
  Local,
  Global,
}

interface LocalStateOptions {
  renderStrategy: LocalStateRenderStrategy;
}

const defaultLocalStateOptions: LocalStateOptions = {
  renderStrategy: LocalStateRenderStrategy.Global,
};

@Injectable()
export class LocalState<T extends object> implements OnDestroy {
  constructor() {
    const stateContainer = createStateContainer<T>();
    const injector = inject(Injector);
    const privateProps: PrivateProps<T> = {
      stateContainer,
      injector,
      destroyed$: new ReplaySubject<void>(1),
    };
    const destroyed$ = privateProps.destroyed$.asObservable();

    const handlers: Partial<Record<keyof this, PropHandler<unknown>>> = {};
    (handlers as any)[PRIVATE_PROPS] = {
      get: () => privateProps,
      set: () => false,
    };

    function initialisePropHandler<TProp>(
      handlerOrValue: PropHandler<TProp> | TProp,
      prop: string | symbol,
      receiver: any
    ): PropHandler<TProp> {
      const propHandler = isPropHandler(handlerOrValue)
        ? handlerOrValue
        : (mutableProp(handlerOrValue) as unknown as PropHandler<TProp>);

      const propMetadata: PropMetadata<T> = {
        prop,
        stateContainer,
        injector,
        receiver,
        destroyed$,
      };
      propHandler.init?.(propMetadata);
      return propHandler;
    }

    const propertyMediator = createLifeCycleAwarePropertyMediator<this>(
      this,
      handlers,
      initialisePropHandler
    );

    let loading = true;
    // Use the `__zone_symbol__Promise` to avoid triggering change detection when the promise gets resolved.
    getZoneUnPatchedApi('Promise')
      .resolve()
      .then(() => {
        // Complete initialisation in the next microtask
        loading = false;
        propertyMediator.markAsInitialised();
      });

    const proxy = createPropHandlerProxy(this, propertyMediator.getPropHandler);

    const connectToState: OpenConnectionFn<T> = (
      initialiser: (metadata: StateMetaData<T>) => Connection
    ) => {
      const connection = initialiser({
        injector,
        stateContainer,
        instance: proxy as unknown as T,
      });
      let closed = false;
      const closeConnection = () => {
        if (!closed) {
          connection.close();
          closed = true;
        }
      };
      destroyed$.pipe(take(1)).subscribe({
        next: closeConnection,
        complete: closeConnection,
      });
    };
    (handlers as any)[CONNECT_TO_STATE] = {
      get: () => connectToState,
      set: () => false,
    };

    return proxy;
  }

  ngOnDestroy(): void {
    const { destroyed$ } = getPrivateProps(this);
    destroyed$.next();
  }

  /**
   * Connect this local state instance to the provided component.
   * After calling this, the component's change detection will be triggered with any change to the local state.
   * The returned observable is also bound to the lifetime of the component and the local state.
   * @param component The component that will be bound to this local state.
   * Changes to any property of the local state will trigger change detection for this component.
   * @returns An observable whose lifetime is bound to the lifetime of the component provided.
   * There is no need to cater for the unsubscription from this observable because it will be
   * unsubscribed automatically on destroy.
   */
  connect(
    component: any,
    options = defaultLocalStateOptions
  ): Observable<this> {
    const { stateContainer, injector, destroyed$ } = getPrivateProps(this);
    const ngZone = injector.get(NgZone);

    let refreshComponent = (): void => {};
    const hasInitialised = () => {
      const ngContextProp = '__ngContext__';
      return (component as any)[ngContextProp] !== undefined;
    };
    const hasDetached = () => {
      if (!hasInitialised()) {
        return false;
      }
      const lContext = ɵgetLContext(component);
      const FLAGS = 2;
      const componentNode = lContext?.lView[lContext.nodeIndex];
      const flags = componentNode?.[FLAGS];
      const DESTROYED_STATUS = 256;
      // tslint:disable-next-line: no-bitwise
      return flags & DESTROYED_STATUS;
    };

    if (options.renderStrategy === LocalStateRenderStrategy.Global) {
      refreshComponent = () => ɵmarkDirty(component);
    } else {
      refreshComponent = () => ɵdetectChanges(component);
    }

    const waitUntilComponentInitialized = hasInitialised()
      ? EMPTY
      : timer(0, 100).pipe(
          takeWhile(() => !hasInitialised()),
          // Do not tap in production.
          ngDevMode
            ? tap((index) => {
                if (index === 1000) {
                  console.error(
                    'Component not initialised after 100 seconds',
                    component
                  );
                }
              })
            : (source) => source,
          ignoreElements()
        );

    const stateChangesUntilComponentDetached = stateContainer
      .asObservable()
      .pipe(
        // The global change detection is already asynchronous since it uses the `requestAnimationFrame` internally.
        options.renderStrategy === LocalStateRenderStrategy.Global
          ? (source) => source
          : // The local change detection is synchronous. There might be multiple properties updated in a row which
            // will cause multiple local change detections to run synchronously. We're using the `switchMap` to coaelse
            // all those changes in a single next animation frame.
            switchMap((state) => raf$.pipe(map(() => state))),
        takeWhile(() => !hasDetached()),
        takeUntil(destroyed$)
      );

    const componentBoundObservable = concat(
      waitUntilComponentInitialized,
      stateChangesUntilComponentDetached
    );

    componentBoundObservable.subscribe({
      next: () => {
        try {
          refreshComponent();
        } catch (e) {
          console.error(e);
        }
      },
    });
    return componentBoundObservable.pipe(
      map((state) =>
        Object.setPrototypeOf({ ...state }, Object.getPrototypeOf(this))
      ),
      observeInsideAngularZone(ngZone)
    );
  }
}

const raf$ = new Observable<void>((subscriber) => {
  const requestId = requestAnimationFrame(() => {
    subscriber.next();
    subscriber.complete();
  });
  return () => cancelAnimationFrame(requestId);
});
