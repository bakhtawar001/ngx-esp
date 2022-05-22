import { AuthStateModel } from '../../src/lib/states';
import { IUser } from '@cosmos/common';

export const MockAuthStateModel: {
  data: AuthStateModel;
  user: IUser;
  state: (stateType: MockStateType) => AuthStateModel | void;
} = {
  data: {
    isInitialised: false,
    user: null,
    session: null,
    loading: {
      inProgress: true,
      success: false,
      error: null,
    },
  },
  user: {
    displayName: 'TestName',
  },
  state: function (stateType: MockStateType): AuthStateModel | void {
    switch (stateType) {
      case MockStateType.LoggedIn:
        return { ...this?.data, user: this?.user };
      case MockStateType.Initialised:
        return { ...this?.data, isInitialised: true };
    }
  },
};

export enum MockStateType {
  LoggedIn,
  Initialised,
}
