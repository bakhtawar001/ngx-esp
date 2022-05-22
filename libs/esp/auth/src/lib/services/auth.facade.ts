import { Injectable } from '@angular/core';
import { Auth, AuthQueries } from '@asi/auth';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { UserProfileQueries } from '../queries';
import { User } from '../types';
import { EspUserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthFacade {
  profile$ = this._store.select(UserProfileQueries.isInitialised).pipe(
    filter(Boolean),
    switchMap(() =>
      this._store.select(UserProfileQueries.getUserAndLoadStatus)
    ),
    filter((o) => !o.isLoading),
    map((o) => o.user)
  );

  @Select(AuthQueries.getLoggedIn)
  loggedIn$: Observable<boolean>;

  /**
   * Constructor
   *
   * @param {Store} _store
   */
  constructor(private _store: Store, private _userService: EspUserService) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------
  get user(): User {
    const user = this._store.selectSnapshot(AuthQueries.getUser);

    return user ? new User(user) : null;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------
  logout(redirectUrl?: string) {
    this._store.dispatch(new Auth.Logout(redirectUrl));
  }

  getUser(): Observable<User> {
    return this.profile$.pipe(
      filter((user) => !!user),
      map((user) => new User(user))
    );
  }
}
