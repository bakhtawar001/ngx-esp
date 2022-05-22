import { Injectable } from '@angular/core';
import { DialogService } from '@cosmos/core';
import {
  CreateNewPresentationDialogData,
  createNewPresentationDialogDef,
} from '../dialogs/create-new-presentation';
import {
  SharePresentationDialogData,
  sharePresentationDialogDef,
} from '../dialogs/share-presentation';

@Injectable({
  providedIn: 'root',
})
export class PresentationsDialogService {
  constructor(private dialog: DialogService) {}

  openCreatePresentation(data?: CreateNewPresentationDialogData) {
    return this.dialog.open(createNewPresentationDialogDef, data);
  }

  openSharePresentation(data?: SharePresentationDialogData) {
    return this.dialog.open(sharePresentationDialogDef, data);
  }
}
