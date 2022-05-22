import { Collection } from '@esp/collections';

export interface AddToCollectionDialogData {
  currentCollectionId?: number;
}

export type AddToCollectionDialogResult = Collection | 'create';
