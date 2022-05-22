import { DecorationLineItemDetail } from '../decoration-line-item-detail.model';
import { MediaLink } from '../media-link.model';
import { ProductAttribute } from '../product-attribute.model';
import { ShippingDetail } from '../shipping-detail.model';
import { Vendor } from '../vendor.model';
import {
  ServiceCharge,
  ServiceChargeDomainModel,
} from './service-charge.model';

export declare interface DecorationLineItem extends Decoration {
  ShippingDetail: ShippingDetail;
  Status: string;
  // Statuses: OrderStatusHistory[];
  RepeatLogo: boolean;
  Details: DecorationLineItemDetail[];
}

export declare interface DecorationLineItemDomainModel
  extends DecorationLineItem {
  ServiceCharges: ServiceChargeDomainModel[];
  Totals: {
    Amount: number;
    Cost: number;
    Margin: number;
  };
}

export declare interface DecorationSetting extends Decoration {
  Name: string;
  CreateDate: string;
}

declare interface Decoration {
  Id: number;
  MediaDescription: string;
  MediaUrl: string;
  MediaType: string;
  Location: ProductAttribute;
  Decoration: ProductAttribute;
  LogoSize: ProductAttribute;
  LogoColors: ProductAttribute[];
  ProofType: string;
  ProofEmail: string;
  CommentsVisible: boolean;
  Comments: string;
  InstructionsVisible: boolean;
  Instructions: string;
  Artwork: MediaLink[];
  Personalization: MediaLink[];
  Decorator: Vendor;
  ServiceCharges?: ServiceCharge[];
}
