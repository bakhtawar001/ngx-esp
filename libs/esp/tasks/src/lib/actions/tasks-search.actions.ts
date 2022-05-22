import { Task, TaskSearch } from '@esp/models';
import { SearchCriteria } from '@esp/models';

const ACTION_SCOPE = '[TaskSearch]';

export namespace TaskSearchActions {
  export class Search {
    static type = `${ACTION_SCOPE} Search`;
    constructor(public criteria: SearchCriteria) {}
  }

  export class UpsertTask {
    static type = `${ACTION_SCOPE} UpsertTask`;
    constructor(public task: TaskSearch) {}
  }

  export class SaveTask {
    static type = `${ACTION_SCOPE} Save Task`;
    constructor(public task: Task) {}
  }

  export class GetTaskByCompanyId {
    static type = `${ACTION_SCOPE} GetTaskByCompanyId`;

    constructor(public id: number) {}
  }

  export class GetTaskByContactId {
    static type = `${ACTION_SCOPE} GetTaskByContactId`;

    constructor(public id: number) {}
  }

  export class GetTaskByOrderId {
    static type = `${ACTION_SCOPE} GetTaskByOrderId`;

    constructor(public id: number) {}
  }
}
