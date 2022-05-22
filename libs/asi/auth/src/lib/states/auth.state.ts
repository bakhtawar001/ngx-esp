import { Injectable } from '@angular/core';
import { IUser } from '@cosmos/common';
import {
  getDefaultOperationStatus,
  ModelWithLoadingStatus,
  syncLoadProgress,
} from '@cosmos/state';
import { Navigate } from '@ngxs/router-plugin';
import type { StateContext } from '@ngxs/store';
import { Action, NgxsAfterBootstrap, NgxsOnInit, State } from '@ngxs/store';
import { firstValueFrom, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { Auth, LoginForm } from '../actions';
import { AsiAuthService, AuthTokenService, UserService } from '../services';
import { AuthSession } from '../types';
import { LoginFormState } from './login-form.state';

export interface AuthStateModel extends ModelWithLoadingStatus {
  isInitialised: boolean;
  user?: IUser | null;
  session: AuthSession | null;
}

const AUTH_STATE_DEFAULT: AuthStateModel = {
  isInitialised: false,
  loading: getDefaultOperationStatus(),
  user: null,
  session: null,
};

@State<AuthStateModel>({
  name: 'auth',
  defaults: AUTH_STATE_DEFAULT,
  children: [LoginFormState],
})
@Injectable()
export class AuthState implements NgxsOnInit, NgxsAfterBootstrap {
  constructor(
    private readonly tokenService: AuthTokenService,
    private authService: AsiAuthService,
    private userService: UserService
  ) {}

  ngxsOnInit(ctx: StateContext<AuthStateModel>) {
    const { session } = ctx.getState();

    this.tokenService.reset(session);
  }

  /**
   * Dispatch CheckSession on start
   */
  ngxsAfterBootstrap(ctx: StateContext<AuthStateModel>) {
    ctx.dispatch(new Auth.CheckSession());
  }

  /**
   * Commands
   */
  @Action(Auth.CheckSession)
  checkSession(ctx: StateContext<AuthStateModel>) {
    return this.userService.getUser().pipe(
      // should wait until token synced
      syncLoadProgress(ctx),
      tap((user) => this.setStateOnLoginSuccess(ctx, user)),
      catchError(() => {
        const { user } = ctx.getState();
        if (user) {
          ctx.dispatch(new Auth.Logout());
        }
        return of(null);
      }),
      tap(() => {
        ctx.patchState({ isInitialised: true });
      })
    );
  }

  @Action(Auth.LoginWithCredentials)
  async loginWithCredentials(
    ctx: StateContext<AuthStateModel>,
    action: Auth.LoginWithCredentials
  ) {
    ctx.patchState({ loading: getDefaultOperationStatus() });

    const { credentials } = action;

    if (credentials.rememberMe) {
      ctx.dispatch(new LoginForm.StoreUserLogin(credentials));
    } else {
      ctx.dispatch(new LoginForm.ClearUserLogin());
    }

    try {
      const user = await firstValueFrom(
        this.authService.login(credentials).pipe(
          syncLoadProgress(ctx, {
            getErrorMessage: this.getLoginError,
          }),
          tap((session) => ctx.dispatch(new Auth.LoginSuccess(session))),
          switchMap((session) =>
            this.userService.getUser(session?.access_token)
          )
        )
      );

      this.setStateOnLoginSuccess(ctx, user);

      const urlParts = action.redirectUrl?.split('?');
      const params = urlParts?.[1]
        ? Object.fromEntries(new URLSearchParams(urlParts[1]).entries())
        : {};

      ctx.dispatch(new Navigate([urlParts?.[0] ?? '/'], params));
    } catch (error) {
      this.setStateOnLogoutOrFailure(ctx, action.redirectUrl);
    }
  }

  @Action(Auth.Logout)
  logout(ctx: StateContext<AuthStateModel>, event: Auth.Logout) {
    return this.authService
      .logout()
      .pipe(tap(() => this.setStateOnLogoutOrFailure(ctx, event.redirectUrl)));
  }

  @Action([Auth.LoginSuccess, Auth.RefreshSessionSuccess])
  updateSession(
    ctx: StateContext<AuthStateModel>,
    event: Auth.LoginSuccess | Auth.RefreshSessionSuccess
  ) {
    const session = {
      ...event.session,
      expires_at: this._mapExpiresInToExpiresAt(event.session.expires_in),
    };

    ctx.patchState({
      session,
    });

    this.tokenService.reset(session);
  }

  /**
   * Events
   */
  setStateOnLoginSuccess(ctx: StateContext<AuthStateModel>, user: IUser) {
    ctx.patchState({
      user,
    });
  }

  setStateOnLogoutOrFailure(
    ctx: StateContext<AuthStateModel>,
    redirectUrl?: string
  ) {
    ctx.patchState({
      user: null,
      session: null,
    });

    this.tokenService.reset();

    const authUrl = '/auth/login';

    if (!redirectUrl?.startsWith(authUrl)) {
      const params = redirectUrl ? { redirectUrl } : {};

      ctx.dispatch(new Navigate([authUrl], params));
    }
  }

  getLoginError(error: Error): any {
    return (error as any)['error'] ?? error;
  }

  private _mapExpiresInToExpiresAt(expiresIn?: string) {
    if (!expiresIn) {
      return null;
    }

    const now = Date.now();
    return now + parseInt(expiresIn, 10) * 1000;
  }
}
