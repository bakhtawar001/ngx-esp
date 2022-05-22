import { ShareableSearch } from '../../common';
import { Address } from '../index';
export interface SimpleParty {
  Id: number;
  Name: string;
  Email: string;
  Phone: string;
  IsCompany: boolean;
  IsPerson: boolean;
}

export interface Owner {
  Id: number;
  IsActive: boolean;
  Name: string;
  PersonId: number;
  IconImageUrl?: string;
}

export interface PartySearch extends ShareableSearch {
  Id: number;
  Name: string;
  PrimaryAddress: Address;
  Addresses: Address[];
  PrimaryPhone: string;
  Emails: string[];
  PrimaryEmail: string;
  PrimaryWebsite: string;
  CreateDate: string;
  UpdateDate: string;
  LastActivityDate: string;
  IsActive: boolean;
  Tags: string[];
  FirstCharacter: string;
  LastNameFirstCharacter: string;
  SitaDomain: string;
  ExternalRecordId: string;
  IconImageUrl?: string;
  IconMediaId?: number;
  AcknowledgementContact?: SimpleParty;
  Owner?: Owner;
}
