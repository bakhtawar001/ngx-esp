import { ProjectCreateWithNewCustomer } from '../models';

const ACTION_SCOPE = '[Create Project With New Customer]';

export namespace ProjectCreateWithNewCustomerActions {
  export class CreateProjectWithNewCustomer {
    static type = `${ACTION_SCOPE} Create`;

    constructor(public payload: ProjectCreateWithNewCustomer) {}
  }
}
