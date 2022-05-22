import { createDialogDef } from '@cosmos/core';
import {
  TransferOwnershipDialogData,
  TransferOwnershipDialogResult,
} from './models';

export const transferOwnershipDialogDef = createDialogDef<
  TransferOwnershipDialogData,
  TransferOwnershipDialogResult
>({
  load: async () =>
    (await import('./transfer-ownership.dialog')).AsiTransferOwnershipDialog,
  defaultConfig: {
    minWidth: '626px',
    width: '626px',
  },
});
