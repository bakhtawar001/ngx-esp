import type { Contact, ContactSearch, SearchCriteria } from '@esp/models';
import { CreateContactPayload } from '../models/create-contact.payload';

const ACTION_SCOPE = '[ContactsSearch]';

export namespace ContactsSearchActions {
  export class Activate {
    static readonly type = `${ACTION_SCOPE} Activate`;

    constructor(public readonly contact: ContactSearch) {}
  }

  export class Create {
    static readonly type = `${ACTION_SCOPE} Create`;

    constructor(public readonly payload: Contact) {}
  }

  export class Deactivate {
    static readonly type = `${ACTION_SCOPE} Deactivate`;

    constructor(public readonly contact: ContactSearch) {}
  }

  export class Delete {
    static readonly type = `${ACTION_SCOPE} Delete`;

    constructor(public readonly contact: ContactSearch) {}
  }

  export class Search {
    static readonly type = `${ACTION_SCOPE} Search`;

    constructor(public readonly criteria?: SearchCriteria) {}
  }

  export class TransferOwnership {
    static readonly type = `${ACTION_SCOPE} Transfer Owner`;

    constructor(
      public readonly contact: ContactSearch,
      public readonly newOwner: { Id: number; Name: string }
    ) {}
  }
}
