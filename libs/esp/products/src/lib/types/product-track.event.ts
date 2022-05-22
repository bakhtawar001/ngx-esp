import { TrackEventData } from '@cosmos/analytics';

export interface AdTrackEvent {
  id: number;
  index?: number;
  serveTypeCode?: string;
  levelId?: number;
}

export interface SourceTrackEvent {
  id: number;
  component?: string;
}

export interface Product {
  id: number;
  ad?: AdTrackEvent;
  objectID?: string;
  productIndex?: number;
  currencyCode?: string;
  organicIndex?: number;
}

export interface ProductExtras extends TrackEventData {
  source?: SourceTrackEvent;
  marketSegmentCode?: 'ALL';
  pageUrlName?: string;
  pageNumber?: number;
  index?: string;
  queryID?: string;
  referrer?: SourceTrackEvent;
}

export interface ProductViewEvent extends ProductExtras {
  products: Array<Product>;
}

export interface ProductTrackEvent extends Product, ProductExtras {}

export interface ProductCollectionTrackEvent extends ProductExtras {
  id: number;
  products: number[];
  productsDuplicated: number[];
  productsTruncated: number[];
}

export interface ProductCollectionRemoveEvent extends ProductExtras {
  id: number;
  products: number[];
}

export interface CollectionDeleteEvent extends TrackEventData {
  id: number;
  name: string;
}

export interface CollectionArchivedEvent extends TrackEventData {
  id: number;
  name: string;
}

export interface CollectionTransferredEvent extends TrackEventData {
  id: number;
  name: string;
  userId: number;
}
export interface CollectionCreateEvent extends TrackEventData {
  id: number;
  name: string;
  source?: SourceTrackEvent;
}

export interface SupplierDetailViewedEvent extends TrackEventData {
  id: number;
  marketSegmentCode?: 'ALL';
}
