import { createDialogDef } from '@cosmos/core';
import {
  AddToCollectionDialogData,
  AddToCollectionDialogResult,
} from './models';

export const addToCollectionDialogDef = createDialogDef<
  AddToCollectionDialogData,
  AddToCollectionDialogResult
>({
  load: async () =>
    (await import(`./add-to-collection.dialog`)).AddToCollectionDialog,
  defaultConfig: {
    minWidth: '784px',
    width: '784px',
  },
});
