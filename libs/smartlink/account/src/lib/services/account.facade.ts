import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import {
  LoadSearchesSuccess,
  LoadAccountInformationSuccess,
  LoadAccountPreferenceSuccess,
  UpdateAccountPreferenceSuccess,
  UpdateAccountInformationSuccess,
} from '../store/actions';
import { AccountState } from '../store/state';
import { AccountService } from './account.service';
import {
  AccountInformationParams,
  AccountPreference,
  AccountPreferenceParams,
} from '../models';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AccountFacade {
  searches$ = this.store.select(AccountState.getSearches);
  info$ = this.store.select(AccountState.getAccountInfo);
  preferences$ = this.store.select(AccountState.getPreferences);

  constructor(private store: Store, private _accountService: AccountService) {}

  getPreference(preference: string) {
    return this.store
      .select(AccountState.getPreference)
      .pipe(map((fn) => fn(preference)));
  }

  searches() {
    this._accountService.recentSearches().subscribe((res) => {
      this.store.dispatch(new LoadSearchesSuccess(res));
    });

    return this.searches$;
  }

  accountInfo() {
    this._accountService.accountInformation().subscribe((res) => {
      this.store.dispatch(new LoadAccountInformationSuccess(res));
    });
  }

  accountPreference(item: string) {
    this._accountService.accountPreference(item).subscribe((res) => {
      this.store.dispatch(new LoadAccountPreferenceSuccess(res));
    });
  }

  updateAccountInfo(params: AccountInformationParams) {
    this._accountService.updateAccountInformation(params).subscribe((res) => {
      this.store.dispatch(new UpdateAccountInformationSuccess(res));
    });
  }

  updateAccountPreference(preference: AccountPreferenceParams) {
    this._accountService
      .updateAccountPreference(preference)
      .subscribe((res) => {
        this.store.dispatch(new UpdateAccountPreferenceSuccess(res));
      });
  }
}
