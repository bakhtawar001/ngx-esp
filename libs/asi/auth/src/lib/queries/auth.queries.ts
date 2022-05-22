import { createLoadingSelectorsFor, createSelectorX } from '@cosmos/state';
import { AuthState, AuthStateModel } from '../states/auth.state';

export namespace AuthQueries {
  export const {
    isLoading,
    hasLoaded,
    getLoadError,
  } = createLoadingSelectorsFor<AuthStateModel>(AuthState);

  export const getSession = createSelectorX(
    [AuthState],
    (state: AuthStateModel) => state.session
  );

  export const getToken = createSelectorX(
    [AuthState],
    (state: AuthStateModel) => state.session?.access_token
  );

  export const getUser = createSelectorX(
    [AuthState],
    (state: AuthStateModel) => state.user
  );

  export const getLoggedIn = createSelectorX(
    [AuthState],
    (state: AuthStateModel) => !!state.user
  );
}
