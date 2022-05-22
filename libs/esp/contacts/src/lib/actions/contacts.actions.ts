import type { Contact } from '@esp/models';

const ACTION_SCOPE = '[Contacts]';

export namespace ContactsActions {
  export class Activate {
    static readonly type = `${ACTION_SCOPE} Activate`;

    constructor(public readonly contact: Contact) {}
  }

  export class Deactivate {
    static readonly type = `${ACTION_SCOPE} Deactivate`;

    constructor(public readonly contact: Contact) {}
  }

  export class Delete {
    static readonly type = `${ACTION_SCOPE} Delete`;

    constructor(public readonly contact: Contact) {}
  }

  export class Get {
    static readonly type = `${ACTION_SCOPE} Get`;

    constructor(public readonly id: number) {}
  }

  export class Patch {
    static readonly type = `${ACTION_SCOPE} Patch`;

    constructor(public readonly payload: Partial<Contact>) {}
  }

  export class TransferOwnership {
    static readonly type = `${ACTION_SCOPE} Transfer Owner`;

    constructor(
      public readonly contact: Contact,
      public readonly newOwner: { Id: number; Name: string }
    ) {}
  }
}
