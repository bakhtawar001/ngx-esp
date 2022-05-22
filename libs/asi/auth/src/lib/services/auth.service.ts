import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { EMPTY, of } from 'rxjs';
import {
  AuthServiceConfig,
  AUTH_SERVICE_CONFIG,
  LoginRequest,
  LoginResponse,
} from '../types';
import { AuthTokenService } from './auth-token.service';

@Injectable({
  providedIn: 'root',
})
export class AsiAuthService {
  private http: HttpClient;

  /**
   * Constructor
   *
   * @param {HttpBackend} handler
   */
  constructor(
    @Inject(AUTH_SERVICE_CONFIG) public config: AuthServiceConfig,
    private tokenService: AuthTokenService,
    handler: HttpBackend
  ) {
    this.http = new HttpClient(handler);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  getToken() {
    return of(this.tokenService.token);
  }

  refreshToken() {
    return EMPTY;
  }

  login(credentials: LoginRequest, grant_type = 'password') {
    const options = {
      headers: new HttpHeaders().set(
        'Authorization',
        this.config.AuthorizationHeader!
      ),
    };

    const body = {
      grant_type,
      ...credentials,
      scope: 'AsiNumberOptional',
    };

    return this.http.post<LoginResponse>(
      `${this.config.Url}${this.config.TokenPath}`,
      body,
      options
    );
  }

  logout() {
    // call service?
    return of(true);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------
}
