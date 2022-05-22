import { MediaLink } from './media-link.model';
import { OrderContact } from './order-contact.model';

export declare interface ShippingDetail {
  Id: number;
  From: OrderContact;
  To: OrderContact;
  InHandsDate?: Date;
  IsInHandsDateFlexible?: boolean;
  ShipDate?: Date;
  ExpectedDate?: Date;
  Carrier: string;
  CarrierName: string;
  AccountNumber: string;
  IsPrimary?: boolean;
  ShippingAccountVisible: boolean;
  IsBlindShip?: boolean;
  ShippingFiles: MediaLink[];
  Sequence: number;
}
