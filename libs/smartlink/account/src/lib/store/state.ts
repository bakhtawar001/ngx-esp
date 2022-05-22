import { Injectable } from '@angular/core';
import type { StateContext } from '@ngxs/store';
import { Action, Selector, State } from '@ngxs/store';
import {
  LoadAccountInformationSuccess,
  LoadAccountPreferenceSuccess,
  LoadSearchesSuccess,
  UpdateAccountInformationSuccess,
} from './actions';
import { AccountStateModel } from './model';

@State<AccountStateModel>({
  name: 'account',
  defaults: {
    searches: [],
    info: null,
    preferences: {},
  },
})
@Injectable()
export class AccountState {
  /**
   * Selectors
   */
  @Selector()
  static getSearches(state: AccountStateModel) {
    return state.searches;
  }

  @Selector()
  static getAccountInfo(state: AccountStateModel) {
    return state?.info;
  }

  @Selector()
  static getPreference(state: AccountStateModel) {
    return (preference: string) => state.preferences[preference];
  }

  @Selector()
  static getPreferences(state: AccountStateModel) {
    return state.preferences;
  }

  /**
   * Commands
   */

  /**
   * Events
   */
  @Action(LoadSearchesSuccess)
  loadSearchesSuccess(
    ctx: StateContext<AccountStateModel>,
    event: LoadSearchesSuccess
  ) {
    ctx.patchState({
      searches: event.searches,
    });
  }

  @Action(LoadAccountInformationSuccess)
  loadInformationSuccess(
    ctx: StateContext<AccountStateModel>,
    event: LoadAccountInformationSuccess | UpdateAccountInformationSuccess
  ) {
    console.log(event);
    ctx.patchState({
      info: event.info,
    });
  }

  // @Action(UpdateAccountInformationSuccess)
  // updateAccountInformationSuccess() {}

  @Action(LoadAccountPreferenceSuccess)
  loadPreferenceSuccess(
    ctx: StateContext<AccountStateModel>,
    event: LoadAccountPreferenceSuccess
  ) {
    const { preferences } = ctx.getState();

    preferences[event.preference.Item] = event.preference.Value;

    ctx.patchState({
      preferences: preferences,
    });
  }

  // @Action(UpdateAccountPreferenceSuccess)
  // updateAccountPreferenceSuccess() {}
}
