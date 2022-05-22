import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Resolve } from '@angular/router';
import { getParamsObject } from '@cosmos/core';
import { OrderActions } from '@esp/orders';
import { Store } from '@ngxs/store';

@Injectable({ providedIn: 'root' })
export class LoadOrderResolver implements Resolve<void>, CanActivate {
  constructor(private store: Store) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    return this.getParams(route) !== null;
  }

  resolve(route: ActivatedRouteSnapshot): void {
    const params = this.getParams(route);
    this.store.dispatch(new OrderActions.LoadOrder(params.orderId));
  }

  private getParams(route: ActivatedRouteSnapshot) {
    const params = getParamsObject(route.paramMap, ['orderId']);
    return (
      params && {
        orderId: parseInt(params.orderId, 10),
      }
    );
  }
}
