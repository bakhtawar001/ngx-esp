import { createDialogDef } from '@cosmos/core';
import {
  CreateNewPresentationDialogData,
  CreateNewPresentationDialogResult,
} from './models';

export const createNewPresentationDialogDef = createDialogDef<
  CreateNewPresentationDialogData,
  CreateNewPresentationDialogResult
>({
  load: async () =>
    (await import(`./create-new-presentation.dialog`))
      .CreateNewPresentationDialog,
  defaultConfig: {
    minWidth: '626px',
    width: '626px',
  },
});
