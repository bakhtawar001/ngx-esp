import { Injectable } from '@angular/core';
import { asDispatch, fromSelector, LocalState } from '@cosmos/state';
import {
  ProjectCreateWithNewCustomerActions,
  ProjectCreateWithNewCustomerQueries,
} from '@esp/projects';

@Injectable()
export class ProjectCreateWithNewCustomerLocalState extends LocalState<ProjectCreateWithNewCustomerLocalState> {
  creatingProject = fromSelector(
    ProjectCreateWithNewCustomerQueries.getCreatingProject
  );
  creatingContact = fromSelector(
    ProjectCreateWithNewCustomerQueries.getCreatingContact
  );
  creatingCustomer = fromSelector(
    ProjectCreateWithNewCustomerQueries.getCreatingCustomer
  );

  create = asDispatch(
    ProjectCreateWithNewCustomerActions.CreateProjectWithNewCustomer
  );
}
