import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  UrlTree,
} from '@angular/router';
import { SearchCriteria } from '@esp/models';
import { OrdersSearchActions, OrdersSearchQueries } from '@esp/orders';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getProjectIdFromRoute } from '../utils';

@Injectable()
export class CurrentOrderGuard implements CanActivate {
  constructor(private readonly router: Router, private readonly store: Store) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    // When orders page is opened as a temporary standalone page
    // load all orders, and when it's opened as project overview
    // page - filter orders for current project
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

    // If there is at least one order available then do not show
    // empty state page and redirect to order's detail page
    return this.store.dispatch(new OrdersSearchActions.Search(criteria)).pipe(
      map(() => {
        const result = this.store.selectSnapshot(OrdersSearchQueries.getResult);
        const order = result.Results[0];
        if (!order) {
          return true;
        }

        // If accessing project overview page redirect to nested "Quotes & Order" tab
        if (projectId) {
          return this.router.createUrlTree([
            `/projects/${projectId}/orders/${order.Id}`,
          ]);
        }

        return this.router.createUrlTree([`/orders/${order.Id}`]);
      })
    );
  }
}
