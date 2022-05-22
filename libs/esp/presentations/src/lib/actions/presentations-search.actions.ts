const ACTION_SCOPE = '[Search Presentations]';
import { SearchCriteria as EspSearchCriteria } from '@esp/models';

export namespace PresentationsSearchActions {
  export class Search {
    static readonly type = `${ACTION_SCOPE} Search presentations`;
    constructor(public criteria: EspSearchCriteria) {}
  }
}
