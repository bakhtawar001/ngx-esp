import { createDialogDef } from '@cosmos/core';
import {
  ProductInventoryDialogData,
  ProductInventoryDialogResult,
} from './models';

export const productInventoryDialogDef = createDialogDef<
  ProductInventoryDialogData,
  ProductInventoryDialogResult
>({
  load: async () =>
    (await import(`./product-inventory.dialog`)).ProductInventoryDialog,
  defaultConfig: {
    minWidth: '684px',
    width: '684px',
  },
});
