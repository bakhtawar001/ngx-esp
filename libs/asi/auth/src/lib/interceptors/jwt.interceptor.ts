import { Location } from '@angular/common';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AsiAuthService } from '../services';
import { Auth } from '../actions';
import { Store } from '@ngxs/store';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

// Ref: https://github.com/melcor76/interceptors/blob/master/src/app/interceptors/auth.interceptor.ts

@Injectable({
  providedIn: 'root',
})
export class JwtInterceptor implements HttpInterceptor {
  protected readonly _authService: AsiAuthService;
  protected readonly _location: Location;
  protected readonly _store: Store;
  protected _inflightAuthRequest: Observable<string> | null = null;

  canIntercept = (req: HttpRequest<any>) => true;

  constructor() {
    this._authService = inject(AsiAuthService);
    this._location = inject(Location);
    this._store = inject(Store);
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (
      !this.canIntercept(req) ||
      req.headers.get('skipAuthHeader') === 'true'
    ) {
      return next.handle(req);
    }

    return this._jwtRequest(req, next);
  }

  interceptToken(req: HttpRequest<any>, token: string) {
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
    }

    return req;
  }

  handleErrors(
    error: HttpErrorResponse,
    req: HttpRequest<any>,
    next: HttpHandler,
    retryRequest?: boolean
  ) {
    return error.status === 401
      ? this.handle401(error, req, next, retryRequest)
      : throwError(() => error);
  }

  handleLogout() {
    const redirectUrl = this._location.path();

    this._store.dispatch(new Auth.Logout(redirectUrl));

    return EMPTY;
  }

  handle401(
    error: HttpErrorResponse,
    req: HttpRequest<any>,
    next: HttpHandler,
    retryRequest?: boolean
  ): Observable<HttpEvent<any>> | Observable<never> {
    if (retryRequest) {
      return this.handleLogout();
    }

    if (!this._inflightAuthRequest) {
      this._inflightAuthRequest = this._authService.refreshToken();

      if (!this._inflightAuthRequest) {
        return this.handleLogout();
      }
    }

    return this._jwtRequest(req, next, true);
  }

  private _jwtRequest(
    req: HttpRequest<any>,
    next: HttpHandler,
    retryRequest?: boolean
  ) {
    if (!this._inflightAuthRequest) {
      this._inflightAuthRequest = this._authService.getToken();
    }

    return this._inflightAuthRequest.pipe(
      switchMap((token) => {
        this._inflightAuthRequest = null;

        req = this.interceptToken(req, token);

        return next
          .handle(req)
          .pipe(
            catchError((error) =>
              this.handleErrors(error, req, next, retryRequest)
            )
          );
      })
    );
  }
}
