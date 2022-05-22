import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RestClient } from '@esp/common/http';
import { LineItem, Order, Task } from '@esp/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrdersService extends RestClient<Order> {
  override url = 'orders';
  override pk = 'Id';

  tasks(orderId: number | string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.uri}/${orderId}/tasks`);
  }

  getLineItem(orderId: number, lineItemId: number) {
    return this.http.get<LineItem>(
      `${this.uri}/${orderId}/lineitems/${lineItemId}`
    );
  }

  updateLineItem(orderId: number, lineItem: LineItem, updateTaxes = 'none') {
    const params = new HttpParams().append('updateTaxes', updateTaxes);

    return this.http.put<LineItem>(
      `${this.uri}/${orderId}/lineitems/${lineItem.Id}`,
      lineItem,
      { params }
    );
  }

  deleteLineItem(orderId: number, lineItemId: number) {
    return this.http.delete(`${this.uri}/${orderId}/lineitems/${lineItemId}`);
  }
}
