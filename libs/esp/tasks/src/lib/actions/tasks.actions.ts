const ACTION_SCOPE = '[TasksState]';

export namespace TasksActions {
  export class GetTaskById {
    static type = `${ACTION_SCOPE} GetTaskById`;

    constructor(public id: number) {}
  }

  export class GenerateNewTask {
    static type = `${ACTION_SCOPE} GenerateNewTask`;
  }

  export class ClearSelectedTask {
    static type = `${ACTION_SCOPE} ClearSelectedTask`;
  }
}
