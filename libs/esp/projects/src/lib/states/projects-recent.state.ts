import { Injectable } from '@angular/core';
import { ModelWithLoadingStatus, syncLoadProgress } from '@cosmos/state';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { AuthFacade } from '@esp/auth';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { SearchCriteria } from '@esp/models';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { SearchStateModel } from '@esp/search';
import { Action, State, StateContext } from '@ngxs/store';
import { EMPTY } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { ProjectsRecentActions } from '../actions';
import { ProjectsApiService } from '../api/projects-api.service';
import { ProjectSearch } from '../models';

export interface ProjectsRecentStateModel
  extends SearchStateModel<ProjectSearch>,
    ModelWithLoadingStatus {}

type ThisStateModel = ProjectsRecentStateModel;
type ThisStateContext = StateContext<ThisStateModel>;

const MAX_ELEMENTS = 5;

function resetCriteria(): SearchCriteria {
  return new SearchCriteria({
    from: 1,
    size: MAX_ELEMENTS,
    status: 'Active',
  });
}

@State<ProjectsRecentStateModel>({
  name: 'projectsRecent',
  defaults: {
    criteria: resetCriteria(),
  },
})
@Injectable()
export class ProjectsRecentState {
  constructor(
    private readonly auth: AuthFacade,
    private readonly service: ProjectsApiService
  ) {}

  ngxsOnInit(ctx: ThisStateContext): void {
    this.auth.profile$.subscribe({
      next: (user) => {
        if (user) {
          ctx.dispatch(new ProjectsRecentActions.Load());
        } else {
          ctx.setState({
            criteria: resetCriteria(),
          });
        }
      },
    });
  }

  @Action(ProjectsRecentActions.Load)
  private load(ctx: ThisStateContext) {
    return this.service.searchRecent(ctx.getState().criteria).pipe(
      syncLoadProgress(ctx),
      switchMap((searchRecentResult) => {
        if (searchRecentResult.ResultsTotal >= MAX_ELEMENTS) {
          ctx.patchState({
            result: searchRecentResult,
          });
          return EMPTY;
        }

        return this.service
          .query<ProjectSearch>({
            ...ctx.getState().criteria,
            size: MAX_ELEMENTS - searchRecentResult.ResultsTotal,
            excludeList: searchRecentResult.Results.map(
              (project) => project.Id
            ).join(','),
          })
          .pipe(
            syncLoadProgress(ctx),
            tap((searchResult) => {
              const newResults = [
                ...searchRecentResult.Results,
                ...searchResult.Results,
              ];

              ctx.patchState({
                result: {
                  ...searchResult,
                  ResultsTotal: newResults.length,
                  Results: newResults,
                },
              });
            })
          );
      })
    );
  }

  @Action(ProjectsRecentActions.Search)
  private search(
    ctx: ThisStateContext,
    { criteria }: ProjectsRecentActions.Search
  ) {
    if (!criteria.term?.length) {
      ctx.patchState({ criteria });
      return ctx.dispatch(new ProjectsRecentActions.Load());
    }

    return this.service.query<ProjectSearch>(criteria).pipe(
      syncLoadProgress(ctx),
      tap((result) =>
        ctx.patchState({
          result,
          criteria,
        })
      )
    );
  }
}
