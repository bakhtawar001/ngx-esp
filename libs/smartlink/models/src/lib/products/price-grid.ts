import { Price } from './price';

export interface PriceGrid {
  IsVisible?: boolean;
  Sequence?: number;
  Id: number;
  Description?: string;
  Prices: Price[];
  PriceIncludes?: string;
  UsageLevel?: string;
  Attributes?: number[];
  IsAvailable?: boolean;
}
