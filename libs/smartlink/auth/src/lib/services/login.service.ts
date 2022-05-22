import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AUTH_SERVICE_CONFIG } from '@asi/auth';
import { ServiceConfig } from '@cosmos/common';
import { Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TemplateCodes } from '../constants';
import {
  AnonymousResetPassword,
  LicenseAgreement,
  ResetKeys,
  ResetPassword,
} from '../types';
import { PermissionService } from './permission.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  //-------------------------------------------------------
  // @Constructor
  //--------------------------------------------------------
  constructor(
    protected readonly http: HttpClient,
    @Inject(AUTH_SERVICE_CONFIG) protected config: ServiceConfig,
    private readonly _permissionService: PermissionService
  ) {}

  //----------------------------------------------------------------
  // @Public Methods
  //------------------------------------------------------------------

  sendResetEmail(email: string) {
    const body: ResetKeys = {
      primaryEmail: email,
      applicationName: 'encore',
      resetPasswordUrlTemplate: `{{baseUrl}}/auth/resetpassword`,
      templateCode: TemplateCodes.ResetPassword,
    };

    return this.http.post(`${this.config.Url}/resetkeys`, body, {
      headers: { skipAuthHeader: 'true' },
    });
  }

  validateResetKey(resetKey: string) {
    return this.http.get(`${this.config.Url}/resetKeys/${resetKey}/status`, {
      headers: { skipAuthHeader: 'true' },
    });
  }

  resetPassword(resetPassword: ResetPassword) {
    if (
      resetPassword.newPassword.length &&
      resetPassword.newPassword === resetPassword.oldPassword
    ) {
      return throwError(() => 'You cannot use a previous password.');
    }

    return this.http
      .post(`${this.config.Url}/users/reset-password`, resetPassword)
      .pipe(tap(() => this._permissionService.resetPermissions()));
  }

  getLicenseAgreement(): Observable<LicenseAgreement> {
    return this.http.get<LicenseAgreement>(`${this.config.Url}/users/consent`);
  }

  saveLicenseAgreement(signature?: string) {
    const body = {
      electronicSignature: signature,
    };
    return this.http.post(`${this.config.Url}/users/consent`, body);
  }

  anonymousPasswordReset(anonymousParams: AnonymousResetPassword) {
    return this.http
      .post(
        `${this.config.Url}/users/forgot-password?primaryEmail=${anonymousParams.primaryEmail}`,
        anonymousParams,
        {
          headers: { skipAuthHeader: 'true' },
        }
      )
      .pipe(tap(() => this._permissionService.resetPermissions()));
  }
}
