import { createPropertySelectors } from '@cosmos/state';
import { TasksState, TasksStateModel } from '../states';

export namespace TasksQueries {
  export const { task: getTask } = createPropertySelectors<TasksStateModel>(
    TasksState
  );
}
