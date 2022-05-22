import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Resolve } from '@angular/router';
import { getParamsObject } from '@cosmos/core';
import { Store } from '@ngxs/store';
import { ProductActions } from '../actions';

@Injectable({ providedIn: 'root' })
export class LoadProductResolver implements Resolve<void>, CanActivate {
  constructor(private store: Store) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    return this.getParams(route) !== null;
  }

  resolve(route: ActivatedRouteSnapshot): void {
    const params = this.getParams(route);
    this.store.dispatch(new ProductActions.SelectProduct(params!.productId));
  }

  private getParams(route: ActivatedRouteSnapshot) {
    const params = getParamsObject(route.paramMap, ['id']);
    return (
      params && {
        productId: parseInt(params.id, 10),
      }
    );
  }
}
