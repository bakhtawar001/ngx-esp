import { of, Observable } from 'rxjs';
import { AutocompleteParams, SimpleParty, User, UserTeam } from '../models';

export class AutocompleteServiceMock {
  url = '';

  parties(params: AutocompleteParams): Observable<SimpleParty[]> {
    return of([]);
  }

  users(params: AutocompleteParams): Observable<User[]> {
    return of([]);
  }

  usersAndTeams(params: AutocompleteParams): Observable<UserTeam[]> {
    return of([]);
  }
}
