import { OperationStatus, syncLoadProgress } from '@cosmos/state';
import { Action, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { ProjectsApiService } from '../api/projects-api.service';
import { catchError, switchMap, tap } from 'rxjs/operators';
import {
  Aggregations,
  ProjectSearch,
  ResponseAggregations,
  SearchCriteria,
} from '../models';
import {
  ProjectSearchActions,
  ProjectSharedActions,
  ProjectsRecentActions,
} from '../actions';
import { TOAST_MESSAGES } from './toast-messages';
import { ToastActions } from '@cosmos/components/notification';
import { EMPTY } from 'rxjs';
import { AlgoliaService } from '@cosmos/core';

export interface ProjectSearchStateModel {
  criteria: SearchCriteria | null;
  facets?: Aggregations;
  projects: ProjectSearch[];
  total: number;
  loading?: OperationStatus;
}

type LocalStateContext = StateContext<ProjectSearchStateModel>;

const resetState = () => ({
  criteria: new SearchCriteria({
    status: 'Active',
  }),
  projects: [],
  total: 0,
  facets: {},
});

@State<ProjectSearchStateModel>({
  name: 'projectsSearch',
  defaults: resetState(),
})
@Injectable()
export class ProjectsSearchState {
  constructor(
    private readonly service: ProjectsApiService,
    private readonly algoliaService: AlgoliaService
  ) {}

  @Action(ProjectSearchActions.Search)
  private search(
    ctx: LocalStateContext,
    { criteria }: ProjectSearchActions.Search
  ) {
    return this.service
      .query<ProjectSearch, ResponseAggregations>(criteria)
      .pipe(
        syncLoadProgress(ctx),
        tap((res) =>
          ctx.patchState({
            projects: res?.Results,
            total: res?.ResultsTotal,
            criteria,
            facets: {
              ...res.Aggregations,
              Owners: res?.Aggregations?.Owners.map((owner) =>
                JSON.parse(owner)
              ),
            },
          })
        )
      );
  }

  @Action(ProjectSearchActions.TransferOwner)
  private transferOwner(
    ctx: LocalStateContext,
    { payload, ownerId }: ProjectSearchActions.TransferOwner
  ) {
    return this.service.transferOwner(payload.Id, ownerId).pipe(
      switchMap(() => this.waitForTheSearchIndexCompletion(ctx)),
      tap(({ project }) => {
        const message = TOAST_MESSAGES.PROJECT_TRANSFERRED(project);
        ctx.dispatch(new ToastActions.Show(message));
      }),
      catchError(() => {
        const message = TOAST_MESSAGES.PROJECT_NOT_TRANSFERRED(payload);
        ctx.dispatch(new ToastActions.Show(message));
        return EMPTY;
      })
    );
  }

  @Action(ProjectSearchActions.CloseProject)
  private closeProject(
    ctx: LocalStateContext,
    { payload }: ProjectSearchActions.CloseProject
  ) {
    return this.service.closeProject(payload).pipe(
      switchMap(() => this.waitForTheSearchIndexCompletion(ctx)),
      tap(() => {
        const message = TOAST_MESSAGES.PROJECT_CLOSED(payload.Project);
        ctx.dispatch(new ToastActions.Show(message));
      }),
      catchError(() => {
        const message = TOAST_MESSAGES.PROJECT_NOT_CLOSED(payload.Project);
        ctx.dispatch(new ToastActions.Show(message));
        return EMPTY;
      })
    );
  }

  @Action(ProjectSearchActions.ReopenProject)
  private reopenProject(
    ctx: LocalStateContext,
    { project }: ProjectSearchActions.ReopenProject
  ) {
    return this.service.reopenProject(project.Id).pipe(
      switchMap(() => this.waitForTheSearchIndexCompletion(ctx)),
      tap(() => {
        const message = TOAST_MESSAGES.PROJECT_REOPENED(project);
        ctx.dispatch(new ToastActions.Show(message));
      }),
      catchError(() => {
        const message = TOAST_MESSAGES.PROJECT_NOT_REOPENED(project);
        ctx.dispatch(new ToastActions.Show(message));
        return EMPTY;
      })
    );
  }

  private waitForTheSearchIndexCompletion(ctx: LocalStateContext) {
    return this.algoliaService
      .waitUntilAlgoliaIsSynchronized(
        ProjectSharedActions.SearchIndexOperationComplete
      )
      .pipe(
        tap(() =>
          ctx.dispatch([
            new ProjectSearchActions.Search(ctx.getState().criteria),
            new ProjectsRecentActions.Load(),
          ])
        )
      );
  }
}
