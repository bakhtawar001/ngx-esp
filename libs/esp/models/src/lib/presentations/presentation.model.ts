import { Company } from '../companies';
import { AccessLevel } from '../common';
import { PresentationProduct } from '../presentations';

export enum PresentationStatus {
  PreShare = 'PreShare',
  PostShare = 'PostShare',
  QuoteRequested = 'Quote Requested',
  QuoteCreated = 'Quote Created',
}

export type PresentationProductSortOrder =
  | 'None'
  | 'PriceAsc'
  | 'PriceDesc'
  | 'NameAsc'
  | 'NameDesc'
  | 'Newest'
  | 'Oldest'
  | 'NumberAsc'
  | 'NumberDesc'
  | 'ProfitAsc'
  | 'ProfitDesc'
  | 'CostAsc'
  | 'CostDesc'
  | 'SupplierNameAsc'
  | 'SupplierNameDesc'
  | 'CategoryAsc'
  | 'CategoryDesc';

export interface PresentationSettings {
  ShowProductColors: boolean;
  ShowProductSizes: boolean;
  ShowProductShape: boolean;
  ShowProductMaterial: boolean;
  ShowProductCPN: boolean;
  ShowProductImprintMethods: boolean;
  ShowProductPricing: boolean;
  ShowProductPriceGrids: boolean;
  ShowProductPriceRanges: boolean;
  ShowProductAdditionalCharges: boolean;
}

export interface Presentation {
  Id: number;
  ProjectId: number;
  IsDeleted: boolean;
  Customer: Company;
  Settings: PresentationSettings;
  CreateDate: string;
  UpdateDate: string | null;
  Note: string | null;
  ExpirationDate: string | null;
  Status: PresentationStatus | null;
  LastViewDate: string | null;
  SharedDate: string | null;
  NumberOfProductsDisliked: number;
  NumberOfProductsQuoted: number;
  Products: PresentationProduct[];
  TenantId: number;
  OwnerId: number;
  AccessLevel: AccessLevel;
  Access: [];
  IsVisible: boolean;
  IsEditable: boolean;
  AllowProductVariants: boolean;
  ShowSignature: boolean;
}
