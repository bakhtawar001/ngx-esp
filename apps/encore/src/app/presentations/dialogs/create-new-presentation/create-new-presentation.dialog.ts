import { CommonModule } from '@angular/common';
import { Component, Inject, NgModule } from '@angular/core';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { CosButtonModule } from '@cosmos/components/button';
import { CosInputModule } from '@cosmos/components/input';
import { CreateCollectionDialogResult } from '../../../collections/dialogs/create-collection';
import { CreateNewPresentationDialogData } from './models';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'esp-create-new-presentation-dialog',
  templateUrl: './create-new-presentation.dialog.html',
  styleUrls: ['./create-new-presentation.dialog.scss'],
})
export class CreateNewPresentationDialog {
  presentationlimit = 10;
  // To fix test cases, Should be removed when extended from ReactiveComponent
  state = { presentations: [] };

  constructor(
    private _dialogRef: MatDialogRef<
      CreateNewPresentationDialog,
      CreateCollectionDialogResult
    >,
    @Inject(MAT_DIALOG_DATA) private _data: CreateNewPresentationDialogData
  ) {}

  // eslint-disable-next-line
  showMore() {}
}

@NgModule({
  declarations: [CreateNewPresentationDialog],
  imports: [CommonModule, MatDialogModule, CosButtonModule, CosInputModule],
})
export class CreateNewPresentationDialogModule {}
