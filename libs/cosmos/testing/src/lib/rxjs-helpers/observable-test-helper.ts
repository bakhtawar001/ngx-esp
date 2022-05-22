import { Observable, ReplaySubject } from 'rxjs';
import { first } from 'rxjs/operators';

export function createObservableResult<T>(
  options: { multiValue?: boolean } = {}
) {
  let resultSubject = new ReplaySubject<T>(1);
  const observableResult = {
    get$: () =>
      new Observable<T>((subscriber) => {
        const source = options.multiValue
          ? resultSubject
          : resultSubject.pipe(first());
        return source.subscribe(subscriber);
      }),
    next: (result: T) => {
      resultSubject.next(result);
      return { then: observableResult };
    },
    errorAndReset: (error: any) => {
      const oldSubject = resultSubject;
      resultSubject = new ReplaySubject<T>(1);
      oldSubject.error(error);
      return { then: observableResult };
    },
    done: () => {
      resultSubject.complete();
      return { then: observableResult };
    },
    reset: () => {
      resultSubject.complete();
      resultSubject = new ReplaySubject<T>(1);
      return { then: observableResult };
    },
  } as const;
  return observableResult;
}
