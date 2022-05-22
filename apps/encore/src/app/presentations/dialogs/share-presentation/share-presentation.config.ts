import { createDialogDef } from '@cosmos/core';
import { Presentation } from '@esp/models';

export const sharePresentationDialogDef = createDialogDef<Presentation, null>({
  load: async () =>
    (await import('./share-presentation.dialog')).SharePresentationDialog,
  defaultConfig: {
    disableClose: true,
    minWidth: '625px',
    width: '625px',
  },
});
