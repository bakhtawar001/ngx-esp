import { Injector } from '@angular/core';
import { CONNECT_TO_STATE, OpenConnectionFn } from '../internal';
import { LocalState } from '../local-state';
import { StateContainer } from '../state-container';

export interface Connection {
  close(): void;
}

export interface StateMetaData<TLocalState> {
  stateContainer: StateContainer<TLocalState>;
  injector: Injector;
  instance: TLocalState;
}

export type Initializer<T> = (metadata: StateMetaData<T>) => Connection;

export interface ExtensionOptions<T> {
  initializer: Initializer<T>;
}

export function connectExtension<T extends object>(localState: LocalState<T>, options: ExtensionOptions<T>): void {
  const openConnectionFn: OpenConnectionFn<T> | undefined = (localState as any)[CONNECT_TO_STATE];
  if (openConnectionFn) {
    openConnectionFn(options.initializer);
  }
}
