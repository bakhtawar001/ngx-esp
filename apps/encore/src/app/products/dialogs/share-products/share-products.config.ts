import { createDialogDef } from '@cosmos/core';
import { ShareProductsDialogData, ShareProductsDialogResult } from './models';

export const shareProductsDialogDef = createDialogDef<
  ShareProductsDialogData,
  ShareProductsDialogResult
>({
  load: async () =>
    (await import(`./share-products.dialog`)).ShareProductsDialog,
  defaultConfig: {
    minWidth: '684px',
    width: '684px',
  },
});
