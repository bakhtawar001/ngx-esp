import { SupplierCard, SupplierTag } from '@cosmos/components/supplier-card';
import { SupplierSearchResultItem } from '@smartlink/suppliers';

export function mapSupplier(supplier: SupplierSearchResultItem): SupplierCard {
  return {
    ...supplier,
    SupplierTags: mapSupplierTags(),
  } as SupplierCard;

  function mapSupplierTags(): SupplierTag[] {
    return supplier.Tags?.map((tag) => ({ Label: tag, Icon: 'trophy' }));
  }
}
