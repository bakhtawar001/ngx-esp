import { Injectable } from '@angular/core';
import { ConfirmDialogData } from '@cosmos/components/confirm-dialog';
import { createDialogDef, DialogService } from '@cosmos/core';

const confirmDiscardChangesDialogDef = createDialogDef<
  ConfirmDialogData,
  boolean | null
>({
  load: async () =>
    (await import('@cosmos/components/confirm-dialog')).CosConfirmDialog,
  defaultConfig: {
    disableClose: true,
    minWidth: '400px',
    width: '400px',
    data: {
      message: 'Are you sure you do not want to save your changes?',
      confirm: 'Yes',
      cancel: 'No',
    },
  },
});

const confirmDialogDef = createDialogDef<ConfirmDialogData, boolean | null>({
  load: async () =>
    (await import('@cosmos/components/confirm-dialog')).CosConfirmDialog,
  defaultConfig: {
    disableClose: true,
    minWidth: '400px',
    width: '400px',
    data: {
      confirm: 'Yes',
      cancel: 'No',
    },
  },
});

@Injectable({
  providedIn: 'root',
})
export class ConfirmDialogService {
  constructor(private readonly dialog: DialogService) {}

  confirm(data?: { message?: string; confirm?: string; cancel?: string }) {
    return this.dialog.open(confirmDialogDef, data);
  }

  confirmDiscardChanges(data?: {
    message?: string;
    confirm?: string;
    cancel?: string;
  }) {
    return this.dialog.open(confirmDiscardChangesDialogDef, data);
  }
}
