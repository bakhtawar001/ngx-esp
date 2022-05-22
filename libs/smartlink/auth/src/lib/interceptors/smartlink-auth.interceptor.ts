import { HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { JwtInterceptor } from '@asi/auth';
import { ServiceConfig } from '@cosmos/common';
import { SMARTLINK_SERVICE_CONFIG } from '@smartlink/common';

@Injectable({
  providedIn: 'root',
})
export class SmartlinkAuthInterceptor
  extends JwtInterceptor
  implements HttpInterceptor
{
  private _baseUrl = this.config.Url.replace('/v1', '');

  override canIntercept = (req: HttpRequest<any>): boolean =>
    req.url.startsWith(this._baseUrl);

  constructor(
    @Inject(SMARTLINK_SERVICE_CONFIG) protected config: ServiceConfig
  ) {
    super();
  }

  override interceptToken(req: HttpRequest<any>, token: string) {
    if (
      !req.url.endsWith('.json') &&
      req.url.startsWith(`${this._baseUrl}/v`)
    ) {
      req = req.clone({ url: `${req.url}.json` });
    }

    const authHeader = this.authHeader(token);

    if (authHeader) {
      req = req.clone({
        setHeaders: {
          Authorization: authHeader,
        },
      });
    }

    return req;
  }

  authHeader(token: string) {
    return token?.split(' ')?.length > 1 ? token : token && `Bearer ${token}`;
  }
}
