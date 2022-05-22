import { createDialogDef } from '@cosmos/core';
import { CreateContactData, CreateContactResult } from './models';

export const createContactDialogDef = createDialogDef<
  CreateContactData,
  CreateContactResult
>({
  load: async () =>
    (await import(`./create-contact.dialog`)).CreateContactDialog,
  defaultConfig: {
    disableClose: true,
    minWidth: '626px',
    width: '626px',
  },
});
