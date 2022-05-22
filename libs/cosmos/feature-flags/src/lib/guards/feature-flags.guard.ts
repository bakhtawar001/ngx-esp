import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  Router,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { FeatureFlagsRouteData as FeatureFlagsRouteData } from '../models';
import { FeatureFlagsService } from '../providers';

@Injectable({ providedIn: 'root' })
export class FeatureFlagsGuard
  implements CanActivateChild, CanLoad, CanActivate
{
  constructor(
    private _router: Router,
    private _featureFlags: FeatureFlagsService
  ) {}

  private isFlagEnabled(flagIdentifier: string): boolean {
    const negateFlag = flagIdentifier[0] === '!';
    if (negateFlag) {
      return !this._featureFlags.isEnabled(flagIdentifier.slice(1));
    }
    return this._featureFlags.isEnabled(flagIdentifier);
  }

  private checkRouteDataFlags(
    routeData: FeatureFlagsRouteData,
    context: Partial<ActivatedRouteSnapshot | Route>
  ): boolean | UrlTree {
    const flagsFromRouteData = routeData?.featureFlags?.matches;
    if (
      typeof flagsFromRouteData !== 'string' &&
      !Array.isArray(flagsFromRouteData)
    ) {
      if (ngDevMode) {
        console.error(
          // tslint:disable-next-line: max-line-length
          'The `FeatureFlagsGuard` requires `featureFlags.matches` to be set to an array or string value in the `data` of your route configuration.',
          context
        );
      }
      return false;
    }

    const featureFlags = new Array<string>().concat(flagsFromRouteData);
    const hasAllFlagsOn = featureFlags.every((flag) =>
      this.isFlagEnabled(flag)
    );

    if (!hasAllFlagsOn) {
      return this.handleUnmatchedFlags(routeData);
    }
    return hasAllFlagsOn;
  }

  private handleUnmatchedFlags(
    routeData: FeatureFlagsRouteData
  ): false | UrlTree {
    const noMatchRedirect = routeData?.featureFlags?.noMatchRedirectsTo;
    if (noMatchRedirect) {
      const urlFragments = ([] as string[]).concat(noMatchRedirect);
      return this._router.createUrlTree(urlFragments);
    }
    return false;
  }

  canLoad(
    route: Partial<Route>
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return this.checkRouteDataFlags(route?.data || {}, route);
  }

  canActivateChild(
    childRoute: Partial<ActivatedRouteSnapshot>
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return this.checkRouteDataFlags(childRoute?.data || {}, childRoute);
  }

  canActivate(
    route: Partial<ActivatedRouteSnapshot>
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return this.checkRouteDataFlags(route?.data || {}, route);
  }
}
