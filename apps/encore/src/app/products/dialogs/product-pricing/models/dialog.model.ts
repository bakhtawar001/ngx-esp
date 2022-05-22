import { Variant } from '@smartlink/models';
import type { Preferred } from '@smartlink/suppliers';

export interface ProductPricingDialogData {
  variants: Variant[];
  preferred: Preferred;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type ProductPricingDialogResult = {};
