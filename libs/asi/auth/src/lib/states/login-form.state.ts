import { Injectable } from '@angular/core';
import type { StateContext } from '@ngxs/store';
import { Action, State } from '@ngxs/store';
import { LoginForm } from '../actions';

const LOGIN_STATE_NAME = 'login';
const LOGIN_STATE_DEFAULT = { asi_number: '', username: '', rememberMe: true };

export interface LoginFormStateModel {
  asi_number?: string;
  username: string;
  rememberMe: boolean;
}

@State<LoginFormStateModel>({
  name: LOGIN_STATE_NAME,
  defaults: LOGIN_STATE_DEFAULT,
})
@Injectable()
export class LoginFormState {
  @Action(LoginForm.ClearUserLogin)
  clearUserLogin(ctx: StateContext<LoginFormStateModel>) {
    ctx.patchState(LOGIN_STATE_DEFAULT);
  }

  @Action(LoginForm.StoreUserLogin)
  storeUserLogin(
    ctx: StateContext<LoginFormStateModel>,
    event: LoginForm.StoreUserLogin
  ) {
    const { asi_number, username, rememberMe } = event.credentials;

    ctx.patchState({
      asi_number,
      username,
      rememberMe,
    });
  }
}
