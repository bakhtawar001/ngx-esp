import { Injectable } from '@angular/core';
import { ToastActions } from '@cosmos/components/notification';
import { ModelWithLoadingStatus, syncLoadProgress } from '@cosmos/state';
import { AutocompleteService } from '@esp/autocomplete';
import { CompanySearch } from '@esp/models';
import type { SearchStateModel } from '@esp/search';
import type { StateContext } from '@ngxs/store';
import { Action, State } from '@ngxs/store';
import { EMPTY, throwError } from 'rxjs';
import { catchError, delay, map, switchMap, tap } from 'rxjs/operators';
import { CompaniesSearchActions } from '../actions';
import { Aggregations, ResponseAggregations, SearchCriteria } from '../models';
import { CompaniesService } from '../services';
import { extractCompanyOwnerIds, mapUserTeamsToCompanyOwnerAggregations } from '../utils';
import { TOAST_MESSAGES } from './toast-messages';

const ALGOLIA_TASK_DELAY = 2.5 * 1000; // 2,5s

export interface CompaniesSearchStateModel
  extends SearchStateModel<CompanySearch>,
    ModelWithLoadingStatus {
  facets: Aggregations;
}

type LocalStateContext = StateContext<CompaniesSearchStateModel>;

@State<CompaniesSearchStateModel>({
  name: 'companiesSearch',
  defaults: {
    criteria: new SearchCriteria(),
    facets: {},
    result: null,
  },
})
@Injectable()
export class CompaniesSearchState {
  constructor(
    private _service: CompaniesService,
    private _autocompleteService: AutocompleteService
  ) {}

  @Action(CompaniesSearchActions.Delete)
  private delete(
    ctx: LocalStateContext,
    { company }: CompaniesSearchActions.Delete
  ) {
    return this._service.validateDelete(company.Id).pipe(
      switchMap(({ IsDeletable }) => {
        if (!IsDeletable) return throwError(() => IsDeletable);

        return this._service.delete(company.Id);
      }),
      tap(() => {
        ctx.dispatch(
          new ToastActions.Show(
            TOAST_MESSAGES.DELETE_COMPANY_SUCCESS(company.Name)
          )
        );
      }),
      delay(ALGOLIA_TASK_DELAY),
      tap(() => {
        ctx.dispatch(
          new CompaniesSearchActions.Search(ctx.getState().criteria)
        );
      }),
      catchError((err) => {
        ctx.dispatch(
          new ToastActions.Show(TOAST_MESSAGES.DELETE_COMPANY_FAIL(!!err))
        );
        return EMPTY;
      })
    );
  }

  @Action(CompaniesSearchActions.Search)
  private search(
    ctx: LocalStateContext,
    { criteria }: CompaniesSearchActions.Search
  ) {
    ctx.patchState({
      criteria,
      result: null,
    });

    return this._service
      .query<CompanySearch, ResponseAggregations>(criteria)
      .pipe(
        syncLoadProgress(ctx),
        switchMap((result) => {
          const ownerIds = extractCompanyOwnerIds(result.Aggregations.Owners);

          return this._autocompleteService
            .usersAndTeams({
              term: '',
              size: ownerIds.length,
              filters: {
                Ids: {
                  Terms: ownerIds,
                  Behavior: 'Any',
                },
              },
            })
            .pipe(
              map((userTeams) => ({
                result,
                facets: {
                  Owners: mapUserTeamsToCompanyOwnerAggregations(userTeams),
                },
              }))
            );
        }),
        tap((result) => ctx.patchState({ ...result }))
      );
  }

  @Action(CompaniesSearchActions.ToggleStatus)
  private toggleStatus(
    ctx: LocalStateContext,
    { partyId, isActive }: CompaniesSearchActions.ToggleStatus
  ) {
    return this._service.setStatus(partyId, isActive).pipe(
      tap(() => {
        ctx.dispatch(
          new ToastActions.Show(
            TOAST_MESSAGES.TOGGLE_COMPANY_STATUS_SUCCESS(isActive)
          )
        );
      }),
      delay(ALGOLIA_TASK_DELAY),
      tap(() => {
        ctx.dispatch(
          new CompaniesSearchActions.Search(ctx.getState().criteria)
        );
      }),
      catchError(() => {
        ctx.dispatch(
          new ToastActions.Show(
            TOAST_MESSAGES.TOGGLE_COMPANY_STATUS_FAIL(isActive)
          )
        );
        return EMPTY;
      })
    );
  }
}
