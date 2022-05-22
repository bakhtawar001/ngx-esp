import { createDialogDef } from '@cosmos/core';
import { SelectOrderDialogData, SelectOrderDialogResult } from './models';

export const selectOrderDialogConfig = createDialogDef<
  SelectOrderDialogData,
  SelectOrderDialogResult
>({
  load: async () => (await import('./select-order.dialog')).SelectOrderDialog,
  defaultConfig: {
    disableClose: false,
    minWidth: '784px',
    width: '784px',
  },
});
