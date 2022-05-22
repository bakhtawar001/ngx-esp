import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Data,
  Route,
  Router,
  UrlSegment,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthFacade } from '../services';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(
    private _authFacade: AuthFacade,
    private _router: Router,
    private _location: Location
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    // const fullPath = route.pathFromRoot
    //   .map((v) => v.url.map((segment) => segment.toString()).join('/'))
    //   .join('/');

    // Guest

    const loggedIn = !!this._authFacade.user;

    if (!loggedIn) {
      this._authFacade.logout(this._location.path());
    }

    const isAuthorized = loggedIn && this.hasAccess(route.data);

    return of(isAuthorized);
  }

  canLoad(route: Route, segments: UrlSegment[]): boolean {
    // Guest

    const loggedIn = !!this._authFacade.user;

    if (!loggedIn) {
      this._authFacade.logout();

      return false;
    }

    // const fullPath = segments.reduce((path, segment) => {
    //   return `${path}/${segment.path}`;
    // }, '');

    return this.hasAccess(route.data);
  }

  private hasAccess(data?: Data): boolean {
    const user = this._authFacade.user;
    const roles: string[] = data?.roles;
    const path = this._location.path();

    const hasAccess =
      user && (!roles?.length || roles.some((role) => user.hasRole(role)));

    if (!hasAccess) {
      this._router
        .navigate(['unauthorized'], {
          skipLocationChange: true,
        })
        .then(() => {
          this._location.replaceState(path);
        });
    }

    return hasAccess;
  }
}
