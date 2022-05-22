import { Address, Email, Phone, Website, Company, Contact } from '@esp/models';

export interface CreateContactForm {
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

export type CreateContactData = Partial<CreateContactForm>;
export type CreateContactResult = Contact;
