import { createDialogDef } from '@cosmos/core';
import { MakePaymentDialogData, MakePaymentDialogResult } from './models';

export const makePaymentDialogDef = createDialogDef<
  MakePaymentDialogData,
  MakePaymentDialogResult
>({
  load: async () => (await import(`./make-payment.dialog`)).MakePaymentDialog,
  defaultConfig: {
    minWidth: '548px',
    width: '548px',
  },
});
