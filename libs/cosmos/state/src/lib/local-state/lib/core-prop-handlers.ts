import {
  definePropHandlerFactory,
  PropHandler,
  PropMetadata,
} from './prop-handler';
import { StateContainer } from './state-container';
import type { StateContext } from './state-context';

export const mutableProp = definePropHandlerFactory(<T>(initialValue: T) => {
  let stateContainer: StateContainer<unknown>;
  let key: string | symbol;
  const propHandler: PropHandler<T> = {
    init(metadata): void {
      key = metadata.prop;
      stateContainer = metadata.stateContainer;
      const ctx = stateContainer.createPropStateContext<T>(key);
      ctx.setState(initialValue);
    },
    get(): T {
      const ctx = stateContainer.createPropStateContext<T>(key);
      return ctx.getState();
    },
    set(value: T): boolean {
      const ctx = stateContainer.createPropStateContext<T>(key);
      ctx.setState(value);
      return true;
    },
  };
  return propHandler;
});

function createReadonlyPropHandler<T>(initialValue: T): PropHandler<T> {
  let stateContainer: StateContainer<unknown>;
  let key: string | symbol;
  let propName = 'UKNOWN';
  const propHandler: PropHandler<T> = {
    init(metadata): void {
      key = metadata.prop;
      stateContainer = metadata.stateContainer;
      propName = key.toString();
      const ctx = stateContainer.createPropStateContext<T>(key);
      ctx.setState(initialValue);
    },
    get(): T {
      const ctx = stateContainer.createPropStateContext<T>(key);
      return ctx.getState();
    },
    set(value: T): boolean {
      if (ngDevMode) {
        throw new Error(
          `'${propName}' is a readonly Local State property. It can only be altered through state modifiers.`
        );
      }

      return false;
    },
  };
  return propHandler;
}

export const readonlyProp = definePropHandlerFactory(createReadonlyPropHandler);

function createAsActionPropertyHandler<T, TArgs extends any[]>(
  handler: (this: T, ctx: StateContext<T>, ...args: TArgs) => void
): PropHandler<(...args: TArgs) => void> {
  let stateContainer: StateContainer<T>;
  let key: string | symbol;
  let receiver: T;
  let propName = 'UKNOWN';
  const propHandler: PropHandler<(...args: TArgs) => void> = {
    init(metadata: PropMetadata<T>): void {
      key = metadata.prop;
      stateContainer = metadata.stateContainer;
      propName = key.toString();
      receiver = metadata.receiver;
    },
    get(): (...args: TArgs) => void {
      return (...args: TArgs): void => {
        const ctx = stateContainer.createRootStateContext();
        handler.apply(receiver, [ctx, ...args]);
      };
    },
    set(): boolean {
      if (ngDevMode) {
        throw new Error(
          `'${propName}' is a readonly Local State action function.`
        );
      }

      return false;
    },
  };
  return propHandler;
}

export const asAction = definePropHandlerFactory(createAsActionPropertyHandler);
