import { createDialogDef } from '@cosmos/core';
import {
  PresentationSelectDialogData,
  PresentationSelectDialogResult,
} from '../../models';

export const presentationSelectDialogDef = createDialogDef<
  PresentationSelectDialogData,
  PresentationSelectDialogResult
>({
  load: async () =>
    (await import(`./presentation-select.dialog`)).PresentationSelectDialog,
  defaultConfig: {
    minWidth: '784px',
    width: '784px',
  },
});
