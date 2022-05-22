import { Injectable } from '@angular/core';
import { RestClient } from '@smartlink/common/http';
import { Observable } from 'rxjs';
import {
  AccountInformation,
  AccountInformationParams,
  AccountPreference,
  AccountPreferenceParams,
  Configuration,
  Search,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class AccountService extends RestClient<any> {
  override url = 'account';

  accountConfigurationSettings(): Observable<Configuration> {
    return this.http.get<Configuration>(`${this.uri}/configuration`);
  }

  recentSearches(): Observable<Search[]> {
    return this.http.get<Search[]>(`${this.uri}/recent_searches`);
  }

  accountInformation(): Observable<AccountInformation> {
    return this.http.get<AccountInformation>(this.uri);
  }

  accountPreference(item: string): Observable<AccountPreference> {
    return this.http.get<AccountPreference>(`${this.uri}/preferences/${item}`);
  }

  updateAccountInformation(
    params: AccountInformationParams
  ): Observable<AccountInformation> {
    return this.http.post<AccountInformation>(this.uri, params);
  }

  updateAccountPreference(
    preference: AccountPreferenceParams
  ): Observable<AccountPreference> {
    return this.http.post<AccountPreference>(
      `${this.uri}/preferences`,
      preference
    );
  }
}
