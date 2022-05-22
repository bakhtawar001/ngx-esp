import { Injectable } from '@angular/core';
import { DialogService } from '@cosmos/core';
import { customizeProductDialogDef } from '../dialogs/customize-product/customize-product.config';
import { CustomizeProductDialogData } from '../dialogs/customize-product/models';
import { makePaymentDialogDef } from '../dialogs/make-payment/make-payment.config';
import { MakePaymentDialogData } from '../dialogs/make-payment/models';
import { TrackShipmentDialogData } from '../dialogs/track-shipment/models';
import { trackShipmentDialogDef } from '../dialogs/track-shipment/track-shipment.config';

@Injectable({
  providedIn: 'root',
})
export class PresentationDialogService {
  constructor(private readonly _dialog: DialogService) {}

  customizeProductDialog(data: CustomizeProductDialogData) {
    return this._dialog.open(customizeProductDialogDef, data);
  }

  makePaymentDialog(data: MakePaymentDialogData) {
    return this._dialog.open(makePaymentDialogDef, data);
  }

  trackShipmentDialog(data: TrackShipmentDialogData) {
    return this._dialog.open(trackShipmentDialogDef, data);
  }
}
