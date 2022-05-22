import { createDialogDef } from '@cosmos/core';
import type {
  ProjectCreateInProgressDialogData,
  ProjectCreateInProgressDialogResult,
} from './models';

export const projectCreateInProgressDialogDef = createDialogDef<
  ProjectCreateInProgressDialogData,
  ProjectCreateInProgressDialogResult
>({
  load: async () =>
    (await import('./project-create-in-progress.dialog'))
      .ProjectCreateInProgressDialog,
  defaultConfig: {
    disableClose: true,
    minWidth: '626px',
    width: '626px',
  },
});
