import { Injectable } from '@angular/core';
import { Task } from '@esp/models';
import { RecentlyViewedFacade } from '@esp/recently-viewed';
import type { StateContext } from '@ngxs/store';
import { Action, State } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { TasksActions } from '../actions';
import { TasksService } from '../services';
import { TasksSearchState } from './tasks-search.state';

export interface TasksStateModel {
  task: Task;
}

type ThisStateModel = TasksStateModel;
type ThisStateContext = StateContext<ThisStateModel>;

@State<TasksStateModel>({
  name: 'tasks',
  defaults: {
    task: null,
  },
  children: [TasksSearchState],
})
@Injectable()
export class TasksState {
  constructor(
    private recentlyViewed: RecentlyViewedFacade,
    private service: TasksService
  ) {}

  @Action(TasksActions.GenerateNewTask)
  generateNewTask(ctx: ThisStateContext, event: TasksActions.GenerateNewTask) {
    const newTask = this.service.generate();
    this.recentlyViewed.addTask(newTask);
    ctx.patchState({
      task: newTask,
    });
  }

  @Action(TasksActions.GetTaskById)
  getTaskById(ctx: ThisStateContext, event: TasksActions.GetTaskById) {
    return this.service.get(event.id).pipe(
      tap((res) => {
        if (res && res.Id) {
          this.recentlyViewed.addTask(res);
        }
        ctx.patchState({
          task: res,
        });
      })
    );
  }

  @Action(TasksActions.ClearSelectedTask)
  clearSelectedTask(
    ctx: ThisStateContext,
    event: TasksActions.ClearSelectedTask
  ) {
    ctx.patchState({
      task: null,
    });
  }
}
