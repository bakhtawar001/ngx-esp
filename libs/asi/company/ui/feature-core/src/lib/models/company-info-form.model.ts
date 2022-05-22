import { Address, Email, Phone } from '@esp/models';

export interface CompanyInfoFormModel {
  Name?: string;
  GivenName?: string;
  FamilyName?: string;
  Address?: Address;
  PrimaryEmail?: Email;
  Phone?: Phone;
  PrimaryBrandColor?: string;
  LogoImageUrl?: string;
  IconImageUrl?: string;
  IsAcknowledgementContact?: boolean;
  IsBillingContact?: boolean;
  IsShippingContact?: boolean;
  IsCustomer?: boolean;
  IsDecorator?: boolean;
  IsProspect?: boolean;
  IsSupplier?: boolean;
}
