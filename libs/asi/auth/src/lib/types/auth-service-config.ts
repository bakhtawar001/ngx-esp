import { HttpRequest } from '@angular/common/http';
import { InjectionToken } from '@angular/core';

export const AUTH_SERVICE_CONFIG = new InjectionToken<AuthServiceConfig>(
  'Authentication Service Configuration'
);

export class AuthServiceConfig {
  Url? = 'https://authentication.asicentral.com';
  TokenPath? = '/oauth2/token';
  StorageStrategy: 'cookie' | 'localStorage' = 'cookie';
  AuthorizationHeader?: string;
  canIntercept?: (request?: HttpRequest<any>) => boolean = () => true;

  constructor(options?: Partial<AuthServiceConfig>) {
    Object.assign(this, options);
  }
}
