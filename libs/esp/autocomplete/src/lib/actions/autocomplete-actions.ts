import { AutocompleteParams } from '../models';

const ACTION_SCOPE = '[Autocomplete]';

export namespace AutocompleteActions {
  export class SearchParties {
    static type = `${ACTION_SCOPE} SearchParties`;

    constructor(public params: AutocompleteParams) {}
  }

  export class SearchUsers {
    static type = `${ACTION_SCOPE} SearchUsers`;

    constructor(public params: AutocompleteParams) {}
  }

  export class SearchUsersAndTeams {
    static type = `${ACTION_SCOPE} SearchUsersAndTeams`;

    constructor(public params: AutocompleteParams) {}
  }
}
