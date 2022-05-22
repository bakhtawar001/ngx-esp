import {
  LineItemCommonProps,
  LineItemTotals,
  PricedLineItem,
  PricedLineItemConverted,
} from './_line-item-shared.model';

export interface ServiceCharge
  extends LineItemCommonProps,
    PricedLineItem,
    PricedLineItemConverted {
  ServiceType?: string;
  IsRunCharge: boolean;
}

export interface ServiceChargeDomainModel extends ServiceCharge {
  // NOTE: replaced the "extends LineItemTotalProps" with this because the service charge
  //  which is not a line item itself may not need all of these these, but only the 'Totals' prop
  Totals: LineItemTotals;
  ConversionTotals: LineItemTotals;
  MarginPercent: number;
}

export const defaultServiceCharge: Partial<ServiceCharge> = {
  IsRunCharge: false,
  ServiceType: 'GSCH',
  Description: '',
  Quantity: 1,
  Price: 0,
  Cost: 0,
  // ConvertedPrice: 0,
  // ConvertedCost: 0,
  IsTaxable: true,
  IsVisible: true,
  CurrencyCode: 'USD',
};
