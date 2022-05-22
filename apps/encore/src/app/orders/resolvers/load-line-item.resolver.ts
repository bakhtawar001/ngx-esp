import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Resolve } from '@angular/router';
import { getParamsObject } from '@cosmos/core';
import { OrderLineItemActions } from '@esp/orders';
import { Store } from '@ngxs/store';

@Injectable({ providedIn: 'root' })
export class LoadLineItemResolver implements Resolve<void>, CanActivate {
  constructor(private store: Store) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    return this.getParams(route) !== null;
  }

  resolve(route: ActivatedRouteSnapshot): void {
    const params = this.getParams(route);
    this.store.dispatch(
      new OrderLineItemActions.LoadOrderLineItem(
        params.orderId,
        params.lineItemId
      )
    );
  }

  private getParams(route: ActivatedRouteSnapshot) {
    const params = getParamsObject(route.paramMap, ['orderId', 'lineItemId']);
    return (
      params && {
        orderId: parseInt(params.orderId, 10),
        lineItemId: parseInt(params.lineItemId, 10),
      }
    );
  }
}
