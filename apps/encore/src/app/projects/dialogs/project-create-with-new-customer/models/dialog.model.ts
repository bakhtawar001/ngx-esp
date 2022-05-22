import { CompanyFormModel } from '@asi/company/ui/feature-core';
import { StepInput, StepResult } from '@cosmos/core';
import {
  ProjectCreateWithNewCustomer,
  ProjectDetailsForm,
} from '@esp/projects';

export type ProjectCreateWithNewCustomerDialogData =
  StepInput<ProjectCreateWithNewCustomer>;

export type ProjectCreateWithNewCustomerDialogResult = StepResult<{
  customer: CompanyFormModel;
  project: ProjectDetailsForm;
}>;
