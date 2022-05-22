import { Injectable } from '@angular/core';
import type { StateContext } from '@ngxs/store';
import { Action, State } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { AutocompleteActions } from '../actions';
import { SimpleParty, User, UserTeam } from '../models';
import { AutocompleteService } from '../services';

export interface AutocompleteStateModel {
  parties: SimpleParty[];
  users: User[];
  usersAndTeams: UserTeam[];
}

type ThisStateModel = AutocompleteStateModel;
type ThisStateContext = StateContext<ThisStateModel>;

@State<AutocompleteStateModel>({
  name: 'autocomplete',
  defaults: {
    users: [],
    parties: [],
    usersAndTeams: [],
  },
})
@Injectable()
export class AutocompleteState {
  constructor(private readonly _service: AutocompleteService) {}

  @Action(AutocompleteActions.SearchParties)
  searchParties(
    ctx: ThisStateContext,
    event: AutocompleteActions.SearchParties
  ) {
    return this._service.parties(event.params).pipe(
      tap((parties) => {
        ctx.patchState({
          parties,
        });
      })
    );
  }

  @Action(AutocompleteActions.SearchUsers)
  searchUsers(ctx: ThisStateContext, event: AutocompleteActions.SearchUsers) {
    return this._service.users(event.params).pipe(
      tap((users) => {
        ctx.patchState({
          users,
        });
      })
    );
  }

  @Action(AutocompleteActions.SearchUsersAndTeams)
  searchUsersAndTeams(
    ctx: ThisStateContext,
    event: AutocompleteActions.SearchUsersAndTeams
  ) {
    return this._service.usersAndTeams(event.params).pipe(
      tap((usersAndTeams) => {
        ctx.patchState({
          usersAndTeams,
        });
      })
    );
  }
}
