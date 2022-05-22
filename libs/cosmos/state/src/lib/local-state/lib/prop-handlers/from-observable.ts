import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { definePropHandlerFactory, PropHandler } from '../prop-handler';
import { StateContainer } from '../state-container';
import { StatePropContext } from '../state-context';

function createFromObservablePropHandler<T>(
  observable: Observable<T>
): PropHandler<T> {
  let stateContainer: StateContainer<unknown>;
  let key: string | symbol;
  let propName = 'UKNOWN';
  let ctx: StatePropContext<T>;
  let latestValue: T;
  const propHandler: PropHandler<T> = {
    init(metadata): void {
      key = metadata.prop;
      stateContainer = metadata.stateContainer;
      propName = key.toString();
      ctx = stateContainer.createPropStateContext<T>(key);
      observable.pipe(takeUntil(metadata.destroyed$)).subscribe({
        next: (value) => {
          latestValue = value;
          ctx.setState((state) => value);
        },
      });
    },
    get(): T {
      return latestValue;
      // return ctx.getState();
    },
    set(value: T): boolean {
      if (ngDevMode) {
        throw new Error(
          `'${propName}' is an derived Local State property. Its value can only be changed through the observable it subscribes to.`
        );
      }

      return false;
    },
  };
  return propHandler;
}

export const fromObservable = definePropHandlerFactory(
  createFromObservablePropHandler
);
