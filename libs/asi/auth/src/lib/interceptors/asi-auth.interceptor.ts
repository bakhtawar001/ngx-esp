import { HttpInterceptor } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AuthServiceConfig, AUTH_SERVICE_CONFIG } from '../types';
import { JwtInterceptor } from './jwt.interceptor';

// Ref: https://github.com/melcor76/interceptors/blob/master/src/app/interceptors/auth.interceptor.ts

@Injectable({
  providedIn: 'root',
})
export class AsiAuthInterceptor
  extends JwtInterceptor
  implements HttpInterceptor {
  constructor(@Inject(AUTH_SERVICE_CONFIG) private config: AuthServiceConfig) {
    super();

    if (this.config.canIntercept) {
      this.canIntercept = this.config.canIntercept;
    }
  }
}
