// import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { asAction, mutableProp, readonlyProp } from './core-prop-handlers';
import { LocalState } from './local-state';
import type { StateContext } from './state-context';

describe('LocalState', () => {
  it('should...', () => {
    @Injectable({ providedIn: 'any' })
    class MyState extends LocalState<MyState> {
      abc = 'Hello';

      a = readonlyProp(123);

      b = mutableProp('234');

      setPropA = asAction((ctx: StateContext<MyState>, value: number): void => {
        ctx.setState((state) => ({
          ...state,
          a: state.a + value,
          abc: 'world',
        }));
      });
    }

    const testBed = TestBed.configureTestingModule({});

    const myState = testBed.inject(MyState);

    /* myState.a = 100; */
    expect(myState.b).toEqual('234');
    // myState.b = 'aaa';
    // expect(myState.b).toEqual('aaa');

    expect(myState.abc).toEqual('Hello');
    myState.setPropA(456);
    expect(myState.abc).toEqual('world');

    expect(myState.a).toEqual(579);
  });
});
