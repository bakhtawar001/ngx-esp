import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { StateContext } from '@ngxs/store';
import {
  Action,
  getActionTypeFromInstance,
  NgxsModule,
  State,
  Store
} from '@ngxs/store';
import { throwError, timer } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LogRocketModule } from '../logrocket.module';
import { ActionStatus, LogRocketService } from '../logrocket.service';

describe('LogRocketReduxMiddlewarePlugin', () => {
  function setup() {
    const recorder: any = [];

    @Injectable()
    class MockLogRocketService {
      logReduxEvent(newState: any, action: any, status: ActionStatus): void {
        recorder.push(`${getActionTypeFromInstance(action)} (${status})`);
      }
    }

    type CountriesStateModel = string[];

    class LoadCountries {
      static type = '[Countries] Load countries';
    }

    class LoadCountriesWithError {
      static type = '[Countries] Load countries with error';
    }

    @State<CountriesStateModel>({
      name: 'countries',
      defaults: [],
    })
    class CountriesState {
      @Action(LoadCountries, { cancelUncompleted: true })
      loadCountries(ctx: StateContext<CountriesStateModel>) {
        return timer(0).pipe(
          tap(() => {
            ctx.setState(() => ['Mexico', 'Canada', 'USA']);
          })
        );
      }

      @Action(LoadCountriesWithError)
      loadCountriesWithError() {
        return throwError(new Error('Load countries with error.'));
      }
    }

    TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([CountriesState]),
        LogRocketModule.forRoot({ appId: 'fa0veu/encore', enabled: false }),
      ],
      providers: [
        {
          provide: LogRocketService,
          useClass: MockLogRocketService,
        },
      ],
    });

    const store = TestBed.inject(Store);

    function loadCountries() {
      return store.dispatch(new LoadCountries());
    }

    function loadCountriesWithError() {
      return store.dispatch(new LoadCountriesWithError());
    }

    return { store, recorder, loadCountries, loadCountriesWithError };
  }

  it('should log events to the `logrocket` through the NGXS plugin', async () => {
    // Arrange
    const { recorder, loadCountries, loadCountriesWithError } = setup();

    // Act
    await loadCountries().toPromise();

    // Assert
    expect(recorder).toEqual([
      '@@INIT (DISPATCHED)',
      '@@INIT (SUCCESSFUL)',
      '[Countries] Load countries (DISPATCHED)',
      '[Countries] Load countries (SUCCESSFUL)',
    ]);

    // Explicitly cancel an action.
    loadCountries();
    await loadCountries().toPromise();

    expect(recorder).toEqual([
      '@@INIT (DISPATCHED)',
      '@@INIT (SUCCESSFUL)',
      '[Countries] Load countries (DISPATCHED)',
      '[Countries] Load countries (SUCCESSFUL)',
      '[Countries] Load countries (DISPATCHED)',
      '[Countries] Load countries (CANCELED)',
      '[Countries] Load countries (DISPATCHED)',
      '[Countries] Load countries (SUCCESSFUL)',
    ]);

    loadCountriesWithError();

    expect(recorder).toEqual([
      '@@INIT (DISPATCHED)',
      '@@INIT (SUCCESSFUL)',
      '[Countries] Load countries (DISPATCHED)',
      '[Countries] Load countries (SUCCESSFUL)',
      '[Countries] Load countries (DISPATCHED)',
      '[Countries] Load countries (CANCELED)',
      '[Countries] Load countries (DISPATCHED)',
      '[Countries] Load countries (SUCCESSFUL)',
      '[Countries] Load countries with error (DISPATCHED)',
      '[Countries] Load countries with error (ERRORED)',
    ]);
  });
});
