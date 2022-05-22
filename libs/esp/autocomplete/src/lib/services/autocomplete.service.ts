import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RestClient } from '@esp/common/http';
import { Observable } from 'rxjs';
import { AutocompleteParams, SimpleParty, User, UserTeam } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AutocompleteService extends RestClient {
  override url = 'autocomplete';

  parties(params: AutocompleteParams): Observable<SimpleParty[]> {
    return this.http.get<SimpleParty[]>(`${this.uri}/parties`, {
      params: this.transformParams(params),
    });
  }

  users(params: AutocompleteParams): Observable<User[]> {
    return this.http.get<User[]>(`${this.uri}/users`, {
      params: this.transformParams(params),
    });
  }

  usersAndTeams(params: AutocompleteParams): Observable<UserTeam[]> {
    return this.http.get<UserTeam[]>(`${this.uri}/usersandteams`, {
      params: this.transformParams(params),
    });
  }

  private transformParams(criteria: any): HttpParams {
    let params = new HttpParams();

    Object.keys(criteria).forEach(function (key) {
      if (typeof criteria[key] !== 'undefined') {
        params = params.append(
          key,
          typeof criteria[key] === 'object'
            ? JSON.stringify(criteria[key])
            : criteria[key]
        );
      }
    });

    return params;
  }
}
