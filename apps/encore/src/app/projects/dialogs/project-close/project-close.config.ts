import { createDialogDef } from '@cosmos/core';
import { ProjectCloseDialogResult } from './models/dialog.model';

export const projectCloseDialogDef = createDialogDef<
  null,
  ProjectCloseDialogResult
>({
  load: async () => (await import('./project-close.dialog')).ProjectCloseDialog,
  defaultConfig: {
    disableClose: false,
    minWidth: '626px',
    width: '626px',
  },
});
