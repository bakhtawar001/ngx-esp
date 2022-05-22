import { TrackEventData } from '@cosmos/analytics';

export interface SupplierTrackEvent extends TrackEventData {
  id: number;
  productId?: number;
}
