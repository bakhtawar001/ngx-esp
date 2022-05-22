import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  NgModule,
} from '@angular/core';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { CosButtonModule } from '@cosmos/components/button';
import { CosRadioModule } from '@cosmos/components/radio';
import { UntilDestroy } from '@ngneat/until-destroy';
import { MakePaymentDialogData, MakePaymentDialogResult } from './models';

@UntilDestroy()
@Component({
  selector: 'esp-make-payment-dialog',
  templateUrl: './make-payment.dialog.html',
  styleUrls: ['./make-payment.dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MakePaymentDialog {
  constructor(
    private _dialogRef: MatDialogRef<
      MakePaymentDialog,
      MakePaymentDialogResult
    >,
    @Inject(MAT_DIALOG_DATA) private data: MakePaymentDialogData
  ) {}
}

@NgModule({
  declarations: [MakePaymentDialog],
  imports: [
    CommonModule,
    MatDialogModule,
    CosButtonModule,
    MatDividerModule,
    CosRadioModule,
  ],
})
export class MakePaymentDialogModule {}
