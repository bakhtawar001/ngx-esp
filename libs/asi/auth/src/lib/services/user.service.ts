import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { User } from '../types';
import { AuthTokenService } from './auth-token.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http: HttpClient;

  /**
   * Constructor
   *
   * @param {HttpBackend} handler
   */
  constructor(private tokenService: AuthTokenService, handler: HttpBackend) {
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
      return throwError(() => 'Unauthenticated');
    }

    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${token ?? this.tokenService.token}`
    );

    return this.http.get<User>(`/login/account/info`, {
      headers,
    });
  }
}
