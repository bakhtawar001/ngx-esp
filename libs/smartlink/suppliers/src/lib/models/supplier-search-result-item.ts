import { Address } from './address';
import { Phone } from './phone';
import { Rating } from './ratings';

export interface SupplierSearchResultItem {
  Id: number;
  Name: string;
  AsiNumber: string;
  Address?: Address;
  Phone?: Phone;
  Fax?: string;
  Email?: string;
  Websites?: string[];
  Products?: number;
  Rating?: Rating;
  Preferred?: {
    Rank: number;
    Name: string;
  };
  Tags?: string[];
}
