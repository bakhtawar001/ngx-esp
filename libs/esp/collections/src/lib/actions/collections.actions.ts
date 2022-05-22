import { Collection, CollectionStatus } from '../models';

const ACTION_SCOPE = '[Collections]';

export namespace CollectionsActions {
  export class Delete {
    static readonly type = `${ACTION_SCOPE} Delete`;

    constructor(public collection: Collection) {}
  }

  export class Get {
    static readonly type = `${ACTION_SCOPE} Load`;

    constructor(public id: number) {}
  }

  export class Save {
    static readonly type = `${ACTION_SCOPE} Save`;

    constructor(public payload: Collection) {}
  }

  export class SaveStatus {
    static readonly type = `${ACTION_SCOPE} Save status`;

    constructor(public payload: Collection, public status: CollectionStatus) {}
  }

  export class TransferOwner {
    static readonly type = `${ACTION_SCOPE} Transfer owner`;

    constructor(public payload: Collection, public ownerId: number) {}
  }

  export class SearchIndexOperationComplete {
    static readonly type = `${ACTION_SCOPE} Search Index Operation complete`;

    constructor(public collection?: Collection) {}
  }
}
