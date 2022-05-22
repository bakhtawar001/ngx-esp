import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions, NgxsModule, Store } from '@ngxs/store';
import { LoginForm } from '../actions';
import { LoginFormState } from './login-form.state';
import { LoginFormQueries } from '../../index';
import { MockLoginFormStateModel } from '../../../__mocks__/types';

describe('LoginFormState', () => {
  let actions$;
  let http;
  let state;
  let store;

  let loginCredentials;
  let spectator: SpectatorService<LoginFormState>;
  const createService = createServiceFactory({
    service: LoginFormState,
    imports: [HttpClientTestingModule, NgxsModule.forRoot([LoginFormState])],
    providers: [HttpClientTestingModule],
  });

  beforeEach(() => {
    spectator = createService();

    actions$ = spectator.inject(Actions);

    http = spectator.inject(HttpTestingController);

    store = spectator.inject(Store);

    state = MockLoginFormStateModel;

    store.reset({ login: state });

    loginCredentials = {
      asi_number: 'abc',
      username: 'abcd',
      password: 'abcde',
      rememberMe: true,
    };
  });

  it('creates a store', () => {
    expect(store).toBeTruthy();
  });

  describe('Selectors', () => {
    it('Returns state on getFormValues', () => {
      const localState = store.selectSnapshot(LoginFormQueries.getFormValues);

      expect(localState).toMatchObject(state);
    });
  });

  describe('Events', () => {
    it('Resets state on ClearUserLogin', () => {
      // assert state is "Logged In" / remembered
      let localState = store.selectSnapshot((s) => s.login);

      expect(localState.asi_number).toBeTruthy();

      store.dispatch(new LoginForm.ClearUserLogin());

      localState = store.selectSnapshot((s) => s.login);

      expect(localState.asi_number).toBeFalsy();
      expect(localState.username).toBeFalsy();
      expect(localState.rememberMe).toBeTruthy();
    });

    it('Sets state to login form values', () => {
      store.dispatch(new LoginForm.StoreUserLogin(loginCredentials));

      const localState = store.selectSnapshot((s) => s.login);

      expect(localState).toMatchObject({
        asi_number: loginCredentials.asi_number,
        username: loginCredentials.username,
        rememberMe: loginCredentials.rememberMe,
      });
    });
  });
});
