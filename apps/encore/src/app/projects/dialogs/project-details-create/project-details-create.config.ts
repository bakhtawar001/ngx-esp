import { createDialogDef } from '@cosmos/core';
import type {
  ProjectDetailsCreateDialogData,
  ProjectDetailsCreateDialogResult,
} from './models';

export const projectDetailsCreateDialogDef = createDialogDef<
  ProjectDetailsCreateDialogData,
  ProjectDetailsCreateDialogResult
>({
  load: async () =>
    (await import('./project-details-create.dialog'))
      .ProjectDetailsCreateDialog,
  defaultConfig: {
    disableClose: false,
    minWidth: '626px',
    width: '626px',
  },
});
