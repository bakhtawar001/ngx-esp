import { createDialogDef } from '@cosmos/core';
import { SelectCustomerDialogData, SelectCustomerDialogResult } from './models';

export const selectCustomerDialogConfig = createDialogDef<
  SelectCustomerDialogData,
  SelectCustomerDialogResult
>({
  load: async () =>
    (await import('./select-customer.dialog')).SelectCustomerDialog,
  defaultConfig: {
    disableClose: false,
    minWidth: '784px',
    width: '784px',
  },
});
