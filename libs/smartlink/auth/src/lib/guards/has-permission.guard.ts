import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { PermissionService } from '../services';

@Injectable({
  providedIn: 'root',
})
export class HasPermissionGuard implements CanActivate {
  //------------------------------------------------------------------------------------------------------
  //@Public Variables
  //--------------------------------------------------------------------------------------------------------

  //----------------------------------------------------------------------------------------------------
  // @Constructor
  //------------------------------------------------------------------------------------------------------
  constructor(
    private _permissionService: PermissionService,
    private _router: Router,
    private _location: Location
  ) {}

  //--------------------------------------------------------------------------------------------------------
  // @CanActivate Guard
  //----------------------------------------------------------------------------------------------------------
  canActivate(): Observable<boolean> {
    let hasPermission = true;

    if (!this._permissionService.hasConsent) {
      hasPermission = false;
      this._router.navigate(['/license-agreement']);
    } else if (this._permissionService.resetPassword) {
      hasPermission = false;
      this._router.navigate(['/auth/resetpassword']);
    }

    return of(hasPermission);
  }
}
