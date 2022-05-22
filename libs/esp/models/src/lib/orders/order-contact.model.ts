// import { AddressView, PartyView } from '../CRM';

import { Address, Phone } from '../parties';

export interface OrderContact {
  Id: number;
  Name: string;
  CompanyName?: string;
  EmailAddress?: string;
  Address: Address;
  Company?: PartyView;
  Party?: PartyView;
  UserId?: number;
}
export interface PartyView {
  IsCompany: boolean;
  IsPerson: boolean;
  Id: number;
  Name: string;
  Addresses: Address[];
  Phones: Phone[];
  Emails: EmailView[];
  OwnerId: number;
  AccessLevel: OrderAccessLevelType;
  Access?: AccessView[];
  IsVisible: boolean;
  IsEditable: boolean;
}

export interface EmailView {
  Id: number;
  Address: string;
  IsPrimary: boolean;
  Type: EmailType;
}

export enum EmailType {
  Artwork = 'Artwork',
  Order = 'Order',
  Work = 'Work',
  RushOrder = 'RushOrder',
  SampleOrder = 'SampleOrder',
  Other = 'Other',
  Home = 'Home',
}

export enum OrderAccessLevelType {
  Custom = 'Custom',
  Everyone = 'Everyone',
  Owner = 'Owner',
}

export interface AccessView {
  AccessLevel: AccessLevelType;
  EntityId: number;
}

export enum AccessLevelType {
  User = 'User',
}

/*
// export interface AcknowledgementContact {
//   Id: number;
//   Name: string;
//   CompanyName?: string;
//   EmailAddress?: Address;
//   Address: AddressElement;
//   Company: Company;
//   Party: Company;
// }

// export enum City {
//   Emeryville = 'EMERYVILLE',
//   FeastervilleTrevose = 'Feasterville-Trevose',
//   Philadelphia = 'Philadelphia',
// }

// export enum Country {
//   UnitedStates = 'United States',
// }

// export enum CountryTypeEnum {
//   CA = 'CA',
//   Us = 'US',
//   Usa = 'USA',
// }

// export enum County {
//   BucksCounty = 'Bucks County',
//   PhiladelphiaCounty = 'Philadelphia County',
// }

// export enum Line1 {
//   The2100PowellStreet = '2100 Powell Street',
//   The4800StreetRD = '4800 Street Rd',
//   The687NBroadSt = '687 N Broad St',
// }

// export enum Line2 {
//   Suite800 = 'Suite 800',
// }

// export enum Name {
//   Address2 = 'address 2',
//   The1800GotJunk = '1-800-Got-Junk?',
// }

// export interface Phone {
//   Id: number;
//   Type: PhoneType;
//   PhoneCode: string;
//   Country: CountryTypeEnum;
//   Number: Number;
//   Extension?: string;
//   IsPrimary?: boolean;
// }

// export enum Number {
//   Empty = '',
//   Mobilep = 'MOBILEP',
//   The2159428616 = '(215) 942-8616',
//   The2159533026 = '2159533026',
//   The2159534000 = '(215) 953-4000',
//   The5106452574 = '5106452574',
//   The8005461350 = '(800) 546-1350',
//   The8008299240 = '(800) 829-9240',
// }

// export enum PhoneType {
//   Mobile = 'Mobile',
//   Office = 'Office',
//   OfficeFax = 'OfficeFax',
//   OrdersFax = 'OrdersFax',
//   Other = 'Other',
// }

// export enum State {
//   CA = 'CA',
//   Pa = 'PA',
// }

// export enum AddressType {
//   Gnrl = 'GNRL',
// }

// export interface Company { > Party
//   IsCompany: boolean;
//   IsPerson: boolean;
//   Id: number;
//   Name: string;
//   Addresses: AddressElement[];
//   Phones: Phone[];
//   Emails: Email[];
//   OwnerId: number;
//   AccessLevel: OrderAccessLevel;
//   Access?: Access[];
//   IsVisible: boolean;
//   IsEditable: boolean;
// }

// export interface Access {
//   AccessLevel: AccessAccessLevel;
//   EntityId: number;
// }

// export enum AccessAccessLevel {
//   User = 'User',
// }

// export interface Email {
//   Id: number;
//   Address: Address;
//   IsPrimary: boolean;
//   Type: EmailType;
// }

// export enum Address {
//   ClintonburnsGmailCOM = 'clintonburns@gmail.com',
//   CustomerserviceAsicentralCOM = 'customerservice@asicentral.com',
//   IdeasAsicentralCOM = 'ideas@asicentral.com',
// }

// export enum EmailType {
//   Artwork = 'Artwork',
//   Order = 'Order',
//   Work = 'Work',
// }
export interface InquiryContact {
  Id: number;
  Name: string;
  Address: InquiryContactAddress;
  Party: Company;
  UserId: number;
}

export interface InquiryContactAddress {
  Id: number;
  Phone: Phone;
  IsPrimary: boolean;
}
*/
