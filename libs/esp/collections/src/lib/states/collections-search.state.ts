import { Injectable } from '@angular/core';
import { ModelWithLoadingStatus, syncLoadProgress } from '@cosmos/state';
import { SearchCriteria } from '@esp/models';
import type { StateContext } from '@ngxs/store';
import { Action, State } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { CollectionSearchActions } from '../actions';
import type { CollectionSearch } from '../models';
import { CollectionsService } from '../services/collections.service';

export interface CollectionSearchStateModel extends ModelWithLoadingStatus {
  criteria: SearchCriteria | null;
  items: CollectionSearch[];
  total: number;
}

type ThisStateContext = StateContext<CollectionSearchStateModel>;

const defaultState = () => ({
  criteria: new SearchCriteria(),
  items: [],
  total: 0,
});

@State<CollectionSearchStateModel>({
  name: 'collectionsSearch',
  defaults: defaultState(),
})
@Injectable()
export class CollectionsSearchState {
  constructor(private readonly service: CollectionsService) {}

  @Action(CollectionSearchActions.Search)
  search(ctx: ThisStateContext, { criteria }: CollectionSearchActions.Search) {
    ctx.patchState({
      criteria,
      items: null,
      total: 0,
    });

    return this.service.query<CollectionSearch>(criteria).pipe(
      syncLoadProgress(ctx),
      tap((res) =>
        ctx.patchState({
          items: res?.Results,
          total: res?.ResultsTotal,
        })
      )
    );
  }

  @Action(CollectionSearchActions.RemoveItem)
  removeItem(
    ctx: ThisStateContext,
    { id }: CollectionSearchActions.RemoveItem
  ) {
    const items = [...ctx.getState().items.filter((item) => item.Id !== id)];
    ctx.patchState({
      items,
      total: items.length,
    });
  }

  @Action(CollectionSearchActions.Reset)
  reset(ctx: ThisStateContext) {
    ctx.setState(defaultState());
  }
}
