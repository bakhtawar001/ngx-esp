import { Company, Contact, Owner } from '@esp/models';
import {
  CreateCompanyPayload,
  CreateLinkPayload,
  PatchLinkPayload,
  RemoveLinkPayload,
} from '../models';

const ACTION_SCOPE = '[Companies]';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace CompaniesActions {
  export class Get {
    static type = `${ACTION_SCOPE} Get`;

    constructor(public id: number) {}
  }

  export class Patch {
    static readonly type = `${ACTION_SCOPE} Patch`;

    constructor(public payload: Partial<Company>) {}
  }

  export class GetLinks {
    static type = `${ACTION_SCOPE} GetCompanyLinks`;

    constructor(public id: number) {}
  }

  export class CreateLink {
    static type = `${ACTION_SCOPE} CreateLink`;
    constructor(public payload: CreateLinkPayload) {}
  }

  export class PatchLink {
    static type = `${ACTION_SCOPE} PatchLink`;
    constructor(public payload: PatchLinkPayload) {}
  }

  export class RemoveLink {
    static type = `${ACTION_SCOPE} RemoveLink`;
    constructor(public payload: RemoveLinkPayload) {}
  }

  export class Create {
    static readonly type = `${ACTION_SCOPE} Create`;

    constructor(public company: Partial<CreateCompanyPayload>) {}
  }

  export class CreateContact {
    static readonly type = `${ACTION_SCOPE} CreateContact`;

    constructor(public contact: Contact) {}
  }

  export class Delete {
    static readonly type = `${ACTION_SCOPE} Delete`;

    constructor(public company: Company) {}
  }

  export class TransferOwnership {
    static readonly type = `${ACTION_SCOPE} TransferOwnership`;

    constructor(public company: Company, public newOwner: Partial<Owner>) {}
  }

  export class ToggleStatus {
    static readonly type = `${ACTION_SCOPE} ToggleStatus`;

    constructor(public id: number, public isActive: boolean) {}
  }
}
