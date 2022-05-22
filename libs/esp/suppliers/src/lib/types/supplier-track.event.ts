import { TrackEventData } from '@cosmos/analytics';

export interface SupplierExtras extends TrackEventData {
  pageNumber?: number;
  index?: string;
  queryID?: string;
}

export interface SupplierListFilterEvent extends SupplierExtras {
  supplierCount: number;
  resultsPerPage: number;
  sortOrder: string;
}
