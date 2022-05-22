import { BaseProject } from '@esp/models';

const ACTION_SCOPE = '[ProjectShared]';

export namespace ProjectSharedActions {
  export class SearchIndexOperationComplete {
    static readonly type = `${ACTION_SCOPE} Search Index Operation complete`;

    constructor(public project?: BaseProject) {}
  }
}
