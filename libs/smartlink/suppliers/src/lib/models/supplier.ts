import { Address } from './address';
import { Phone } from './phone';
import { Rating, Ratings } from './ratings';

export interface Reference {
  Id: number;
  Name: string;
  AsiNumber: string;
  Phone: string;
  Contacts: { Name: string }[];
  Transactions: number;
}

export interface Preferred {
  Rank?: number;
  Name: string;
  Description?: string;
}

export interface Contact {
  Name?: string;
  Title?: string;
  Address?: Address;
  Phone?: Phone | string | null;
  Fax?: Phone | string | null;
  Email?: string;
  Emails?: string[];
  Websites?: string[];
  Comment?: string;
}

export interface ProductionTime {
  Name: string;
  Days:
    | number
    | {
        From: number;
        To: number;
        $index: number;
      };
}

export interface SupplierDocumentation {
  Id: number;
  Name: string;
  Type: string;
  Url: string;
}

export interface Supplier {
  Id: number;
  Name: string;
  AsiNumber: string;

  Address?: {
    Primary?: Address;
    Delivery?: Address;
  };
  Addresses?: {
    Primary: Address;
  };
  Artwork?: Contact;
  Awards?: string[];
  Brands?: string[];
  Contacts?: Contact[];
  DistributionPolicy?: string;
  Documentations?: SupplierDocumentation[];
  Email?: string;
  Fax?: Phone;
  Functions?: string[];
  HasDistributorAffiliation?: boolean;
  ImprintingMethods?: string[];
  IsCanadian?: boolean;
  IsCanadianFriendly?: boolean;
  IsMinorityOwned?: boolean;
  IsQcaCertified?: boolean;
  IsUnionAvailable?: boolean;
  LineNames?: string[];
  Links?: any;
  MarketingPolicy?: string;
  MultiLineReps?: Contact[];
  OfficeHours?: string;
  Orders?: Contact;
  Phone?: Phone;
  Phones?: Phone[];
  Preferred?: Preferred;
  ProductionTime?: ProductionTime;
  Rating?: Rating;
  Ratings?: Ratings;
  References?: {
    AsiNumber: string;
    Contacts: Contact[];
    Id: number;
    Name: string;
    Phone: string;
    Transactions: number;
  }[];
  RushTime?: ProductionTime;
  ShippingPoints?: {
    City: string;
    Country: string;
    IsFOB: boolean;
    State: string;
    Zip: string;
  }[];
  TotalEmployees?: string;
  Type?: string;
  Websites?: string[];
  YearEstablished?: number;
  YearInIndustry?: number;
}
