import { HttpBackend, HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {
  Auth,
  AuthTokenService,
  AUTH_SERVICE_CONFIG,
  LoginRequest,
  LoginResponse as AsiLoginResponse,
} from '@asi/auth';
import { ServiceConfig } from '@cosmos/common';
import { Store } from '@ngxs/store';
import { EMPTY, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { LoginResponse } from '../types';
import { PermissionService } from './permission.service';

@Injectable({
  providedIn: 'root',
})
export class SmartlinkAuthService {
  //-------------------------------------------------------
  //@Private Variables
  //---------------------------------------------------------
  private http: HttpClient;

  //-------------------------------------------------------
  // @Constructor
  //--------------------------------------------------------
  constructor(
    private readonly store: Store,
    @Inject(AUTH_SERVICE_CONFIG) protected config: ServiceConfig,
    private readonly tokenService: AuthTokenService,
    private readonly _permissionService: PermissionService,
    handler: HttpBackend
  ) {
    this.http = new HttpClient(handler);
  }

  //----------------------------------------------------------------
  // @Public Methods
  //----------------------------------------------------------------

  getToken() {
    const token = this.tokenService.token;

    if (!this.tokenService.isExpired) {
      return of(token);
    }

    return this.refreshToken().pipe(map((session) => session?.access_token));
  }

  login(credentials: LoginRequest) {
    const { username, password } = credentials;
    return this.http
      .post<LoginResponse>(`${this.config.Url}`, { username, password })
      .pipe(
        tap((session: LoginResponse) =>
          this._permissionService.setPermissions(
            session.UserInfo.NeedConsent,
            session.UserInfo.PasswordResetRequired
          )
        ),
        map(this._mapLoginResponse)
      );
  }

  logout() {
    // call service?
    return of(true).pipe(tap(() => this._permissionService.clearPermissions()));
  }

  refreshToken() {
    const refreshToken = this.tokenService.refreshToken;

    if (!refreshToken) {
      return EMPTY;
    }

    return this.http
      .post<LoginResponse>(`${this.config.Url}/refresh`, { refreshToken })
      .pipe(
        map(this._mapLoginResponse),
        tap((session) =>
          this.store.dispatch(new Auth.RefreshSessionSuccess(session))
        )
      );
  }

  private _mapLoginResponse(session: LoginResponse): AsiLoginResponse {
    return {
      access_token: session.AccessToken,
      refresh_token: session.RefreshToken,
      expires_in: session.ExpiresIn,
      token_type: session.TokenType,
    };
  }
}
