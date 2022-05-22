import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Resolve } from '@angular/router';
import { getParamsObject } from '@cosmos/core';
import { Store } from '@ngxs/store';
import { CollectionsActions } from '../actions';

@Injectable({ providedIn: 'root' })
export class LoadCollectionResolver implements Resolve<void>, CanActivate {
  constructor(private store: Store) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    return this.getParams(route) !== null;
  }

  resolve(route: ActivatedRouteSnapshot): void {
    const params = this.getParams(route);
    params &&
      this.store.dispatch(new CollectionsActions.Get(params.collectionId));
  }

  private getParams(route: ActivatedRouteSnapshot) {
    const params = getParamsObject(route.paramMap, ['id']);
    return (
      params && {
        collectionId: parseInt(params.id, 10),
      }
    );
  }
}
