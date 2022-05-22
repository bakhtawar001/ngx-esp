import { Injectable, Injector } from '@angular/core';

import { ToastActions } from '@cosmos/components/notification';
import { AlgoliaService } from '@cosmos/core';
import {
  EntityStateModel,
  ModelWithLoadingStatus,
  optimisticUpdate,
  setEntityStateItem,
  syncLoadProgress,
} from '@cosmos/state';
import { Project } from '@esp/models';
import {
  PresentationsActions,
  PresentationsQueries,
  PresentationsToastMessagesPresenter,
} from '@esp/presentations';
import { Navigate } from '@ngxs/router-plugin';
import { Action, State, StateContext, Store } from '@ngxs/store';
import { EMPTY, of } from 'rxjs';
import { catchError, mergeMap, switchMap, tap } from 'rxjs/operators';

import {
  ProjectActions,
  ProjectSharedActions,
  ProjectsRecentActions,
} from '../actions';
import { ProjectsApiService } from '../api/projects-api.service';
import { TOAST_MESSAGES } from './toast-messages';

const ACCEPTABLE_CACHE_SIZE = 5 as const;

export interface ProjectsStateModel
  extends ModelWithLoadingStatus,
    EntityStateModel<Project> {}

type ThisStateModel = ProjectsStateModel;
type ThisStateContext = StateContext<ThisStateModel>;

@State<ProjectsStateModel>({
  name: 'projects',
  defaults: {
    items: {},
    itemIds: [],
  },
})
@Injectable()
export class ProjectsState {
  private _presentationsToastMessagesPresenter: PresentationsToastMessagesPresenter | null =
    null;

  constructor(
    private readonly _injector: Injector,
    private readonly _service: ProjectsApiService,
    private readonly _algoliaService: AlgoliaService,
    private readonly _store: Store
  ) {}

  private get presentationsToastMessagesPresenter(): PresentationsToastMessagesPresenter {
    // Retrieve lazily to avoid cyclic dependency error.
    return (
      this._presentationsToastMessagesPresenter ||
      (this._presentationsToastMessagesPresenter = this._injector.get(
        PresentationsToastMessagesPresenter
      ))
    );
  }

  @Action(ProjectActions.CreateProject)
  private createProject(
    ctx: ThisStateContext,
    action: ProjectActions.CreateProject
  ) {
    return this._service.create(action.project).pipe(
      mergeMap((project) => {
        if (project.Id) {
          ctx.setState(setEntityStateItem(project.Id, project));
        }

        ctx.dispatch(
          new ToastActions.Show(
            TOAST_MESSAGES.PROJECT_CREATED(project.Name, project.Customer.Name)
          )
        );

        return ctx
          .dispatch(
            new PresentationsActions.Create(project.Id, action.productIds)
          )
          .pipe(
            tap(() => {
              ctx.dispatch(new Navigate(['/projects', project.Id]));

              if (action.productIds.length > 0) {
                this.presentationsToastMessagesPresenter.productsAdded(
                  this._store.selectSnapshot(
                    PresentationsQueries.getPresentation
                  ),
                  action.project.Name,
                  action.productIds
                );
              }
            })
          );
      }),
      catchError((error) => {
        ctx.dispatch(
          new ToastActions.Show(TOAST_MESSAGES.PROJECT_NOT_CREATED())
        );

        throw error;
      })
    );
  }

  @Action(ProjectActions.Get)
  private get(ctx: ThisStateContext, { id }: ProjectActions.Get) {
    ctx.patchState({ currentId: id });

    return this._service.get(id).pipe(
      syncLoadProgress(ctx),
      tap((project) =>
        ctx.setState(
          setEntityStateItem(id, project, { cacheSize: ACCEPTABLE_CACHE_SIZE })
        )
      )
    );
  }

  @Action(ProjectActions.Update)
  private updateProject(
    ctx: ThisStateContext,
    { payload }: ProjectActions.Update
  ) {
    return this._service.update(payload).pipe(
      // has to be before optimistic update call, otherwise toast is not detected in unit tests
      catchError((error) => {
        ctx.dispatch(
          new ToastActions.Show(TOAST_MESSAGES.PROJECT_NOT_UPDATED())
        );

        throw error;
      }),
      optimisticUpdate<Project>(payload, {
        getValue: () => ctx.getState().items[payload.Id],
        setValue: (updatedProject: Project) =>
          ctx.setState(setEntityStateItem(updatedProject.Id, updatedProject)),
      }),
      tap(() =>
        ctx.dispatch(
          new ToastActions.Show(
            TOAST_MESSAGES.PROJECT_FOR_COMPANY_UPDATED(
              payload.Name,
              payload.Customer.Name
            )
          )
        )
      )
    );
  }

