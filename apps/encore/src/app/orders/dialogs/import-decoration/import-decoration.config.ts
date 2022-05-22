import { createDialogDef } from '@cosmos/core';

type DialogType = any; // TODO: Define a type
type DialogResultType = any; // TODO: Define a type

export const importDecorationDialogDef = createDialogDef<
  DialogType,
  DialogResultType
>({
  load: async () =>
    (await import(`./import-decoration.dialog`)).ImportDecorationDialog,
  defaultConfig: {
    minWidth: '1015px',
    width: '1015px',
  },
});
