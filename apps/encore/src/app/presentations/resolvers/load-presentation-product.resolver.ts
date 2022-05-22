import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Resolve } from '@angular/router';
import { Store } from '@ngxs/store';

import { getParamsObject } from '@cosmos/core';
import { PresentationProductActions } from '@esp/presentations';

@Injectable({ providedIn: 'root' })
export class LoadPresentationProductResolver
  implements Resolve<void>, CanActivate
{
  constructor(private store: Store) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    return this.getParams(route) !== null;
  }

  resolve(route: ActivatedRouteSnapshot): void {
    const params = this.getParams(route);
    this.store.dispatch(new PresentationProductActions.Get(params.productId));
  }

  private getParams(route: ActivatedRouteSnapshot) {
    const params = getParamsObject(route.paramMap, ['productId']);
    return (
      params && {
        productId: parseInt(params.productId, 10),
      }
    );
  }
}
