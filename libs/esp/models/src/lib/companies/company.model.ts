import { Contact } from '../contacts';
import { LinkRelationship, Party } from '../parties';

export interface Company extends Party {
  PrimaryBrandColor: string;
  Code: string;
  Currency: string;
  TaxCode: any;
  CreditLimit: number;
  DefaultDiscount?: number;
  AsiNumber: string;
  BillingContact: Contact;
  ShippingContact: Contact;
  AcknowledgementContact: Contact;
  DefaultSalesPerson: string;
  CreditTerms: string[];
  Decorations: string[];
  PaymentMethods: string[];
  ShippingAccounts: any[];
  Links: LinkRelationship[];
  IsCustomer: boolean;
  IsSupplier: boolean;
  IsDecorator: boolean;
  IsProspect: boolean;
  IsAsiMember: boolean;
  EmailDomains: string[];
  CanEditVisibility: boolean;
  IsTaxExempt: boolean;
  TaxCertificates: any[];
  WebsiteContactCount: number;
  ProofType: string;
  ProofEmail: string;
  SalesTarget?: number;
  MinimumMargin?: number;
}