  @Action(ProjectActions.Patch)
  private patch(ctx: ThisStateContext, { payload }: ProjectActions.Patch) {
    const state = ctx.getState();
    const project = state.items[state.currentId];
    const updatedProject = { ...project, ...payload } as Project;

    return this._service.save(updatedProject).pipe(
      optimisticUpdate<Project>(updatedProject, {
        getValue: () => ctx.getState().items[payload.Id],
        setValue: () =>
          ctx.setState(setEntityStateItem(updatedProject.Id, updatedProject)),
      }),
      tap(() =>
        ctx.dispatch(
          new ToastActions.Show(
            TOAST_MESSAGES.PROJECT_UPDATED(updatedProject.Name)
          )
        )
      ),
      catchError(() => {
        ctx.dispatch(
          new ToastActions.Show(TOAST_MESSAGES.PROJECT_NOT_UPDATED())
        );

        return EMPTY;
      })
    );
  }

  @Action(ProjectActions.TransferOwner)
  private transferOwner(
    ctx: ThisStateContext,
    { payload, ownerId }: ProjectActions.TransferOwner
  ) {
    return this._service.transferOwner(payload.Id, ownerId).pipe(
      switchMap((project) => {
        const state = ctx.getState();

        if (state.currentId !== project.Id) {
          return of(null);
        }

        if (project.IsVisible) {
          ctx.dispatch(new ProjectActions.Get(payload.Id));
          return of(null);
        } else {
          ctx.patchState({ currentId: null });

          return this._algoliaService
            .waitUntilAlgoliaIsSynchronized(
              ProjectSharedActions.SearchIndexOperationComplete
            )
            .pipe(
              tap(() =>
                ctx.dispatch([
                  new ProjectsRecentActions.Load(),
                  new Navigate(['/projects']),
                ])
              )
            );
        }
      }),
      tap(() => {
        const message = TOAST_MESSAGES.PROJECT_TRANSFERRED(payload);
        ctx.dispatch(new ToastActions.Show(message));
      }),
      catchError(() => {
        const message = TOAST_MESSAGES.PROJECT_NOT_TRANSFERRED(payload);
        ctx.dispatch(new ToastActions.Show(message));
        return EMPTY;
      })
    );
  }

  @Action(ProjectActions.CloseProject)
  private closeProject(
    ctx: ThisStateContext,
    { payload }: ProjectActions.CloseProject
  ) {
    return this._service.closeProject(payload).pipe(
      tap(() => {
        ctx.dispatch(new ProjectActions.Get(payload.Project.Id));
      }),
      tap(() => {
        const message = TOAST_MESSAGES.PROJECT_CLOSED(payload.Project);
        ctx.dispatch(new ToastActions.Show(message));
      }),
      switchMap(() =>
        this._algoliaService
          .waitUntilAlgoliaIsSynchronized(
            ProjectSharedActions.SearchIndexOperationComplete
          )
          .pipe(tap(() => ctx.dispatch(new ProjectsRecentActions.Load())))
      ),
      catchError(() => {
        const message = TOAST_MESSAGES.PROJECT_NOT_CLOSED(payload.Project);
        ctx.dispatch(new ToastActions.Show(message));
        return EMPTY;
      })
    );
  }

  @Action(ProjectActions.ReopenProject)
  private reopenProject(
    ctx: ThisStateContext,
    { project }: ProjectActions.ReopenProject
  ) {
    return this._service.reopenProject(project.Id).pipe(
      tap(() => {
        ctx.dispatch(new ProjectActions.Get(project.Id));
      }),
      tap(() => {
        const message = TOAST_MESSAGES.PROJECT_REOPENED(project);
        ctx.dispatch(new ToastActions.Show(message));
      }),
      switchMap(() =>
        this._algoliaService
          .waitUntilAlgoliaIsSynchronized(
            ProjectSharedActions.SearchIndexOperationComplete
          )
          .pipe(tap(() => ctx.dispatch(new ProjectsRecentActions.Load())))
      ),
      catchError(() => {
        const message = TOAST_MESSAGES.PROJECT_NOT_REOPENED(project);
        ctx.dispatch(new ToastActions.Show(message));
        return EMPTY;
      })
    );
  }
}
