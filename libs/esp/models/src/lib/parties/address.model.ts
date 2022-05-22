import { Phone } from './phone.model';

export class Address {
  Id?: number;
  Name?: string;
  Line1?: string;
  Line2?: string;
  City?: string;
  County?: string;
  State?: string;
  PostalCode?: string;
  Country?: string;
  CountryType?: string;
  Phone?: Phone;
  IsPrimary?: boolean;
  Type?: string; // AddressType;
}
