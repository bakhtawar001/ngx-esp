import { ProductSearchResultItem } from '@smartlink/models';

export interface CollectionProductSearchResultItem
  extends ProductSearchResultItem {
  IsDeleted?: boolean;
}
