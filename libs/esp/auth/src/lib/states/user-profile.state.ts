import { Injectable } from '@angular/core';
import { AuthTokenService } from '@asi/auth';
import {
  mergeState,
  ModelWithLoadingStatus,
  OperationStatus,
  optimisticUpdate,
  syncLoadProgress,
  syncOperationProgress,
} from '@cosmos/state';
import type { StateContext } from '@ngxs/store';
import { Action, NgxsAfterBootstrap, NgxsOnInit, State } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { UserProfileActions } from '../actions';
import { EspUserService } from '../services/user.service';
import { EspUserProfile } from '../types';

class Internal_SyncUserProfile {
  static readonly type = '[UserProfile] Sync User Profile';
}

export interface UserProfileStateModel extends ModelWithLoadingStatus {
  isInitialised: boolean;
  user?: EspUserProfile | null;
  updateUserNameOperation?: OperationStatus;
  updateFullNameOperation?: OperationStatus;
  updateLoginEmailOperation?: OperationStatus;
}

type LocalStateModel = UserProfileStateModel;
type LocalStateContext = StateContext<LocalStateModel>;

@State<UserProfileStateModel>({
  name: 'userProfile',
  defaults: {
    isInitialised: false,
    user: null,
  },
})
@Injectable()
export class UserProfileState implements NgxsAfterBootstrap, NgxsOnInit {
  constructor(
    private userService: EspUserService,
    private tokenService: AuthTokenService
  ) {}

  ngxsOnInit(ctx: LocalStateContext) {
    ctx.patchState({ isInitialised: false });
  }

  /**
   * Dispatch CheckSession on start
   */
  ngxsAfterBootstrap(ctx: LocalStateContext) {
    ctx.dispatch(new Internal_SyncUserProfile());
  }

  /**
   * Commands
   */
  @Action(Internal_SyncUserProfile, { cancelUncompleted: true })
  syncUserProfile(ctx: LocalStateContext) {
    return this.tokenService.getToken().pipe(
      switchMap((token) => {
        return token
          ? this.userService.getUser(token).pipe(syncLoadProgress(ctx))
          : of(null);
      }),
      tap((user) => ctx.patchState({ user })),
      catchError(() => of(null)),
      tap(() => {
        ctx.patchState({ isInitialised: true });
      })
    );
  }

  @Action(UserProfileActions.UpdateFullName)
  updateFullName(
    ctx: LocalStateContext,
    { payload: update }: UserProfileActions.UpdateFullName
  ): Observable<Record<string, unknown>> | void {
    const userId = getUserId(ctx);
    if (!userId) {
      return;
    }
    return this.userService
      .updateFullName(update.GivenName, update.FamilyName)
      .pipe(
        map(
          () => update
          // The service does not return the correct data, so we just use the update payload here
          // and force a resync of the user object in the final tap
        ),
        optimisticUpdate(update, {
          getValue() {
            const user = getMatchingUser(ctx, userId);
            return (
              user && { GivenName: user.GivenName, FamilyName: user.FamilyName }
            );
          },
          setValue(value) {
            if (getMatchingUser(ctx, userId)) {
              ctx.setState(
                mergeState<LocalStateModel>({
                  user: {
                    GivenName: value.GivenName,
                    FamilyName: value.FamilyName,
                    Name: `${value.GivenName} ${value.FamilyName}`.trim(),
                  },
                })
              );
            }
          },
        }),
        syncOperationProgress(ctx, 'updateFullNameOperation', {
          getErrorMessage: (error) => {
            return error['error'] ?? error;
          },
        }),
        tap(() => ctx.dispatch(new Internal_SyncUserProfile()))
      );
  }

  @Action(UserProfileActions.UpdateUserName)
  updateUserName(
    ctx: LocalStateContext,
    action: UserProfileActions.UpdateUserName
  ): Observable<string> | void {
    const userId = getUserId(ctx);
    if (!userId) {
      return;
    }
    return this.userService.updateUserName(action.name).pipe(
      optimisticUpdate(action.name, {
        getValue: () => getMatchingUser(ctx, userId)?.UserName,
        setValue: (value) => {
          if (getMatchingUser(ctx, userId)) {
            ctx.setState(
              mergeState<LocalStateModel>({ user: { UserName: value } })
            );
          }
        },
      }),
      syncOperationProgress(ctx, 'updateUserNameOperation', {
        getErrorMessage: (error) => {
          return error['error'] ?? error;
        },
      })
    );
  }

  @Action(UserProfileActions.UpdateLoginEmail)
  updateLoginEmail(
    ctx: LocalStateContext,
    action: UserProfileActions.UpdateLoginEmail
  ): Observable<string> | void {
    const userId = getUserId(ctx);
    if (!userId) {
      return;
    }
    return this.userService.updateLoginEmail(action.email).pipe(
      map(
        () => action.email
        // The service does not return the correct data, so we just use the update payload here
        // and force a resync of the user object in the final tap
      ),
      optimisticUpdate(action.email, {
        getValue() {
          return getMatchingUser(ctx, userId)?.LoginEmail;
        },
        setValue(value) {
          if (getMatchingUser(ctx, userId)) {
            ctx.setState(
              mergeState<LocalStateModel>({ user: { LoginEmail: value } })
            );
          }
        },
      }),
      syncOperationProgress(ctx, 'updateLoginEmailOperation', {
        getErrorMessage: (error) => {
          return error['error'] ?? error;
        },
      }),
      tap(() => ctx.dispatch(new Internal_SyncUserProfile()))
    );
  }
}

function getMatchingUser(ctx: LocalStateContext, id: number) {
  const user = ctx.getState().user;
  return user?.Id === id ? user : null;
}

function getUserId(ctx: LocalStateContext) {
  return ctx.getState().user?.Id;
}
