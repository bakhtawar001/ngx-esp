import { createSelectorX } from '@cosmos/state';
import {
  LoginFormState,
  LoginFormStateModel,
} from '../states/login-form.state';

export namespace LoginFormQueries {
  export const getFormValues = createSelectorX(
    [LoginFormState],
    (state: LoginFormStateModel) => state
  );
}
