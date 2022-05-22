import { createObservableResult } from '@cosmos/testing';
import { EMPTY, Observable, OperatorFunction, Subscription } from 'rxjs';
import { catchError, retry, switchMap } from 'rxjs/operators';
import { optimisticUpdate } from './optimistic-update.util';
describe(`optimisticUpdate`, () => {
  function setup(options?: {
    initialValue?: string;
    optimisticValue?: string;
    autoStart?: boolean;
    additionalPipe?: OperatorFunction<string, string>;
  }) {
    const _options: Required<typeof options> = {
      initialValue: 'initialValue',
      optimisticValue: 'newValueToBe',
      autoStart: true,
      additionalPipe: undefined!,
      ...(options || {}),
    };
    const updater = createObservableResult<string>({ multiValue: true });
    const state = { value: _options.initialValue };
    const recorder: string[] = [];
    const record = (value: string) => recorder.push(value);
    const someUpdateServiceCall = () => updater.get$();
    const serviceCall$ = someUpdateServiceCall().pipe(
      optimisticUpdate(_options.optimisticValue, {
        getValue: () => state.value,
        setValue: (value) => {
          record(value);
          state.value = value;
        },
      }),
      _options.additionalPipe || ((a) => a),
      catchError(() => {
        record('--Error caught--');
        return EMPTY;
      })
    );
    record(state.value);
    if (_options.autoStart) {
      record('--Start--');
      serviceCall$.subscribe();
    }
    return {
      state,
      updater,
      recorder,
      record,
      startServiceCall() {
        const subs = new Subscription();
        if (!_options.autoStart) {
          subs.add(serviceCall$.subscribe());
        }
        return subs;
      },
    };
  }

  describe(`[Typical]`, () => {
    it(`should not set the optimistic state until the update operation is started`, () => {
      // Arrange & Act
      const { state, recorder } = setup({
        initialValue: 'oldValue',
        autoStart: false,
      });
      // Assert
      expect(state.value).toEqual('oldValue');
      expect(recorder).toEqual(['oldValue']);
    });

    it(`should set the optimistic state as the update operation is started`, () => {
      // Arrange
      const { state, startServiceCall, recorder, record } = setup({
        initialValue: 'oldValue',
        optimisticValue: 'newValueToBe',
        autoStart: false,
      });
      record('--Start--');
      // Act
      startServiceCall();
      // Assert
      expect(state.value).toEqual('newValueToBe');
      expect(recorder).toEqual(['oldValue', '--Start--', 'newValueToBe']);
    });

    it(`should set the final state from the update operation`, () => {
      // Arrange
      const { state, updater, recorder, record } = setup();
      record('--Next--');
      // Act
      updater.next('newValueFromService');
      // Assert
      expect(state.value).toEqual('newValueFromService');
      expect(recorder).toEqual([
        'initialValue',
        '--Start--',
        'newValueToBe',
        '--Next--',
        'newValueFromService',
      ]);
    });

    it(`should have the final state from the update operation after completion`, () => {
      // Arrange
      const { state, updater, recorder, record } = setup();
      record('--Next--');
      updater.next('newValueFromService');
      record('--Done--');
      // Act
      updater.done();
      // Assert
      expect(state.value).toEqual('newValueFromService');
      expect(recorder).toEqual([
        'initialValue',
        '--Start--',
        'newValueToBe',
        '--Next--',
        'newValueFromService',
        '--Done--',
      ]);
    });
  });

  describe(`[Empty]`, () => {
    it(`should revert to the original state if the update operation is empty`, () => {
      // Arrange
      const { state, updater, recorder, record } = setup({
        initialValue: 'oldValue',
      });
      record('--Done--');
      // Act
      updater.done();
      // Assert
      expect(state.value).toEqual('oldValue');
      expect(recorder).toEqual([
        'oldValue',
        '--Start--',
        'newValueToBe',
        '--Done--',
        'oldValue',
      ]);
    });
  });

  describe(`[Unsubscribed]`, () => {
    it(`should revert to the original state if the update operation is empty`, () => {
      // Arrange
      const { state, startServiceCall, recorder, record } = setup({
        initialValue: 'oldValue',
        optimisticValue: 'newValue',
        autoStart: false,
      });
      record('--Start--');
      const subscription = startServiceCall();
      const before = state.value;
      record('--Unsubscribe--');
      // Act
      subscription.unsubscribe();
      // Assert
      const after = state.value;
      expect(before).toEqual('newValue');
      expect(after).toEqual('oldValue');
      expect(recorder).toEqual([
        'oldValue',
        '--Start--',
        'newValue',
        '--Unsubscribe--',
        'oldValue',
      ]);
    });

    it(`should have the final state from the update operation if unsubscribed after emitting once`, () => {
      // Arrange
      const { state, updater, startServiceCall, recorder, record } = setup({
        initialValue: 'oldValue',
        optimisticValue: 'newValue',
        autoStart: false,
      });
      record('--Start--');
      const subscription = startServiceCall();
      record('--Next--');
      updater.next('newValueFromService');
      const before = state.value;
      record('--Unsubscribe--');
      // Act
      subscription.unsubscribe();
      // Assert
      const after = state.value;
      expect(before).toEqual('newValueFromService');
      expect(after).toEqual('newValueFromService');
      expect(recorder).toEqual([
        'oldValue',
        '--Start--',
        'newValue',
        '--Next--',
        'newValueFromService',
        '--Unsubscribe--',
      ]);
    });
  });

  describe(`[Errored]`, () => {
    it(`should have the original state after update operation error`, () => {
      // Arrange
      const { state, updater, recorder, record } = setup();
      record('--Error--');
      // Act
      updater.errorAndReset(new Error('Failed to update!'));
      // Assert
      expect(state.value).toEqual('initialValue');
      expect(recorder).toEqual([
        'initialValue',
        '--Start--',
        'newValueToBe',
        '--Error--',
        'initialValue',
        '--Error caught--',
      ]);
    });

    it(`should have the original state after update operation returns value but then errors`, () => {
      // Arrange
      const { state, updater, recorder, record } = setup();
      record('--Next--');
      updater.next('I think I suceeded!');
      record('--Error--');
      // Act
      updater.errorAndReset(new Error('Failed to update!'));
      // Assert
      expect(state.value).toEqual('initialValue');
      expect(recorder).toEqual([
        'initialValue',
        '--Start--',
        'newValueToBe',
        '--Next--',
        'I think I suceeded!',
        '--Error--',
        'initialValue',
        '--Error caught--',
      ]);
    });
  });

  describe(`[Retried Operation]`, () => {
    it(`should set the optimistic state when the update operation is starting to retry after error`, () => {
      // Arrange
      const { state, updater, recorder, record } = setup({
        additionalPipe: retry(1),
      });
      record('--Error--');
      // Act
      updater.errorAndReset(new Error('Failed to update!'));
      // Assert
      record('--Retrying--');
      expect(state.value).toEqual('newValueToBe');
      expect(recorder).toEqual([
        'initialValue',
        '--Start--',
        'newValueToBe',
        '--Error--',
        'initialValue',
        'newValueToBe',
        '--Retrying--',
      ]);
    });

    it(`should have the final state from the update operation after retry sucessfully completes`, () => {
      // Arrange
      const { state, updater, recorder, record } = setup({
        additionalPipe: retry(1),
      });
      record('--Error--');
      updater.errorAndReset(new Error('Failed to update!'));
      // Act
      record('--Next--');
      updater.next('newValueFromService');
      // Assert
      expect(state.value).toEqual('newValueFromService');
      expect(recorder).toEqual([
        'initialValue',
        '--Start--',
        'newValueToBe',
        '--Error--',
        'initialValue',
        'newValueToBe',
        '--Next--',
        'newValueFromService',
      ]);
    });
  });

  describe(`[Multi Value]`, () => {
    it(`should set each state from emitted from the update operation`, () => {
      // Arrange
      const { state, updater, recorder, record } = setup();
      record('--Next--');
      updater.next('newValueFromService1');
      record('--Next 2--');
      updater.next('newValueFromService2');
      record('--Next 3--');
      // Act
      updater.next('newValueFromService3');
      // Assert
      expect(state.value).toEqual('newValueFromService3');
      expect(recorder).toEqual([
        'initialValue',
        '--Start--',
        'newValueToBe',
        '--Next--',
        'newValueFromService1',
        '--Next 2--',
        'newValueFromService2',
        '--Next 3--',
        'newValueFromService3',
      ]);
    });

    it(`should have the final state from the update operation after completion`, () => {
      // Arrange
      const { state, updater, recorder, record } = setup();
      record('--Next--');
      updater.next('newValueFromService1');
      record('--Next 2--');
      updater.next('newValueFromService2');
      record('--Next 3--');
      updater.next('newValueFromService3');
      record('--Done--');
      // Act
      updater.done();
      // Assert
      expect(state.value).toEqual('newValueFromService3');
      expect(recorder).toEqual([
        'initialValue',
        '--Start--',
        'newValueToBe',
        '--Next--',
        'newValueFromService1',
        '--Next 2--',
        'newValueFromService2',
        '--Next 3--',
        'newValueFromService3',
        '--Done--',
      ]);
    });

    it(`should have the original state after update operation emits many and then errors`, () => {
      // Arrange
      const { state, updater, recorder, record } = setup();
      record('--Next--');
      updater.next('newValueFromService1');
      record('--Next 2--');
      updater.next('newValueFromService2');
      record('--Next 3--');
      updater.next('newValueFromService3');
      record('--Error--');
      // Act
      updater.errorAndReset(new Error('It died!'));
      // Assert
      expect(state.value).toEqual('initialValue');
      expect(recorder).toEqual([
        'initialValue',
        '--Start--',
        'newValueToBe',
        '--Next--',
        'newValueFromService1',
        '--Next 2--',
        'newValueFromService2',
        '--Next 3--',
        'newValueFromService3',
        '--Error--',
        'initialValue',
        '--Error caught--',
      ]);
    });
  });

  describe(`[Replaced]`, () => {
    it(`should do correct operations for switched observables`, () => {
      // Arrange
      const outer = createObservableResult<{
        value: string;
        service$: Observable<string>;
      }>({
        multiValue: true,
      });
      const updater1 = createObservableResult<string>({ multiValue: true });
      const updater2 = createObservableResult<string>({ multiValue: true });
      const state = { value: 'initialValue' };
      const recorder: string[] = [];
      const record = (value: string) => recorder.push(value);
      const main$ = outer.get$().pipe(
        switchMap((action) =>
          action.service$.pipe(
            optimisticUpdate(action.value, {
              getValue: () => state.value,
              setValue: (value) => {
                record(value);
                state.value = value;
              },
            })
          )
        )
      );
      // Act
      record(state.value);
      record('--Start--');
      main$.subscribe();
      record('--First action--');
      outer.next({ service$: updater1.get$(), value: 'updateOne' });
      record('--Replacing action--');
      outer.next({ service$: updater2.get$(), value: 'updateTwo' });
      record('--Value From Two--');
      updater2.next('updateTwoFromService');
      record('--Outer Completion--');
      outer.done();
      // Assert
      expect(state.value).toEqual('updateTwoFromService');
      expect(recorder).toEqual([
        'initialValue',
        '--Start--',
        '--First action--',
        'updateOne',
        '--Replacing action--',
        'initialValue',
        'updateTwo',
        '--Value From Two--',
        'updateTwoFromService',
        '--Outer Completion--',
      ]);
    });
  });
});
