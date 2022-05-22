import { Order, SearchCriteria } from '@esp/models';

const ACTION_SCOPE = '[OrdersSearch]';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace OrdersSearchActions {
  export class Search {
    static type = `${ACTION_SCOPE} Search`;
    constructor(public criteria: SearchCriteria) {}
  }

  export class CreateOrder {
    static type = `${ACTION_SCOPE} Create Order`;
    constructor(public order: Partial<Order>) {}
  }
}
