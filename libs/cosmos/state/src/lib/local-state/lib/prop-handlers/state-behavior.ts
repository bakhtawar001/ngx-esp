import { Observable, Subscription } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { LocalState } from '../local-state';
import {
  definePropHandlerFactory,
  PropHandler,
  PropMetadata,
} from '../prop-handler';
import { StateContainer } from '../state-container';

export interface Behavior<TState extends LocalState<any>> {
  enable(): boolean;
  disable(): void;
}

function createStateBehaviorPropHandler<TState extends LocalState<any>>(
  hook: (state$: Observable<TState>) => Observable<any>
): PropHandler<Behavior<TState>> {
  let stateContainer: StateContainer<TState>;
  let key: string | symbol;
  let propName = 'UKNOWN';
  let behaviorHook$: Observable<any>;
  let subscription: Subscription;
  const behavior: Behavior<TState> = {
    enable(): boolean {
      if (subscription && !subscription.closed) {
        return false;
      }
      subscription = behaviorHook$.subscribe();
      return true;
    },
    disable(): void {
      if (subscription && !subscription.closed) {
        subscription.unsubscribe();
      }
    },
  };
  const propHandler: PropHandler<Behavior<TState>> = {
    init(metadata: PropMetadata<TState>): void {
      key = metadata.prop;
      stateContainer = metadata.stateContainer;
      propName = key.toString();
      const state$ = stateContainer
        .asObservable()
        .pipe(
          map((state) =>
            Object.setPrototypeOf(
              { ...state },
              Object.getPrototypeOf(metadata.receiver)
            )
          )
        ) as Observable<TState>;
      behaviorHook$ = hook(state$).pipe(takeUntil(metadata.destroyed$));
      behavior.enable();
    },
    get(): Behavior<TState> {
      return behavior;
    },
    set(value: Behavior<TState>): boolean {
      if (ngDevMode) {
        throw new Error(
          `'${propName}' is a Local State behavior. Its value cannot be set.`
        );
      }

      return false;
    },
  };
  return propHandler;
}

export const stateBehavior = definePropHandlerFactory(
  createStateBehaviorPropHandler
);
