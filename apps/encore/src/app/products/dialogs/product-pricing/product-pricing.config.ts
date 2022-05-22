import { createDialogDef } from '@cosmos/core';
import { ProductPricingDialogData, ProductPricingDialogResult } from './models';

export const productPricingDialogDef = createDialogDef<
  ProductPricingDialogData,
  ProductPricingDialogResult
>({
  load: async () =>
    (await import(`./product-pricing.dialog`)).ProductPricingDialog,
  defaultConfig: {
    minWidth: '684px',
    width: '684px',
  },
});
