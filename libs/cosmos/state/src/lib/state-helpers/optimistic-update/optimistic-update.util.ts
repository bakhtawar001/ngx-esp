import { Observable } from 'rxjs';

/*
Definition of Terms:
- initial value: the value in the state before the operation started.
- optimistic value: the value provided to set the state to while the operation is running in order
    to optimistically represent what the server side value will be after the operation.
- confirmation: the signal from the server that the operation was sucessful.
  Once this signal is received, the update will not be rolled back.
- emit: a value emitted by the source stream (the server call) that represents the updated server state.
- completion: the completion of the source stream.
- empty stream: a stream that completes without emitting any values.
- roll back: the value of the state would be set back to the initial value because the update
  is not viewed as successful.

Possible options for future (current behaviour marked with a *):
- allowEmptyStream: boolean - Default: `false`
  - `false` - throws an error if the stream completes without emitting a value.
  - `true`*
    - If unsubscribed before a value is emitted then the update is rolled back.
    - If the source completes without emitting a value then the behavior would depend on the
      `operationConfirmedOn` option. The default, `first value` would cause a roll back for an empty stream.
      If it is explicitly set to `completion` then it would view the operation as confirmed on completion
      in spite of being empty and the optimistic value would be used as the final value.
- allowMultipleValues: boolean - Default: `false` in dev but `true` in prod
  - `false` - throws an error if a second value is emitted.
  - `true`* - allows many values to be emitted by the source.
- setValueOn: 'each emit' | 'completion' | 'first only' - Default: `each emit`
  - `each emit`* - each value emitted by the source stream would be set to the state.
  - `completion` - the state value would be set to the most recent value emitted by the source
    only when the source completes.
  - `first only` - the state value would be set to the first value emitted by the source, and not after that.
- operationConfirmedOn: 'first value' | 'completion' - Default: `first value`
  - `first value` - once the first value is emitted from the source, this is viewed as confirmation
    of a successful update. The subscription will still continue until the source reaches a final state.
    Unsubscription would not cause a rollback, but the response to an error would be determined by the
    `errorHandling` option.
  - `completion`* - only once the source stream has completed successfully is the operation viewed
    as confirmed. If the source observable errors or is unsubscribed before completion then the update is rolled back
- errorHandling: `roll back` | `ignore after confirmed` - Default: `roll back`
  - `roll back`* - if the source stream errors then the operation is rolled back, no matter if the operation
    was viewed as confirmed or not.
  - `ignore after confirmed` - the update is rolled back if the operation is not confirmed, but
    once the operation is confirmed then the error will not trigger a rollback
  - In both cases the error will still propogate to subsequent operators
- strictValueChecks: boolean - Default: `true`, but becomes a noop in prod (like `false`)
  - `false`* - no additional checks are performed
  - `true` - checks are done in dev mode and are treeshaken away in production builds.
    - every time, before the state value is set, the current value is compared against the previous
      value expected by the operator. If the value does not match then it means that another operation
      interferred with the optimistically updated property and an error will be thrown.
*/

export interface StateValueAccessor<TValue> {
  getValue: () => TValue;
  setValue: (value: TValue) => void;
}

export function optimisticUpdate<TValue>(
  optimisticValue: TValue,
  valueAccessor: StateValueAccessor<TValue>
) {
  function updateState(value: TValue) {
    valueAccessor.setValue(value);
  }
  return function (source: Observable<TValue>): Observable<TValue> {
    return new Observable((subscriber) => {
      const previousValue = valueAccessor.getValue();
      const rollBack = () => updateState(previousValue);
      let hasReceivedValue = false;
      let hasClosed = false;
      updateState(optimisticValue);
      const subscription = source.subscribe({
        next(value) {
          hasReceivedValue = true;
          updateState(value);
          subscriber.next(value);
        },
        error(error) {
          hasClosed = true;
          rollBack();
          subscriber.error(error);
        },
        complete() {
          hasClosed = true;
          if (!hasReceivedValue) {
            rollBack();
          }
          subscriber.complete();
        },
      });
      return () => {
        if (!hasReceivedValue && !hasClosed) {
          rollBack();
        }
        subscription.unsubscribe();
      };
    });
  };
}
