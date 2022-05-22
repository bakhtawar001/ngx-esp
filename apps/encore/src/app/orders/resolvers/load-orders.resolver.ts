import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Resolve } from '@angular/router';
import { SearchCriteria } from '@esp/models';
import { OrdersSearchActions } from '@esp/orders';
import { Store } from '@ngxs/store';
import { getProjectIdFromRoute } from '../utils';

@Injectable()
export class LoadOrdersResolver implements Resolve<void>, CanActivate {
  constructor(private store: Store) {}

  canActivate(): boolean {
    return true;
  }

  resolve(route: ActivatedRouteSnapshot): void {
    const projectId = getProjectIdFromRoute(route);
    const criteria = new SearchCriteria({
      filters: {},
      sortBy: {
        date: 'desc',
      },
    });
    if (projectId) {
      criteria.filters = {
        ProjectIds: {
          behavior: 'Any',
          terms: [projectId],
        },
      };
    }

    this.store.dispatch(new OrdersSearchActions.Search(criteria));
  }
}
