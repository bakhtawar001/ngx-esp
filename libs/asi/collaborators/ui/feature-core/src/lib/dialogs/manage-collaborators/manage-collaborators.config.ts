import { createDialogDef } from '@cosmos/core';
import {
  ManageCollaboratorsDialogData,
  ManageCollaboratorsDialogResult,
} from './models';

export const manageCollaboratorsDialogDef = createDialogDef<
  ManageCollaboratorsDialogData,
  ManageCollaboratorsDialogResult
>({
  load: async () =>
    (await import('./manage-collaborators.dialog'))
      .AsiManageCollaboratorsDialog,
  defaultConfig: {
    disableClose: true,
    minWidth: '626px',
    width: '626px',
  },
});
