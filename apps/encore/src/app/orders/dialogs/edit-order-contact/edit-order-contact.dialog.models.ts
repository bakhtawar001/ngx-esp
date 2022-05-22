import { createDialogDef } from '@cosmos/core';
import { OrderContact, OrderType } from '@esp/models';

export const editOrderContactDialogDef = createDialogDef<
  EditOrderContactDialogData,
  EditOrderContactDialogResult
>({
  load: async () =>
    (await import(`./edit-order-contact.dialog`)).EditOrderContactDialog,
  defaultConfig: {
    minWidth: '626px',
    width: '626px',
  },
});

export interface EditOrderContactDialogData {
  title: string;
  orderType: OrderType;
  // isNewOrderContact: boolean;
  orderContact: OrderContact;
}

export interface EditOrderContactDialogResult {
  orderContact?: OrderContact;
  cancelled?: boolean;
}
