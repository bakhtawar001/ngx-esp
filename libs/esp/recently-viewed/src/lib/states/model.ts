import { Company, Order, Task } from '@esp/models';

import type { Product } from '@smartlink/models';
import type { Supplier } from '@smartlink/suppliers';

export const enum RecentlyViewedTypes {
  companies = 'companies',
  orders = 'orders',
  products = 'products',
  suppliers = 'suppliers',
  tasks = 'tasks',
}

export interface RecentlyViewedStateModel {
  [RecentlyViewedTypes.companies]: Company[];
  [RecentlyViewedTypes.orders]: Order[];
  [RecentlyViewedTypes.products]: Product[];
  [RecentlyViewedTypes.suppliers]: Supplier[];
  [RecentlyViewedTypes.tasks]: Task[];
}
