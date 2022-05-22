import { Tax } from './tax.model';

export declare interface TaxRate {
  Id: number;
  Type: string;
  Rate: number;
  Name: string;
  TaxCode: Tax;
}
