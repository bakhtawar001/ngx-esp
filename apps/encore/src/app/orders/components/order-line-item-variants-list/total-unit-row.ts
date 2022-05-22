import {
  ProductVariantDomainModel,
  ServiceChargeDomainModel,
} from '@esp/models';

export const totalUnitsKey = 'totalUnitsRow';

export interface TotalUnitsRow {
  Type: typeof totalUnitsKey;
  Value: number;
}

export type VariantsGridDataItem =
  | ProductVariantDomainModel
  | ServiceChargeDomainModel
  | TotalUnitsRow;
