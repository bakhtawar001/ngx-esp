import { Instruction } from '../instruction.model';
import { ProductCategory } from '../product-category.model';
import { ShippingDetail } from '../shipping-detail.model';
import { TaxRate } from '../tax-rate.model';
import { Vendor } from '../vendor.model';
import {
  DecorationLineItem,
  DecorationLineItemDomainModel,
} from './decoration-line-item.model';
import {
  ProductVariant,
  ProductVariantDomainModel,
} from './product-variant.model';
import {
  ServiceCharge,
  ServiceChargeDomainModel,
} from './service-charge.model';
import {
  LineItemCommonProps,
  LineItemRelationship,
  LineItemTotalProps,
  RootLineItem,
} from './_line-item-shared.model';

export interface ProductLineItem extends LineItemCommonProps, RootLineItem {
  Type: 'product';
  Relationships: LineItemRelationship[];
  Supplier: Vendor;
  ProductId?: number;
  ImageUrl?: string;
  Number?: string;
  ShippingDetail?: ShippingDetail;
  ShippingDetails?: ShippingDetail[];
  Variants: ProductVariant[];
  ServiceCharges: ServiceCharge[];
  Decorations: DecorationLineItem[]; // Product Decoration has charges too!
  Categories?: ProductCategory[];
  Instructions?: Instruction[];
  CPN?: string;
  ChargeTaxesOnShipping?: boolean;
  TaxRates?: TaxRate[];
}

export interface ProductLineItemDomainModel
  extends ProductLineItem,
    LineItemTotalProps {
  Variants: ProductVariantDomainModel[];
  ServiceCharges: ServiceChargeDomainModel[];
  Decorations: DecorationLineItemDomainModel[]; // Product Decoration has charges too!
  QuantityOrdered: number;
}
