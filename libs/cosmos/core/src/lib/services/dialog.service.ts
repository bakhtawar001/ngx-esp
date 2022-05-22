import { Injectable } from '@angular/core';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { defer, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DialogDef } from '../utils';

@Injectable({ providedIn: 'root' })
export class DialogService {
  constructor(private readonly dialog: MatDialog) {}

  // eslint-disable-next-line @typescript-eslint/ban-types
  open<TDialogData extends object, TDialogResult>(
    dialogDef: DialogDef<TDialogData, TDialogResult>,
    data?: TDialogData,
    options?: {
      /**
       * Override the default config for the dialog (in the dialog def)
       * and/or provide your own other caller specific config for the
       * dialog being opened
       */
      config?: MatDialogConfig<TDialogData>;
      /**
       * The caller can provide a callback to be invoked with the dialogRef
       * of the dialog so that more advanced dialog control logic can be
       * performed from the caller's context.
       */
      dialogRefHook?: (dialogRef: MatDialogRef<unknown, TDialogResult>) => void;
    }
  ): Observable<TDialogResult> {
    const { config, dialogRefHook } = options || {};
    const mergedConfig: MatDialogConfig<TDialogData> = {
      ...(dialogDef.defaultConfig || {}),
      ...(config || {}),
      data: <TDialogData>{
        ...(dialogDef.defaultConfig?.data || {}),
        ...(data || {}),
      },
    };
    return defer(() => dialogDef.loadDialogComponentType()).pipe(
      switchMap((componentType) => {
        const dialogRef = this.dialog.open<unknown, TDialogData, TDialogResult>(
          componentType,
          mergedConfig
        );
        if (dialogRefHook) {
          dialogRefHook(dialogRef);
        }
        return dialogRef.afterClosed() as Observable<TDialogResult>;
      })
    );
  }
}
