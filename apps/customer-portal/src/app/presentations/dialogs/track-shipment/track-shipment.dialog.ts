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
import { CosCardModule } from '@cosmos/components/card';
import { CosPillModule } from '@cosmos/components/pill';
import { UntilDestroy } from '@ngneat/until-destroy';
import { TrackShipmentDialogData, TrackShipmentDialogResult } from './models';

@UntilDestroy()
@Component({
  selector: 'esp-track-shipment-dialog',
  templateUrl: './track-shipment.dialog.html',
  styleUrls: ['./track-shipment.dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackShipmentDialog {
  constructor(
    private _dialogRef: MatDialogRef<
      TrackShipmentDialog,
      TrackShipmentDialogResult
    >,
    @Inject(MAT_DIALOG_DATA) private data: TrackShipmentDialogData
  ) {}
}

@NgModule({
  declarations: [TrackShipmentDialog],
  imports: [
    CommonModule,
    MatDialogModule,
    CosButtonModule,
    MatDividerModule,
    CosCardModule,
    CosPillModule,
  ],
})
export class TrackShipmentDialogModule {}
