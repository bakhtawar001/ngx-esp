import { createPropertySelectors, createSelectorX } from '@cosmos/state';
import {
  TasksSearchState,
  TasksSearchStateModel,
} from '../states/tasks-search.state';

export namespace TasksSearchQueries {
  export const {
    companyTasks: getCompanyTasks,
    contactTasks: getContactTasks,
    criteria: getCriteria,
    orderTasks: getOrderTasks,
    Results: getResults,
  } = createPropertySelectors<TasksSearchStateModel>(TasksSearchState);

  export const getSearchResult = createSelectorX(
    [TasksSearchState],
    (state: TasksSearchStateModel) => state
  );
}
