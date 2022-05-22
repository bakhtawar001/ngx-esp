import { SearchCriteria } from '@esp/models';

const ACTION_SCOPE = '[NotesSearch]';

export namespace NotesSearchActions {
  export class Search {
    static type = `${ACTION_SCOPE} Search`;

    constructor(public criteria: SearchCriteria) {}
  }

  export class GetNoteByContactId {
    static type = `${ACTION_SCOPE} GetNoteByContactId`;

    constructor(public id: number) {}
  }

  export class GetNoteByCompanyId {
    static type = `${ACTION_SCOPE} GetNoteByCompanyId`;

    constructor(public id: number) {}
  }
}
