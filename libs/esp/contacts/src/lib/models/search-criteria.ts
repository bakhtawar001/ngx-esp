import { SearchCriteria as EspSearchCriteria } from '@esp/models';

export class SearchCriteria extends EspSearchCriteria {
  constructor(options?: Partial<SearchCriteria>) {
    super(options);

    Object.assign(this, options);
  }
}
