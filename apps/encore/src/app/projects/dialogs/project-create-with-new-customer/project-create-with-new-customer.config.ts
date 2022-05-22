import { createDialogDef } from '@cosmos/core';
import {
  ProjectCreateWithNewCustomerDialogData,
  ProjectCreateWithNewCustomerDialogResult,
} from './models';

export const projectCreateWithNewCustomerConfig = createDialogDef<
  ProjectCreateWithNewCustomerDialogData,
  ProjectCreateWithNewCustomerDialogResult
>({
  load: async () =>
    (await import('./project-create-with-new-customer.dialog'))
      .ProjectCreateWithNewCustomerDialog,
  defaultConfig: {
    disableClose: false,
    minWidth: '626px',
    width: '626px',
  },
});
