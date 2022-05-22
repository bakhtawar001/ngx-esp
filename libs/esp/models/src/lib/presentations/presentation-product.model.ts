import { Price, PriceGrid } from '@smartlink/models';

// TODO: Temporarily extends Product

export interface Currency {
  Code?: string;
  Name?: string;
  Description?: string;
  Symbol?: string;
  DecimalSeparator?: string;
  GroupSeparator?: string;
}

export interface PresentationMedia {
  IsVisible: boolean;
  Sequence: number;
  Id: number;
  Type?: string;
  Url?: string;
  IsPrimary: boolean;
  IsVirtualSampleReady: boolean;
  Attributes?: number[];
  IsAvailable: boolean;
}

export interface PresentationProduct {
  Id: number;
  ProductId: number;
  IsVisible: boolean;
  ShowMinMaxRange: boolean;
  AdjustmentType?: string;

  Adjustment: number;
  RoundPricesToTwoDecimal: boolean;
  Sequence: number;
  Supplier: {
    AsiSupplierId?: number;
    Id?: number;
  };
  Status?: string;
  Like?: string;
  Note?: string;
  Name?: string;
  Description?: string;
  Summary?: string;
  Number?: string;
  DefaultMedia: PresentationMedia;
  Media: PresentationMedia[];
  Attributes: PresentationProductAttribute[];
  PriceGrids: PriceGrid[];
  Charges: any[];
  Currencies: Currency[];
  LowestPrice: Price;
  HighestPrice: Price;
  UpdateDate?: string;
  ExpirationDate?: string;
  PublishDate?: string;
  SKU?: any[];
}

export interface PresentationProductAttribute {
  Id?: number;
  Name: string;
  Description?: string;
  Type: string;
  TypeGroup?: string;
  Roles?: number[];
  IsRequired: boolean;
  IsMultiSelect?: boolean;
  Values?: AttributeValue[];
}

export interface AttributeValue {
  IsVisible: boolean;
  Sequence: number;
  Id: number;
  Value: string;
  ValueGroup: string;
  Description: string;
  SetId: number;
  Type: string;
  Number: string;
  ImageUrl: string;
  Media: PresentationMedia[];
  Charges: number[];
  VendorCode: string;
  PriceGridId: number;
  DisplaySequence: number;
  SKU: string[];
  CodedValue: string;
  IsAvailable: boolean;
  IsSelected: boolean;
}

export interface ProductSequence {
  Id: number;
  Sequence: number;
}
