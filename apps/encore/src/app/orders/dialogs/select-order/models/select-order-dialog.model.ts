import { StepInput, StepResult } from '@cosmos/core';

export type SelectOrderDialogData = StepInput<{
  searchTerm: string;
  selectedOrderId: number;
}>;

export type SelectOrderDialogResult = StepResult<{
  searchTerm?: string;
  selectedOrderId?: number;
  createNew: boolean;
}>;
