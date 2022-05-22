import { SearchCriteria as EspSearchCriteria } from '@esp/models';

import { CollectionStatus } from './collection.model';

export class SearchCriteria extends EspSearchCriteria {
  override status?: CollectionStatus;

  constructor(options?: Partial<SearchCriteria>) {
    super(options);

    Object.assign(this, options);
  }
}
