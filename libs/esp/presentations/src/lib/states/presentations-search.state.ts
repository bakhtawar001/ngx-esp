import { Injectable } from '@angular/core';
import { ModelWithLoadingStatus, syncLoadProgress } from '@cosmos/state';
import { PresentationSearch, SearchCriteria } from '@esp/models';
import { Action, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { PresentationsSearchActions } from '../actions';
import { PresentationsApiService } from '../api/presentations-api.service';

export interface PresentationSearchStateModel extends ModelWithLoadingStatus {
  criteria: SearchCriteria | null;
  items: PresentationSearch[];
  total: number;
}

type LocalStateContext = StateContext<PresentationSearchStateModel>;

const resetState = () => ({
  criteria: new SearchCriteria(),
  items: [],
  total: 0,
});

@State<PresentationSearchStateModel>({
  name: 'presentationsSearch',
  defaults: resetState(),
})
@Injectable()
export class PresentationsSearchState {
  constructor(private readonly service: PresentationsApiService) {}

  /**
   * https://asicentral.atlassian.net/browse/ENCORE-3863
   * The tab click will run a query for presentation search passing the following filter params:
   * Filters: { Key: "ProjectId", Terms: [1234] } (where 1234 is the Project Id.)
   */
  @Action(PresentationsSearchActions.Search)
  search(
    ctx: LocalStateContext,
    { criteria }: PresentationsSearchActions.Search
  ) {
    return this.service.query<PresentationSearch>(criteria).pipe(
      syncLoadProgress(ctx),
      tap((res) =>
        ctx.patchState({
          items: res?.Results,
          total: res?.ResultsTotal,
        })
      )
    );
  }
}
