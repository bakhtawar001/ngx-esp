import { createDialogDef } from '@cosmos/core';
import { TrackShipmentDialogData, TrackShipmentDialogResult } from './models';

export const trackShipmentDialogDef = createDialogDef<
  TrackShipmentDialogData,
  TrackShipmentDialogResult
>({
  load: async () =>
    (await import(`./track-shipment.dialog`)).TrackShipmentDialog,
  defaultConfig: {
    minWidth: '784px',
    width: '784px',
  },
});
