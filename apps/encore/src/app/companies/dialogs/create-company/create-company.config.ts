import { createDialogDef } from '@cosmos/core';
import { CreateCompanyDialogData, CreateCompanyDialogResult } from './models';

export const createCompanyDialogDef = createDialogDef<
  CreateCompanyDialogData,
  CreateCompanyDialogResult
>({
  load: async () =>
    (await import(`./create-company.dialog`)).CreateCompanyDialog,
  defaultConfig: {
    minWidth: '626px',
    width: '626px',
    disableClose: true,
  },
});
