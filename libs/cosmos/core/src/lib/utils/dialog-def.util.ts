import { ComponentType } from '@angular/cdk/portal';
import { MatDialogConfig } from '@angular/material/dialog';

export type DialogConfig<TDialogData> = MatDialogConfig<Partial<TDialogData>>;

export interface DialogDef<
  // eslint-disable-next-line @typescript-eslint/ban-types
  TDialogData extends object,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  TDialogResult
> {
  loadDialogComponentType: () => Promise<ComponentType<unknown>>;
  defaultConfig: DialogConfig<TDialogData>;
}

export function createDialogDef<
  // eslint-disable-next-line @typescript-eslint/ban-types
  TDialogData extends object,
  TDialogResult
>(def: {
  load: () => Promise<ComponentType<unknown>> | ComponentType<unknown>;
  defaultConfig?: DialogConfig<TDialogData>;
}): DialogDef<TDialogData, TDialogResult> {
  return <DialogDef<TDialogData, TDialogResult>>{
    loadDialogComponentType: async () => {
      return await def.load();
    },
    defaultConfig: def.defaultConfig || null,
  };
}
