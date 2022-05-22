import { SearchStateModel } from '@esp/search';
import { ModelWithLoadingStatus, syncLoadProgress } from '@cosmos/state';
import { Action, State, StateContext } from '@ngxs/store';
import { CompanySearch } from '@esp/models';
import { Injectable } from '@angular/core';
import { CompaniesService } from '../services';
import { switchMap, tap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { CompaniesRecentActions } from '../actions';
import { SearchCriteria } from '../models';

export interface CompaniesRecentStateModel
  extends SearchStateModel<CompanySearch>,
    ModelWithLoadingStatus {}

type ThisStateModel = CompaniesRecentStateModel;
type ThisStateContext = StateContext<ThisStateModel>;

const MAX_ELEMENTS = 11;

function resetCriteria(): SearchCriteria {
  return new SearchCriteria({
    from: 1,
    size: MAX_ELEMENTS,
    status: 'Active',
  });
}

@State<CompaniesRecentStateModel>({
  name: 'companiesRecent',
  defaults: {
    criteria: resetCriteria(),
  },
})
@Injectable()
export class CompaniesRecentState {
  constructor(private service: CompaniesService) {}

  @Action(CompaniesRecentActions.Load)
  private load(ctx: ThisStateContext) {
    return this.service.searchRecent(ctx.getState().criteria).pipe(
      syncLoadProgress(ctx),
      switchMap((searchResult) => {
        if (searchResult.ResultsTotal >= MAX_ELEMENTS) {
          ctx.patchState({
            result: searchResult,
          });
          return EMPTY;
        }

        return this.service
          .query<CompanySearch>(
            new SearchCriteria({
              ...ctx.getState().criteria,
              from: 1,
              size: MAX_ELEMENTS - searchResult.ResultsTotal,
              excludeList: searchResult.Results.map((result) => result.Id).join(
                ','
              ),
            })
          )
          .pipe(
            syncLoadProgress(ctx),
            tap((result) => {
              const newResults = [...searchResult.Results, ...result.Results];

              ctx.patchState({
                result: {
                  ...result,
                  ResultsTotal: newResults.length,
                  Results: newResults,
                },
              });
            })
          );
      })
    );
  }

  @Action(CompaniesRecentActions.Search)
  private search(
    ctx: ThisStateContext,
    { criteria }: CompaniesRecentActions.Search
  ) {
    ctx.patchState({
      result: null,
    });

    if (!criteria.term?.length) {
      ctx.patchState({ criteria });
      return ctx.dispatch(new CompaniesRecentActions.Load());
    }

    return this.service.query<CompanySearch>(criteria).pipe(
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
