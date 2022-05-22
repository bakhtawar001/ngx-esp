import { Address, Email, Phone, Website, Company } from '@esp/models';

export interface CreateContactPayload {
  GivenName: string;
  FamilyName: string;
  PrimaryEmail?: Email;
  CompanyPayload: CompanyPayload;
  Address?: Address;
  Phone?: Phone;
  Website?: Website;
}

export interface CompanyPayload {
  Company: Partial<Company>;
  Title: string;
}
