import { Address } from '@esp/models';
import { AutocompleteValue } from './autocomplete-value';

export class Link {
  Id!: number;
  Name!: string;
  IsCompany!: boolean;
  IsPErson!: boolean;
  IsUser!: boolean;
  Links!: Link[];
}

export interface SimpleParty extends AutocompleteValue {
  Id: number;
  Name: string;
  Address: Address;
  Email: string;
  Phone: string;
  IsCompany: boolean;
  IsPerson: boolean;
  IsUser: boolean;
  Links: Link[];
  ExternalRecordId: string;
}
