import { Quantity } from './quantity';

export interface Price {
  Id?: number;
  IsVisible?: boolean;
  Sequence?: number;
  Price?: number;
  Cost?: number;
  DiscountCode?: string;
  DiscountPercent?: number;
  CurrencyCode?: string;
  PreferredPrice?: number;
  PreferredPriceText?: string;
  IsUndefined?: boolean;
  IsQUR?: boolean;
  Quantity?: Quantity;
  ItemsPerUnit?: number;
  PricePerUnit?: number;
  CostPerUnit?: number;
  UnitQuantity?: number;
  // This is a custom property provided on the frontend to know that the price has been added by a distributor.
  IsCustomPrice?: boolean;
}
