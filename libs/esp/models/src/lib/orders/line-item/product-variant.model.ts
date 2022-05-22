import { ProductAttribute } from '../product-attribute.model';
import {
  LineItemCommonProps,
  LineItemTotalProps,
  PricedLineItem,
  PricedLineItemConverted,
} from './_line-item-shared.model';

export interface ProductVariant
  extends LineItemCommonProps,
    PricedLineItem,
    PricedLineItemConverted {
  Name?: string;
  VariantId?: number;
  ProductAttributes: ProductAttribute[];
  SKU: string;
}

export interface ProductVariantDomainModel
  extends ProductVariant,
    LineItemTotalProps {
  MarginPercent: number;
}
