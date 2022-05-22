import { createDialogDef } from '@cosmos/core';
import {
  ProjectCreateWithNewCustomerInProgressDialogData,
  ProjectCreateWithNewCustomerInProgressDialogResult,
} from './models';

export const projectCreateWithNewCustomerInProgressDialogDef = createDialogDef<
  ProjectCreateWithNewCustomerInProgressDialogData,
  ProjectCreateWithNewCustomerInProgressDialogResult
>({
  load: async () =>
    (await import('./project-create-with-new-customer-in-progress.dialog'))
      .ProjectCreateWithNewCustomerInProgressDialog,
  defaultConfig: {
    disableClose: true,
    minWidth: '626px',
    width: '626px',
  },
});
