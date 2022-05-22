import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { inject } from '@angular/core/testing';
import {
  MockAuthServiceConfig,
  MockAuthStateModel,
  MockStateType,
} from '../../../__mocks__/index';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { OperationStatus } from '@cosmos/state';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { ESP_SERVICE_CONFIG } from '@esp/service-configs';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Navigate } from '@ngxs/router-plugin';
import { Actions, NgxsModule, ofActionSuccessful, Store } from '@ngxs/store';
import { Auth, LoginForm } from '../actions';
import { AuthQueries } from '../queries';
import { AUTH_SERVICE_CONFIG } from '../types';
import { AuthState } from './auth.state';
import { LoginFormState } from './login-form.state';

const serviceConfig = { Url: 'test' };

describe('AuthState', () => {
  let actions$;
  let http;
  let state;
  let _store: Store;

  let authState;
  let loginCredentials;
  let _authState;
  let spectator: SpectatorService<AuthState>;
  const createService = createServiceFactory({
    service: AuthState,
    imports: [
      HttpClientTestingModule,
      NgxsModule.forRoot([AuthState, LoginFormState]),
    ],
    providers: [
      {
        provide: AUTH_SERVICE_CONFIG,
        useValue: MockAuthServiceConfig,
      },
      {
        provide: ESP_SERVICE_CONFIG,
        useValue: serviceConfig,
      },
    ],
  });
  beforeEach(() => {
    spectator = createService();

    actions$ = spectator.inject(Actions);

    http = spectator.inject(HttpTestingController);

    _store = spectator.inject(Store);

    state = MockAuthStateModel.state(MockStateType.LoggedIn);

    _store.reset({ auth: state });

    _authState = spectator.inject(AuthState);

    authState = {
      accessToken: 'token',
      displayName: 'test',
    };

    loginCredentials = {
      asi_number: 'abc',
      username: 'abcd',
      password: 'abcde',
      rememberMe: true,
    };
  });

  it('creates a store', inject([Store], (store: Store) => {
    expect(store).toBeTruthy();
  }));

  describe('Selectors', () => {
    it('returns user on calling getUser', () => {
      const user = _store.selectSnapshot(AuthQueries.getUser);

      expect(user).toBe(state.user);
    });
  });

  describe('Commands', () => {
    it('returns logged in when CheckSession dispatched', () => {
      _store
        .dispatch(new Auth.CheckSession())
        .toPromise()
        .then((res) => expect(res.auth.loggedIn).toEqual(state.loggedIn));
    });

    it('updates state to loading when calling LoginWithCredentials', () => {
      _store.reset({
        auth: MockAuthStateModel.state(MockStateType.Initialised),
      });

      _store.dispatch(new Auth.LoginWithCredentials(loginCredentials));

      const loading = _store.selectSnapshot(
        (s) => s.auth.loading as OperationStatus
      );

      expect(loading.inProgress).toBe(true);
      expect(loading.error).toBe(null);
    });

    xit('dispatches StoreUserLogin when calling LoginWithCredentials with rememberMe', (done) => {
      const res = http.expectOne(
        `${MockAuthServiceConfig.Url}${MockAuthServiceConfig.TokenPath}`
      );

      res.flush({ access_token: authState.accessToken });

      const nextRes = http.expectOne(`${serviceConfig.Url}/users/me`);

      nextRes.flush({ Name: authState.displayName });

      _store.reset({
        auth: MockAuthStateModel.state(MockStateType.Initialised),
      });

      _store.dispatch(new Auth.LoginWithCredentials(loginCredentials));

      actions$
        .pipe(ofActionSuccessful(LoginForm.StoreUserLogin))
        .subscribe((action) => {
          expect(action).toBeTruthy();
          http.verify();
          done();
        });
    });

    xit('dispatches ClearUserLogin when calling LoginWithCredentials without rememberMe', (done) => {
      actions$
        .pipe(ofActionSuccessful(LoginForm.ClearUserLogin))
        .subscribe((action) => {
          expect(action).toBeTruthy();
          done();
        });

      _store.reset({
        auth: MockAuthStateModel.state(MockStateType.Initialised),
      });

      loginCredentials.rememberMe = false;

      _store.dispatch(new Auth.LoginWithCredentials(loginCredentials));

      const res = http.expectOne(
        `${MockAuthServiceConfig.Url}${MockAuthServiceConfig.TokenPath}`
      );

      res.flush({});

      const nextRes = http.expectOne(`${serviceConfig.Url}/users/me`);

      nextRes.flush({ Name: authState.displayName });

      http.verify();
    });

    xit('dispatches LoginSuccess when dispatching LoginWithCredentials with successful authService response', (done) => {
      actions$
        .pipe(ofActionSuccessful(Auth.CheckSession))
        .subscribe((action) => {
          expect(action).toBeTruthy();
          done();
        });

      _store.reset({
        auth: MockAuthStateModel.state(MockStateType.Initialised),
      });

      _store.dispatch(new Auth.LoginWithCredentials(loginCredentials));

      const res = http.expectOne(
        `${MockAuthServiceConfig.Url}${MockAuthServiceConfig.TokenPath}`
      );

      res.flush({});

      const nextRes = http.expectOne(`${serviceConfig.Url}/users/me`);

      nextRes.flush({ Name: authState.displayName });

      http.verify();
    });
  });

  describe('Events', () => {
    describe('setStateOnLogoutOrFailure', () => {
      let ctxSpy;

      beforeEach(() => {
        ctxSpy = {
          patchState: jest.fn(),
          dispatch: jest.fn(),
        };
      });

      it('dispatches navigate with redirect url', () => {
        const redirectUrl = 'test';

        _authState.setStateOnLogoutOrFailure(ctxSpy, redirectUrl);

        expect(ctxSpy.dispatch).toHaveBeenCalledWith(
          new Navigate(['/auth/login'], { redirectUrl })
        );
      });

      it('ignores auth url for redirect', () => {
        _authState.setStateOnLogoutOrFailure(ctxSpy);

        expect(ctxSpy.dispatch).toHaveBeenCalledWith(
          new Navigate(['/auth/login'], {})
        );
      });
    });
  });
});
