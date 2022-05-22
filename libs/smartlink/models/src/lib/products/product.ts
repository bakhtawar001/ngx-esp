import { Entity } from '@smartlink/common';
import type { Supplier } from '@smartlink/suppliers';
import { Attribute } from './attribute';
import { Price } from './price';
import { VirtualSampleImage } from './virtual-sample-image';

export class Product {
  Id!: number;
  Name!: string;

  AdditionalInfo?: string;

  Attributes!: {
    Colors?: Attribute;
    Sizes?: Attribute;
    Materials?: Attribute;
    Shapes?: Attribute;
  };

  BatteryInfo?: any;

  Catalog?: Catalog;
  Catalogs?: Catalog[];
  Categories!: Category[];
  Certifications?: any;
  ConfirmThroughDate?: string;
  Currencies!: string[];
  Currency!: string;

  Description!: string;
  DistributorComments?: string;

  HasFullColorProcess?: boolean;
  HasInventory?: boolean;
  HasProp65Warning?: boolean;
  HasRushService?: boolean;
  HasVideo?: boolean;
  HasVirtualSample?: boolean;
  HighestPrice!: Price;

  ImageUrl?: string;
  Images?: string[];
  Imprinting?: {
    AdditionalInfo?: string;

    Colors?: Attribute;

    FullColorProcess?: boolean;

    Locations?: Attribute;

    Methods?: Attribute;

    Options?: any;

    Personalization?: boolean;

    Services?: Attribute;
    Sizes?: Attribute;
    SoldUnimprinted?: boolean;
  };
  IsAssembled?: any;
  IsConfirmed?: boolean;
  IsDeleted?: boolean;
  IsNew?: boolean;

  LineNames?: string[];
  LowestPrice!: Price;

  Number?: string;
  Numbers?: string[];

  Options?: any;
  Origin?: any[];

  Packaging?: any;
  PriceIncludes?: string;
  Prices?: Price[];
  ProductionTime?: ProductionTime[];
  Prop65AdditionalInfo?: string;

  RushTime?: RushTime[];

  Samples?: any;
  Services?: any;
  Shipping?: Shipping;
  ShortDescription?: string;
  Specials?: Special[];
  Supplier?: Supplier;

  Themes?: string[];
  TradeNames?: string[];

  Upc?: string;
  UpdateDate!: string;

  VariantId?: number;
  Variants?: Variant[];
  VirtualSampleImages?: VirtualSampleImage[];

  Warnings?: Warning[];
  WarrantyInfo?: any;
  Weight?: any;
  Disclaimer?: string;
}

export class RushTime {
  Name!: string;
  Days!: number;
  Description?: string;
}

export class ProductionTime {
  Name!: string;
  Description!: string;
  Days!: number;
}

export class Category {
  Id!: string;
  Name!: string;
  Parent?: Category;
}

export class Catalog {
  Id!: number;
  Name!: string;
  Year!: string;
  Asset!: string;
  CompanyId!: number;
  ProductCount!: number;
  EndUserSafe!: boolean;
  Pages!: Page[];
}

export class Page {
  Id!: number;
  Number!: string;
  SequenceNumber!: string;
  SpreadNumber!: string;
}

export class Warning {
  Name!: string;
  Description!: string;
  Warning!: string;
  Type!: string;
}

export class Variant extends Entity {
  Number?: string;
  Attributes?: any;
  Description?: string;
  ImageUrl?: string;
  PriceIncludes?: string;
  Prices!: Price[];
  Values?: VariantValue[];
}

export class VariantValue extends Entity {
  Code!: string;
  Description!: string;
  Values!: VariantValueValue[];
}

export class VariantValueValue extends Entity {
  Seq!: number;
}

export class Shipping {
  Carriers: any;
  FOBPoints: any;
  Options: any;
  Weight: any;
  WeightUnit?: string;
  WeightPerPackage?: number;
  PackageUnit?: string;
  ItemsPerPackage?: number;
  BillsByWeight!: boolean;
  BillsBySize!: boolean;
  PackageInPlainBox!: boolean;
  Dimensions!: {
    Description: string;
    Length: string;
    LengthUnit: string;
    Width: string;
    WidthUnit: string;
    Height: string;
    HeightUnit: string;
  };
}

export class Special {
  Code!: string;
  CurrencyCode!: string;
  DateDisplay!: string;
  Description!: string;
  Discount!: number;
  DiscountUnit!: string;
  FromDate!: string;
  Id!: number;
  ImageUrl!: string;
  Name!: string;
  ThroughDate!: string;
  Type!: string;
  TypeCode!: string;
  TypeDescription!: string;
}
