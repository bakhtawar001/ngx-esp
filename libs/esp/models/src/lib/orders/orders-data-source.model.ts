import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';

import { Order } from './order.model';
import { OrdersSearchState } from '../store';

export class OrdersDataSource implements DataSource<Order> {
  /**
   * Constructor
   *
   * @param {Store} _store
   */
  constructor(private _store: Store) {}

  /**
   * Connect function called by the table to retrieve one stream containing the data to render.
   *
   * @returns {Observable<Order[]>}
   */
  connect(): Observable<Order[]> {
    return this._store.select(OrdersSearchState.getResults);
  }

  /**
   * Disconnect
   */
  disconnect(): void {}
}
