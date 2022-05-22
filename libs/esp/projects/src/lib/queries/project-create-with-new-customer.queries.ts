import { createSelectorX } from '@cosmos/state';
import {
  ProjectCreateWithNewCustomerState,
  ProjectCreateWithNewCustomerStateModel,
} from '../states';

export namespace ProjectCreateWithNewCustomerQueries {
  export const getCreatingProject = createSelectorX(
    [ProjectCreateWithNewCustomerState],
    (state: ProjectCreateWithNewCustomerStateModel) => state?.creatingProject
  );

  export const getCreatingContact = createSelectorX(
    [ProjectCreateWithNewCustomerState],
    (state: ProjectCreateWithNewCustomerStateModel) => state?.creatingContact
  );

  export const getCreatingCustomer = createSelectorX(
    [ProjectCreateWithNewCustomerState],
    (state: ProjectCreateWithNewCustomerStateModel) => state?.creatingCustomer
  );
}
