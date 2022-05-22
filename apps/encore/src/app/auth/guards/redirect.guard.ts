import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthFacade } from '@esp/auth';

@Injectable({
  providedIn: 'root',
})
export class RedirectGuard implements CanActivate {
  constructor(
    private _authFacade: AuthFacade,
    private _router: Router,
    private _location: Location
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const loggedIn = !!this._authFacade.user;

    if (!loggedIn) {
      this._authFacade.logout(this._location.path());
    } else {
      this._router.navigateByUrl(route.data.defaultPath);
    }

    return false;
  }
}
