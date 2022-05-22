import type { ConfirmDialogData } from '@cosmos/components/confirm-dialog';
import { createDialogDef } from '../utils';

export const confirmDiscardFlowDialogDef = createDialogDef<
  ConfirmDialogData,
  boolean | null
>({
  load: async () =>
    (await import('@cosmos/components/confirm-dialog')).CosConfirmDialog,
  defaultConfig: {
    disableClose: true,
    minWidth: '400px',
    width: '400px',
    data: {
      message: 'Are you sure you want to discard your unsaved work?',
      confirm: 'Yes',
      cancel: 'No',
    },
  },
});
