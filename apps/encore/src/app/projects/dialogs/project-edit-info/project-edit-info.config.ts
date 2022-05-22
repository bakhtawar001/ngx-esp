import { createDialogDef } from '@cosmos/core';
import { Project } from '@esp/models';

export const projectEditInfoDialogDef = createDialogDef<Project, null>({
  load: async () =>
    (await import('./project-edit-info.dialog')).ProjectEditInfoDialog,
  defaultConfig: {
    disableClose: true,
    minWidth: '625px',
    width: '625px',
  },
});
