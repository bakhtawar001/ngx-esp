import { IAuditable } from '../../common';

export interface LineItemCommonProps
  extends IAuditable,
    MissingProps,
    LineItemCurrencyInfo {
  Id: number;
  CorrelationId: string;
  // Type: 'product' | 'service' | 'title'; // used as a discriminator
  // Name: string; // found on all types except service charges
  Description: string;
  // Relationships: LineItemRelationship[];
  Sequence: number;
  // Supplier: Supplier;
  ShippingGroup: number;
  Status: string; //"Open"
  VendorNotesVisible: boolean;
}

export interface RootLineItem {
  Name: string;
  Attributes?: LineItemAttribute[];
}

/**
 * Mark: I haven't seen these in the JSON data, so not sure what they belong to
 */
interface MissingProps {
  // TaxableAmount?: number;
}

export interface LineItemCurrencyInfo {
  CurrencyCode: string;
  CurrencySymbol: string;
  ConversionRate: number;
}

export interface LineItemTotalProps {
  Totals: LineItemTotals;
  ConversionTotals: LineItemTotals;
  /* Removed for now, only populated by API, but redundant to Totals prop
  TotalUnits: number;
  TotalPrice: number;
  TotalCost: number;
  */
  /* Removed for now, only populated by API, but redundant to ConvertedTotals prop
  ConvertedTotalPrice: number;
  ConvertedTotalCost: number;
  */
}

export interface PricedLineItem {
  // CorrelationId: string; // is this needed on this interface specifically? commented out for now. TODO(Mark): review this
  CurrencyCode: string;
  IsVisible: boolean;
  Quantity: number;
  QuantityOrdered?: number;
  QuantityInvoiced?: number;
  Price: number;
  Cost: number;
  IsTaxable: boolean;
  IncludeOnPackingList?: boolean;
  Discount?: number; //?
  // CurrencyType
  // TaxabilityType
}

export interface PricedLineItemConverted {
  /* Removed for now, not used. Single unit converted totals
  ConvertedPrice?: number;
  ConvertedCost?: number;
  */
}

export declare interface LineItemTotals {
  Units?: number;
  Amount: number;
  Cost: number;
  Margin: number;
  TaxableAmount: number;
  SalesTax?: number; // TODO: Need to figure out where this needs to be and when
}

export declare interface LineItemRelationship {
  Relationship: string;
  OrderId: number;
  OrderNumber: string;
  LineItemId: number;
}

export declare interface LineItemAttribute {
  Key: string;
  Value: string;
}
