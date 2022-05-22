import { Injectable } from '@angular/core';
import { DialogService } from '@cosmos/core';
import { importDecorationDialogDef } from '../dialogs/import-decoration';

@Injectable({
  providedIn: 'root',
})
export class OrderDialogService {
  constructor(private readonly _dialog: DialogService) {}

  importDecoration() {
    return this._dialog.open(importDecorationDialogDef);
  }
}
