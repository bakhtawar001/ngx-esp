import { Injectable } from '@angular/core';
import { OperationStatus, syncLoadProgress } from '@cosmos/state';
import { AuthFacade } from '@esp/auth';
import type { StateContext } from '@ngxs/store';
import { Action, NgxsOnInit, Selector, State } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';
import { tap } from 'rxjs/operators';
import { LookupsActions } from '../actions';
import { Lookups } from '../models';
import { LookupTypesApiService } from '../services';
import {
  allLookupsApiProperties,
  LookupsApiService,
} from '../services/lookups-api.service';

export interface LookupTypesStateModel {
  lookups: Lookups;
  loading?: OperationStatus;
}

export const allLookupStateProperties = [
  ...allLookupsApiProperties,
  'TagTypes',
] as const;

type LocalStateContext = StateContext<LookupTypesStateModel>;

@State<LookupTypesStateModel>({
  name: 'lookupTypes',
  defaults: {
    lookups: {},
  },
})
@Injectable()
export class LookupTypesState implements NgxsOnInit {
  @Selector()
  static getAllLookups(state: LookupTypesStateModel) {
    const allLookupsWithDefaults = allLookupStateProperties.reduce<Lookups>(
      (map, key) => ((map[key] = []), map),
      {}
    );
    return <Required<Lookups>>{
      ...allLookupsWithDefaults,
      ...state.lookups,
    };
  }

  constructor(
    private lookupsApi: LookupsApiService,
    private lookupTypesService: LookupTypesApiService,
    private auth: AuthFacade
  ) {}

  ngxsOnInit(ctx: LocalStateContext) {
    this.auth.profile$.subscribe({
      next: (user) => {
        if (user) {
          ctx.dispatch(new LookupsActions.LoadAll());
        } else {
          ctx.dispatch(new LookupsActions.ClearAll());
        }
      },
    });
  }

  /**
   * Commands
   */

  @Action(LookupsActions.LoadAll)
  loadAllLookups(ctx: LocalStateContext) {
    return this.lookupsApi.getLookups().pipe(
      tap((result) => {
        ctx.patchState({ lookups: result });
      }),
      syncLoadProgress(ctx)
    );
  }

  @Action(LookupsActions.ClearAll)
  clearAllLookups(ctx: LocalStateContext) {
    ctx.setState({ lookups: {} });
  }

  @Action([LookupsActions.LoadAll, LookupsActions.ReloadTagTypes])
  loadTagTypes(ctx: LocalStateContext) {
    return this.lookupTypesService.getTagTypes().pipe(
      tap((result) => {
        ctx.setState(
          patch({
            lookups: patch({ TagTypes: result }),
          })
        );
      })
    );
  }

  /**
   * Events
   */
}
