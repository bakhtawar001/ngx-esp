import { StepInput, StepResult } from '@cosmos/core';
import { Project } from '@esp/models';

export type ProjectCreateInProgressDialogData = StepInput<{
  project: Project;
  productIds: number[];
}>;

export type ProjectCreateInProgressDialogResult = StepResult<{
  success: boolean;
  error: Error;
}>;
