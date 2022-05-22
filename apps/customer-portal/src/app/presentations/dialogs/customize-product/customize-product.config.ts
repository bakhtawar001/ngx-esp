import { createDialogDef } from '@cosmos/core';
import {
  CustomizeProductDialogData,
  CustomizeProductDialogResult,
} from './models';

export const customizeProductDialogDef = createDialogDef<
  CustomizeProductDialogData,
  CustomizeProductDialogResult
>({
  load: async () =>
    (await import(`./customize-product.dialog`)).CustomizeProductDialog,
  defaultConfig: {
    minWidth: '784px',
    width: '784px',
  },
});
