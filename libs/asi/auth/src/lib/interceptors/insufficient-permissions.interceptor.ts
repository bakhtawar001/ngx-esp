import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthServiceConfig, AUTH_SERVICE_CONFIG } from '../types';

@Injectable()
export class AsiInsufficientPermissionsInterceptor implements HttpInterceptor {
  private readonly canIntercept!: (request?: HttpRequest<unknown>) => boolean;

  constructor(
    @Inject(AUTH_SERVICE_CONFIG) private readonly config: AuthServiceConfig,
    private readonly router: Router
  ) {
    if (this.config.canIntercept) {
      this.canIntercept = this.config.canIntercept;
    }
  }

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (!this.canIntercept(req)) {
      return next.handle(req);
    }

    return next.handle(req).pipe(
      catchError((error) => {
        if (error.status === 403) {
          this.router.navigate(['/unauthorized']);
        }

        throw error;
      })
    );
  }
}
