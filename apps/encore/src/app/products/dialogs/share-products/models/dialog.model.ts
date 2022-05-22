import { Product, ProductSearchResultItem } from '@smartlink/models';

export interface ShareProductsDialogData {
  products: Product[] | ProductSearchResultItem[];
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type ShareProductsDialogResult = {};
