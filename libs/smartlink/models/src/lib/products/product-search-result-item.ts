import { Entity } from '@smartlink/common';
import { SupplierSearchResultItem } from '@smartlink/suppliers';
import { Price } from './price';
import { VirtualSampleImage } from './virtual-sample-image';

export class CatalogPage {
  Number?: string;
  SpreadNumber?: string;
}

export class ProductSearchResultItem extends Entity {
  Ad?: any;
  Description!: string;
  ShortDescription!: string;
  Number!: string;
  ImageUrl!: string;
  VirtualSampleImages?: VirtualSampleImage[];
  ConfigId?: string;
  Supplier!: SupplierSearchResultItem;
  Price!: Price;
  IsNew!: boolean;
  IsConfirmed!: boolean;
  HasInventory!: boolean;
  CatalogPage?: CatalogPage;
  HasVirtualSample?: boolean;
  ColorCount?: number;
  OrganicIndex?: number;
  ObjectId?: string;
}
