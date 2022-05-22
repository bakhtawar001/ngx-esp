import { SearchCriteria as EspSearchCriteria } from '@esp/models';

export interface SupplierSearchCriteria extends SearchCriteria {
  excludeTerm?: string;
}

export class SearchCriteria extends EspSearchCriteria {
  constructor(options?: Partial<SearchCriteria>) {
    super(options);

    Object.assign(this, options);
  }
}
