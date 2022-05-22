import { PropHandler } from '../prop-handler';

export interface LifeCycleAwarePropertyMediator {
  getPropHandler: (
    prop: string | symbol,
    receiver: any
  ) => PropHandler<unknown>;
  markAsInitialised: () => void;
}

export function createLifeCycleAwarePropertyMediator<T>(
  target: T,
  handlers: Partial<Record<keyof T, PropHandler<unknown>>>,
  initialisePropHandler: <TProp>(
    handlerOrValue: PropHandler<TProp> | TProp,
    prop: string | symbol,
    receiver: any
  ) => PropHandler<TProp>
): LifeCycleAwarePropertyMediator {
  const prototype = Object.getPrototypeOf(target);
  const getInitialisationPropHandler = (
    prop: string | symbol,
    receiver: any
  ): PropHandler<unknown> => {
    const propDesc = prop?.toString();
    const receiverName =
      Object.getPrototypeOf(receiver)?.constructor?.name || 'UNKNOWN';
    const prototypePropDescriptor = getPropDescriptor(prototype, prop);
    return {
      get(): PropHandler<unknown> {
        if (prototypePropDescriptor) {
          if (prototypePropDescriptor.get) {
            return prototypePropDescriptor.get.apply(receiver);
          }
          return prototypePropDescriptor.value;
        }
        const existingProp = handlers[prop as keyof T];
        if (existingProp) {
          return existingProp;
        }
        throw new Error(
          `The property being retrieved has not been initialized yet (${receiverName}.${propDesc}).`
        );
      },
      set(value): boolean {
        if (prototypePropDescriptor) {
          if (prototypePropDescriptor.set) {
            prototypePropDescriptor.set.apply(receiver, [value]);
            return true;
          }
        }
        handlers[prop as keyof T] = initialisePropHandler(
          value,
          prop,
          receiver
        );
        return true;
      },
    };
  };

  const getThrowErrorPropHandler = (
    prop: string | symbol,
    receiver: any
  ): PropHandler<unknown> => {
    const propDesc = prop?.toString();
    const receiverName =
      Object.getPrototypeOf(receiver)?.constructor?.name || 'UNKNOWN';
    const errorMessage = `'${propDesc}' is not part of the initialised LocalState definition for ${receiverName}.`;
    const prototypePropDescriptor = getPropDescriptor(prototype, prop);
    return {
      get(): void {
        if (prototypePropDescriptor) {
          if (prototypePropDescriptor.get) {
            return prototypePropDescriptor.get.apply(receiver);
          }
          return prototypePropDescriptor.value;
        }
        throw new Error(errorMessage);
      },
      set(value: unknown): boolean {
        if (prototypePropDescriptor) {
          if (prototypePropDescriptor.set) {
            prototypePropDescriptor.set.apply(receiver, [value]);
            return true;
          }
        }
        throw new Error(errorMessage);
      },
    };
  };

  let getFallbackHandler = getInitialisationPropHandler;

  function getHandler(
    prop: string | symbol,
    receiver: any
  ): PropHandler<unknown> {
    return handlers[prop as keyof T] ?? getFallbackHandler(prop, receiver);
  }

  function markAsInitialised(): void {
    getFallbackHandler = getThrowErrorPropHandler;
  }

  return {
    getPropHandler: getHandler,
    markAsInitialised,
  };
}

function getPropDescriptor(
  obj: object,
  prop: string | symbol
): PropertyDescriptor {
  const prototypePropDescriptor = Object.getOwnPropertyDescriptor(obj, prop);
  if (prototypePropDescriptor) {
    return prototypePropDescriptor;
  }
  const prototype = Object.getPrototypeOf(obj);
  return prototype && getPropDescriptor(prototype, prop);
}
