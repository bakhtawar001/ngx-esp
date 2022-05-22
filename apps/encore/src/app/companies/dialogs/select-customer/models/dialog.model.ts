import { StepInput, StepResult } from '@cosmos/core';

export type SelectCustomerDialogData = StepInput<{
  searchTerm: string;
  // selectCustomerId will most likely disappear once we move to the new design
  // because there is no indicator for the current selection, you just need to select again
  selectedCustomerId: number;
}>;

export type SelectCustomerDialogResult = StepResult<{
  searchTerm: string;
  selectedCustomerId?: number;
  createNew: boolean;
}>;
