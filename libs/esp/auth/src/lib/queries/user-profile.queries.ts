import {
  createLoadingSelectorsFor,
  createMappedSelector,
  createPropertySelectors,
} from '@cosmos/state';
import {
  UserProfileState,
  UserProfileStateModel,
} from '../states/user-profile.state';

const authProps = createPropertySelectors<UserProfileStateModel>(
  UserProfileState
);

export namespace UserProfileQueries {
  export const {
    hasLoaded,
    isLoading,
  } = createLoadingSelectorsFor<UserProfileStateModel>(UserProfileState);
  export const {
    isInitialised,
    updateFullNameOperation,
    updateLoginEmailOperation,
    updateUserNameOperation,
    user: getUser,
  } = authProps;
  export const getUserAndLoadStatus = createMappedSelector({
    isLoading,
    user: getUser,
  });
}
