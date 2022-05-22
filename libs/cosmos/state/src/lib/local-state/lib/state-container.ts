import { BehaviorSubject, Observable } from 'rxjs';
import type {
  StateContext,
  StatePropContext,
  StateProps,
  ValueOrStateOperator,
} from './state-context';

export interface StateContainer<T> {
  asObservable(): Observable<StateProps<T>>;
  createRootStateContext(): StateContext<T>;
  createPropStateContext<TProp>(prop: string | symbol): StatePropContext<TProp>;
}

export function createStateContainer<T>(): StateContainer<T> {
  const state$ = new BehaviorSubject<T>({} as T);

  function getRootState(): any {
    return state$.value as any;
  }

  function setRootState(state: T): void {
    state$.next(state);
  }

  return {
    asObservable(): Observable<StateProps<T>> {
      return state$.asObservable();
    },
    createRootStateContext(): StateContext<T> {
      return {
        getState(): T {
          return getRootState() as T;
        },
        setState(valueOrStateOperator): void {
          let newValue: T = valueOrStateOperator as T;
          const currentValue = getRootState();
          if (typeof valueOrStateOperator === 'function') {
            newValue = (valueOrStateOperator as any)(currentValue);
          }
          if (currentValue !== newValue) {
            setRootState(newValue);
          }
        },
      };
    },
    createPropStateContext<TProp>(
      prop: string | symbol
    ): StatePropContext<TProp> {
      return {
        getState(): TProp {
          return getRootState()?.[prop] as TProp;
        },
        setState(valueOrStateOperator: ValueOrStateOperator<TProp>): void {
          let newValue = valueOrStateOperator;
          const rootState = getRootState();
          const currentValue = rootState?.[prop];
          if (typeof valueOrStateOperator === 'function') {
            newValue = (valueOrStateOperator as any)(currentValue);
          }
          if (currentValue !== newValue) {
            setRootState({
              ...rootState,
              [prop]: newValue,
            });
          }
        },
      };
    },
  };
}
