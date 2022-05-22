import { Injectable } from '@angular/core';
import { TaskSearch } from '@esp/models';
import { SearchCriteria, SearchResult } from '@esp/models';
import type { StateContext } from '@ngxs/store';
import { Action, State } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';
import { tap } from 'rxjs/operators';
import { TaskSearchActions } from '../actions';
import { TasksService } from '../services';

export interface TasksSearchStateModel extends SearchResult<TaskSearch> {
  criteria: SearchCriteria | null;
  orderTasks: SearchResult<TaskSearch>;
  contactTasks: SearchResult<TaskSearch>;
  companyTasks: SearchResult<TaskSearch>;
}

type ThisStateModel = TasksSearchStateModel;
type ThisStateContext = StateContext<ThisStateModel>;

@State<TasksSearchStateModel>({
  name: 'taskssearch',
  defaults: {
    criteria: new SearchCriteria(),
    Results: null,
    ResultsTotal: 0,
    Aggregations: null,
    orderTasks: null,
    contactTasks: null,
    companyTasks: null,
  },
})
@Injectable()
export class TasksSearchState {
  constructor(private _service: TasksService) {}

  @Action(TaskSearchActions.Search)
  private search(ctx: ThisStateContext, event: TaskSearchActions.Search) {
    return this._service.query<TaskSearch>(event.criteria).pipe(
      tap((res) => {
        ctx.patchState({
          ...res,
        });
      })
    );
  }

  @Action(TaskSearchActions.SaveTask)
  private saveTask(ctx: ThisStateContext, event: TaskSearchActions.SaveTask) {
    return this._service.save(event.task).pipe(
      tap((res) => {
        const task = this._service.toSearchModel(res);
        ctx.setState(patch({ Results: upsertTask(task) }));
      })
    );
  }

  @Action(TaskSearchActions.UpsertTask)
  upsertTask(ctx: ThisStateContext, event: TaskSearchActions.UpsertTask) {
    ctx.setState(patch({ Results: upsertTask(event.task) }));
  }

  @Action(TaskSearchActions.GetTaskByCompanyId)
  getTaskByCompanyId(
    ctx: ThisStateContext,
    event: TaskSearchActions.GetTaskByCompanyId
  ) {
    return this._service
      .query<TaskSearch>({
        from: 1,
        size: 50,
        filters: {
          Company: { terms: [`${event.id}`] },
        },
      })
      .pipe(
        tap((res) => {
          ctx.patchState({
            companyTasks: res,
          });
        })
      );
  }

  @Action(TaskSearchActions.GetTaskByContactId)
  getTaskByContactId(
    ctx: ThisStateContext,
    event: TaskSearchActions.GetTaskByContactId
  ) {
    return this._service
      .query<TaskSearch>({
        from: 1,
        size: 50,
        id: event.id,
      })
      .pipe(
        tap((res) => {
          ctx.patchState({
            contactTasks: res,
          });
        })
      );
  }

  @Action(TaskSearchActions.GetTaskByOrderId)
  getTaskByOrderId(
    ctx: ThisStateContext,
    event: TaskSearchActions.GetTaskByOrderId
  ) {
    return this._service
      .query<TaskSearch>({
        from: 1,
        size: 50,
        filters: {
          Order: { terms: [event.id?.toString()] },
        },
      })
      .pipe(
        tap((res) => {
          ctx.patchState({
            orderTasks: res,
          });
        })
      );
  }
}

function upsertTask(task: TaskSearch) {
  return (Results: TaskSearch[]) => {
    const index = Results.findIndex((res) => res.Id === task.Id);
    const newResults = [...Results];
    if (index >= 0) {
      newResults.splice(index, 1, task);
    } else {
      newResults.unshift(task);
    }
    return newResults;
  };
}
