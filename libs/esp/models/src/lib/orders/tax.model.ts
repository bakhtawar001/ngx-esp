import { TaxComponent } from './tax-component.model';

export declare interface Tax {
  Id: number;
  Name: string;
  Components: TaxComponent[];
  TotalRate: number;
  IsDefault: boolean;
  IsActive: boolean;
  State: string;
  PostalCode: string;
  Country: string;
  CountryType: string;
  ChargeTaxOnShipping: boolean;
}
