import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  NgModule,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { CosButtonModule, ThemePalette } from '@cosmos/components/button';
import { ConfirmDialogData } from './confirm-dialog.data';

@Component({
  selector: 'cos-confirm-dialog',
  templateUrl: './confirm.dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosConfirmDialog {
  confirmationButtonColor: ThemePalette = 'primary';

  constructor(
    public readonly dialogRef: MatDialogRef<CosConfirmDialog>,
    @Inject(MAT_DIALOG_DATA) public readonly data: ConfirmDialogData
  ) {
    if (this.data?.destructiveAction) {
      this.confirmationButtonColor = 'warn';
    }
  }
}

@NgModule({
  imports: [CommonModule, MatDialogModule, CosButtonModule, FormsModule],
  declarations: [CosConfirmDialog],
  exports: [CosConfirmDialog],
})
export class CosConfirmDialogModule {}
