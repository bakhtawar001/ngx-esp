import { Lookup } from './lookup';

export class CurrencyType implements Lookup {
  Code: string;
  Name: string;
  Description: string;
  Sequence: number;
  CreateDate: string;
  CreateOffset: string;
  CreatedBy: string;
  UpdateDate?: string;
  UpdateOffset?: string;
  UpdatedBy: string;
  AuditId?: string;

  DefaultUsd = 'USD';
  Cad = 'CAD';
  DollarSymbol = '$';
  CanadianDollarSymbol = 'C$';

  GetCurrencySymbol(typeCode: string): string {
    switch (typeCode) {
      case 'DefaultUsd':
        return this.DollarSymbol;
      case 'Cad':
        return this.CanadianDollarSymbol;
      default:
        return this.DollarSymbol;
    }
  }
}
