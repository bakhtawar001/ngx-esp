import { Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { StateContainer } from './state-container';

const PROP_HANDLER_META = Symbol('PropHandlerMeta');

export interface PropMetadata<TState> {
  prop: string | symbol;
  stateContainer: StateContainer<TState>;
  injector: Injector;
  destroyed$: Observable<void>;
  receiver: any;
}

export interface PropHandler<T> {
  init?(metaData: PropMetadata<unknown>): void;
  get(): T;
  set(value: T): boolean;
}

type PropHandlerFactory<TArgs extends any[], TReturn> = (
  ...args: TArgs
) => PropHandler<TReturn>;

// We lie to typescript about the return type so that the class properties have the correct return type
export type PropertyFactory<TArgs extends any[], TReturn> = (
  ...args: TArgs
) => TReturn;

export function definePropHandlerFactory<TArgs extends any[], TReturn>(
  propHandlerFactory: PropHandlerFactory<TArgs, TReturn>
): PropertyFactory<TArgs, TReturn> {
  const newFactory: PropHandlerFactory<TArgs, TReturn> = (
    ...args: TArgs
  ): PropHandler<TReturn> => {
    const propHandler = propHandlerFactory(...args);
    setAsPropHandler(propHandler);
    return propHandler;
  };
  return (newFactory as unknown) as any; // NNB: Trick typescript regarding the return type!
}

function setAsPropHandler<TReturn>(propHandler: PropHandler<TReturn>): void {
  Object.defineProperty(propHandler, PROP_HANDLER_META, {
    configurable: false,
    enumerable: false,
    writable: false,
    value: true,
  });
}

export function isPropHandler<T>(
  propHandler: any
): propHandler is PropHandler<T> {
  return propHandler[PROP_HANDLER_META] ? true : false;
}
