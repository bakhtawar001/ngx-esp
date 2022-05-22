import { StepResult } from '@cosmos/core';

export type PresentationSelectDialogResult = StepResult<{
  createNew?: boolean;
  complete?: boolean;
}>;
