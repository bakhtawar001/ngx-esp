import { StepInput, StepResult } from '@cosmos/core';
import { ProjectCreateWithNewCustomer } from '@esp/projects';

export type ProjectCreateWithNewCustomerInProgressDialogData =
  StepInput<ProjectCreateWithNewCustomer>;

export type ProjectCreateWithNewCustomerInProgressDialogResult = StepResult<{
  success: boolean;
  error: Error;
}>;
