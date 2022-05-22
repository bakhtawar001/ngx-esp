import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { asDispatch, fromSelector } from '@cosmos/state';
import { Order, OrderType } from '@esp/models';
import { OrdersSearchActions, OrdersSearchQueries } from '@esp/orders';
import { SearchPageLocalState } from '@esp/search';
import { getProjectIdFromRoute } from '../utils';

@Injectable()
export class OrderSearchLocalState extends SearchPageLocalState<OrderSearchLocalState> {
  search = asDispatch(OrdersSearchActions.Search);
  _createOrder = asDispatch(OrdersSearchActions.CreateOrder);

  readonly criteria = fromSelector(OrdersSearchQueries.getCriteria);

  readonly ordersLoading = fromSelector(OrdersSearchQueries.isLoading);
  readonly orders = fromSelector(OrdersSearchQueries.getHits);

  readonly creatingOrder = fromSelector(OrdersSearchQueries.creatingOrder);

  total = fromSelector(OrdersSearchQueries.getTotal);

  createOrder(type: OrderType, route: ActivatedRouteSnapshot) {
    const order: Partial<Order> = {
      Type: type,
    };

    const projectId = getProjectIdFromRoute(route);
    if (projectId) {
      order.ProjectId = projectId;
    }

    this._createOrder(order);
  }
}
