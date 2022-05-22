import { Inventory } from './inventory';
import { Product } from './product';

export interface ProductView {
  product: Product;
  inventory: Inventory;
  media: any;
}
