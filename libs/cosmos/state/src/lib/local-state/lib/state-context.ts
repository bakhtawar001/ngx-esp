import { AnyFunction } from './internal';

export type StateOperator<T> = (state: T) => T;

export type ValueOrStateOperator<T> = T | StateOperator<T>;

type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends AnyFunction ? never : K;
}[keyof T];
export type StateProps<T> = Pick<T, NonFunctionPropertyNames<T>>;

export interface StateContext<T> {
  getState(): StateProps<T>;
  setState(valueOrStateOperator: ValueOrStateOperator<StateProps<T>>): void;
}
export interface StatePropContext<T> {
  getState(): T;
  setState(valueOrStateOperator: ValueOrStateOperator<T>): void;
}
