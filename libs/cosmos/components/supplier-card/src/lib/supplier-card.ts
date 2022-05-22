export interface SupplierTag {
  Icon?: string;
  Label: string;
}

export interface SupplierCard {
  Id: number;
  Name: string;
  AsiNumber: string;
  SupplierTags?: SupplierTag[];
}
