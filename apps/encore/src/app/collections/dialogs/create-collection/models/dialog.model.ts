import { Collection, CollectionProduct } from '@esp/collections';

export interface CreateCollectionDialogData {
  collection?: Collection;
  products?: CollectionProduct[];
}

export type CreateCollectionDialogResult = Collection;
