import { RecentlyViewedTypes } from '../states/model';
import { AddEntity } from './_internal.actions';

function AddRecentEntity<T extends RecentlyViewedTypes>(key: T) {
  return class AddRecentEntity extends AddEntity<T> {
    constructor(recentEntity: AddEntity<T>['recentEntity']) {
      super(key, recentEntity);
    }
  };
}

export namespace RecentsActions {
  // export class AddRecentCollection extends AddRecentEntity('collection') { }

  export class AddRecentCompany extends AddRecentEntity(
    RecentlyViewedTypes.companies
  ) {}

  export class AddRecentOrder extends AddRecentEntity(
    RecentlyViewedTypes.orders
  ) {}

  export class AddRecentProduct extends AddRecentEntity(
    RecentlyViewedTypes.products
  ) {}

  export class AddRecentSupplier extends AddRecentEntity(
    RecentlyViewedTypes.suppliers
  ) {}

  export class AddRecentTask extends AddRecentEntity(
    RecentlyViewedTypes.tasks
  ) {}
}
