import { Injectable } from '@angular/core';
import { OperationStatus } from '@cosmos/state';
import { AuthFacade } from '@esp/auth';
import type { StateContext } from '@ngxs/store';
import { Action, NgxsOnInit, State } from '@ngxs/store';
import { map, tap } from 'rxjs/operators';
import { RecentCollectionsActions } from '../actions';
import type { CollectionSearch } from '../models';
import { CollectionsService } from '../services/collections.service';

export interface RecentCollectionsStateModel {
  items: CollectionSearch[];
  loading?: OperationStatus;
}

type LocalStateContext = StateContext<RecentCollectionsStateModel>;

const resetState = () =>
  <RecentCollectionsStateModel>{
    items: null!,
  };

@State<RecentCollectionsStateModel>({
  name: 'recentCollections',
  defaults: resetState(),
})
@Injectable()
export class RecentCollectionsState implements NgxsOnInit {
  constructor(
    private readonly service: CollectionsService,
    private auth: AuthFacade
  ) {}

  ngxsOnInit(ctx: LocalStateContext) {
    this.auth.profile$.subscribe({
      next: (user) => {
        if (user) {
          ctx.dispatch(new RecentCollectionsActions.Get());
        } else {
          ctx.setState(resetState());
        }
      },
    });
  }

  @Action(RecentCollectionsActions.Get)
  load(ctx: LocalStateContext) {
    return this.service.searchRecent().pipe(
      map((searchResult) => searchResult?.Results),
      tap((items) =>
        ctx.patchState({
          items,
        })
      )
    );
  }

  @Action(RecentCollectionsActions.Search)
  search(
    ctx: LocalStateContext,
    { criteria }: RecentCollectionsActions.Search
  ) {
    if (!criteria.term?.length) {
      return ctx.dispatch(new RecentCollectionsActions.Get());
    }

    return this.service.query<CollectionSearch>(criteria).pipe(
      map((searchResult) => searchResult?.Results),
      tap((items) =>
        ctx.patchState({
          items,
        })
      )
    );
  }
}
