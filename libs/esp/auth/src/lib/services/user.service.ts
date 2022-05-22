import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AuthTokenService } from '@asi/auth';
import { ServiceConfig } from '@cosmos/common';
import { ESP_SERVICE_CONFIG } from '@esp/service-configs';
import { throwError } from 'rxjs';
import { User } from '../types';

@Injectable({
  providedIn: 'root',
})
export class EspUserService {
  private http: HttpClient;

  /**
   * Constructor
   *
   * @param {HttpBackend} handler
   */
  constructor(
    @Inject(ESP_SERVICE_CONFIG) public espConfig: ServiceConfig,
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

  public getUser(token?: string) {
    if (!(token ?? this.tokenService.token)) {
      return throwError('Unauthenticated');
    }

    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${token ?? this.tokenService.token}`
    );

    return this.http.get<User>(`${this.espConfig.Url}/users/me`, {
      headers,
    });
  }

  public updateFullName(givenName: string, familyName: string) {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.tokenService.token}`
    );

    return this.http.put(
      `${this.espConfig.Url}/users/fullName`,
      { givenName, familyName },
      { headers }
    );
  }

  public updateUserName(newUserName: string) {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.tokenService.token}`
    );

    return this.http.put(
      `${this.espConfig.Url}/users/userName`,
      { newUserName },
      { headers }
    );
  }

  public updateLoginEmail(email: string) {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.tokenService.token}`
    );

    return this.http.put(
      `${this.espConfig.Url}/users/email`,
      { email },
      { headers }
    );
  }
}
