import { Price } from './price';

export interface Attribute {
  Name?: string;
  Description?: string;
  Type?: string;
  Values?: AttributeValueType[];
}

export interface AttributeValue {
  Code?: string;
  Name: string;
  ProductNumber?: string;
  SKU?: string;
  Description?: string;
  ImageUrl?: string;
  Charges?: Charge[];
  Options?: any;
  VendorCode?: string;
  IsAvailable?: boolean;
  Values?: string[];
}

export interface Charge {
  Description: string;
  IsRequired: boolean;
  PriceIncludes: string;
  Prices: Price[];
  Type?: string;
  TypeCode?: string;
  UsageLevel?: string;
  UsageLevelCode?: string;
}

export type AttributeValueType = AttributeValue | string;

// string Code { get; set; }
// string Name { get; set; }
// string Description { get; set; }
// string ImageUrl { get; set; }
// bool? IsAvailable { get; set; }
// bool? IsSelected { get; set; }
// List<IProductOptionSet> Options { get; set; }
// List<IProductCharge> Charges { get; set; }
// string ProductNumber { get; set; }
// string VendorCode { get; set; }
// string SKU { get; set; }
