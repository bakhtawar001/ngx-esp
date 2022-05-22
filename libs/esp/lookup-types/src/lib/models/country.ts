import { Lookup } from './lookup';

export interface CountryType extends Lookup {
  Alpha3: string;
  PhonePrefix: string;
  PhoneCode: string;
  CurrencyCode: string;

  IsUsAddress(s: string): boolean;
}
