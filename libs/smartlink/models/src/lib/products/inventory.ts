import { InventoryQuantity } from './inventory-quantity';

export interface ProductQuantity {
  ProductIdentifier: string;
  Quantities: InventoryQuantity[];
}

export interface Inventory {
  ProductQuantities: ProductQuantity[];
  IsValid: boolean;
  SupplierTimings: number;
  OverallTimings: number;
}
