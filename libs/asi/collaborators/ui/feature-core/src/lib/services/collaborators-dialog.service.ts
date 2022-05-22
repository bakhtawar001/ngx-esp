import { Injectable } from '@angular/core';
import { DialogService } from '@cosmos/core';
import {
  ManageCollaboratorsDialogData,
  manageCollaboratorsDialogDef,
  TransferOwnershipDialogData,
  transferOwnershipDialogDef,
} from '../dialogs';

@Injectable({
  providedIn: 'root',
})
export class CollaboratorsDialogService {
  constructor(private readonly dialog: DialogService) {}

  openManageCollaboratorsDialog(data: ManageCollaboratorsDialogData) {
    return this.dialog.open(manageCollaboratorsDialogDef, data);
  }

  openTransferOwnershipDialog(data: TransferOwnershipDialogData) {
    return this.dialog.open(transferOwnershipDialogDef, data);
  }
}
