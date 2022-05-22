import { createDialogDef } from '@cosmos/core';
import {
  CreateCollectionDialogData,
  CreateCollectionDialogResult,
} from './models';

export const createCollectionDialogDef = createDialogDef<
  CreateCollectionDialogData,
  CreateCollectionDialogResult
>({
  load: async () =>
    (await import(`./create-collection.dialog`)).CreateCollectionDialog,
  defaultConfig: {
    minWidth: '684px',
    width: '684px',
  },
});
