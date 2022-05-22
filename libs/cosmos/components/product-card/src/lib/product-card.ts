import { AttributeTag } from '@cosmos/components/product-card-tags';
import { Supplier } from '@cosmos/components/supplier';

export interface Ad {
  Id: number;
  Index?: number;
  LevelId?: number;
  Position?: number;
  Row?: number;
  Type?: 'RTP' | 'PFP';
}

export interface ProductCard {
  Ad?: Ad;
  Id: number;
  Name: string;
  Number?: string;
  ImageUrl?: string;
  Images?: string[];
  IsDeleted?: boolean;
  Supplier?: Supplier;
  VariantTag?: string;
  Price?: {
    Quantity: number;
    Price: number;
    Cost: number;
    DiscountCode: string;
    CurrencyCode: string;
    PreferredPrice?: number;
    PreferredPriceText?: string;
  };
  AttributeTags?: AttributeTag[];
  ShowAdLabel?: boolean;
}

export const AD_TYPES_FOR_AD_LABEL: string[] = ['PFP', 'RTP'];
