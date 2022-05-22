import { Injectable } from '@angular/core';
import { Company, Order, Task } from '@esp/models';
import { Store } from '@ngxs/store';
import { Product } from '@smartlink/models';
import type { Supplier } from '@smartlink/suppliers';
import { RecentsActions } from '../actions';
import { RecentsQueries } from '../queries/recents.queries';

@Injectable({ providedIn: 'root' })
export class RecentlyViewedFacade {
  companies$ = this.store.select(RecentsQueries.getCompanies);
  orders$ = this.store.select(RecentsQueries.getOrders);
  products$ = this.store.select(RecentsQueries.getProducts);
  suppliers$ = this.store.select(RecentsQueries.getSuppliers);
  tasks$ = this.store.select(RecentsQueries.getTasks);
  recentlyViewed$ = this.store.select(RecentsQueries.getAllRecentlyViewed);

  constructor(private store: Store) {}

  addCompany(company: Company) {
    this.store.dispatch(new RecentsActions.AddRecentCompany(company));
    return this.companies$;
  }

  addOrder(order: Order) {
    this.store.dispatch(new RecentsActions.AddRecentOrder(order));
    return this.orders$;
  }

  addProduct(product: Product) {
    this.store.dispatch(new RecentsActions.AddRecentProduct(product));
    return this.products$;
  }

  addSupplier(supplier: Supplier) {
    this.store.dispatch(new RecentsActions.AddRecentSupplier(supplier));
    return this.suppliers$;
  }

  addTask(task: Task) {
    this.store.dispatch(new RecentsActions.AddRecentTask(task));
    return this.tasks$;
  }
}
