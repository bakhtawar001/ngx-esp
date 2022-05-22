import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { CosButtonModule } from '@cosmos/components/button';
import { CosButtonGroupModule } from '@cosmos/components/button-group';
import { CosFormFieldModule } from '@cosmos/components/form-field';
import { CosInputModule } from '@cosmos/components/input';
import { CosSlideToggleModule } from '@cosmos/components/toggle';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'esp-share-presentation-dialog',
  templateUrl: 'share-presentation.dialog.html',
  styleUrls: ['./share-presentation.dialog.scss'],
})
export class SharePresentationDialog {
  shareWith = new FormControl('email');

  updateShareWith(e) {
    this.shareWith.setValue(e.value);
  }
}

@NgModule({
  declarations: [SharePresentationDialog],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    FormsModule,
    MatDatepickerModule,
    CosSlideToggleModule,
    CosButtonModule,
    CosButtonGroupModule,
    CosInputModule,
    CosFormFieldModule,
  ],
})
export class SharePresentationDialogModule {}
