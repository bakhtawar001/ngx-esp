import { TaxRate } from '../tax-rate.model';
import { Vendor } from '../vendor.model';
import {
  LineItemAttribute,
  LineItemCommonProps,
  LineItemRelationship,
  LineItemTotalProps,
  PricedLineItem,
  PricedLineItemConverted,
  RootLineItem,
} from './_line-item-shared.model';

export interface ServiceLineItem
  extends LineItemCommonProps,
    RootLineItem,
    PricedLineItem,
    PricedLineItemConverted {
  Type: 'service';
  Name: string;
  Relationships: LineItemRelationship[];
  Supplier: Vendor;
  ServiceType?: string;
  TaxRates?: TaxRate[];
  Attributes?: LineItemAttribute[];
}

export interface ServiceLineItemDomainModel
  extends ServiceLineItem,
    LineItemTotalProps {}
