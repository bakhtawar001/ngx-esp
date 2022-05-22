import { Entity } from '../common';
import { Instruction } from './instruction.model';
import {
  LineItem,
  OrderLineItemDomainModel,
} from './line-item/order-line-item';
import { ProductLineItemDomainModel } from './line-item/product-line-item.model';
import { MediaLink } from './media-link.model';
import { OrderContact } from './order-contact.model';
import { OrderCurrency } from './order-currency.model';
import { OrderDocument } from './order-document.model';
import { OrderNote } from './order-note.model';
import { OrderRelationship } from './order-relationship.model';
// import { OrderStatusHistory } from './order-status.model';
import { Payment } from './payment.model';
import { ShippingDetail } from './shipping-detail.model';
import { TrackingDetail } from './tracking-detail.model';
import { WebsiteOrder } from './website-order.model';

export type OrderType = 'order' | 'invoice' | 'quote' | 'samplerequest';

export interface Order {
  Id?: number;
  Type: OrderType;
  Number?: string;
  Description?: string;
  CreatorOrderNo?: string;
  Date?: string;
  Salespersons?: Entity[];
  Discount?: number;
  POReference?: string;
  Status?: string;
  // Statuses?: OrderStatusHistory[];
  CreditTerm?: string;
  PaymentMethod?: string;
  Payments?: Payment[];
  BillingContact?: OrderContact;
  AcknowledgementContact?: OrderContact;
  ShippingContact?: OrderContact;
  InquiryContact?: OrderContact;
  ShippingSameAsBilling?: boolean;
  AcknowledgementSameAsBilling?: boolean;
  ShippingDetail?: ShippingDetail;
  InHandsDate?: string;
  IsInHandsDateFlexible?: boolean;
  ShipDate?: string;
  // @Type(() => LineItem)
  LineItems?: LineItem[];
  // Customer: CompanyView;
  Instructions?: Instruction[];
  Documents?: OrderDocument[];
  TrackingDetails?: TrackingDetail[];
  Tags?: string[];
  Notes?: OrderNote[];
  References?: Order[];
  Relationships?: OrderRelationship[];
  WebsiteOrders?: WebsiteOrder[];
  IsBlindShip?: boolean;
  Version?: number;
  UniqueCode?: string;
  CurrencyCode?: string;
  CurrencySymbol?: string;
  CurrencyRate?: number;
  MediaLinks?: MediaLink[];
  Currencies?: OrderCurrency[];
  TotalAmount?: number;
  TotalCost?: number;
  Subtotal?: number;
  TotalDiscountAmount?: number;
  TotalMargin?: number;
  TotalMarginPercent?: number;
  TotalSalesTaxAmount?: number;
  AmountDue?: number;
  AmountPaid?: number;
  CanEditOrderNumber?: boolean;
  ReorderType?: string;
  CreateDate?: string;
  CreatedBy?: string;
  UpdateDate?: string;
  UpdatedBy?: string;
  ProjectId?: number;

  // AccessLevel: OrderAccessLevel;
  IsVisible: boolean;
  IsEditable: boolean;
}

export interface OrderTotals {
  ProductAmount?: number;
  Amount: number;
  DiscountAmount: number;
  Cost: number;
  Margin: number;
  MarginPercent: number;
  SalesTax: number;
  TotalAmount: number;
  AmountDue: number;
  AmountPaid: number;
}

export interface ShippingDestination {
  Id: number;
  ShippingDetail: ShippingDetail;
  Products: ProductLineItemDomainModel[];
}

export interface OrderDomainModel extends Order {
  LineItems?: OrderLineItemDomainModel[];
  Totals: OrderTotals;
  ShippingDestinations?: ShippingDestination[];
}

function getTotalPayments(order: Order): number {
  if (order.Payments) {
    return order.Payments.reduce((acc, payment) => {
      if (order.Currencies) {
        const currency = order.Currencies.filter((c) => {
          return c.ConversionRate && c.CurrencyCode === payment.CurrencyCode;
        });

        if (currency.length) {
          acc += currency[0].ConversionRate * payment.Amount;
        }
      }

      return acc;
    }, 0);
  } else {
    return 0;
  }
}
