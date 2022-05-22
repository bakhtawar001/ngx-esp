import {
  AD_TYPES_FOR_AD_LABEL,
  ProductCard,
} from '@cosmos/components/product-card';
import { AttributeTag } from '@cosmos/components/product-card-tags';
import { ProductSearchResultItem } from '@smartlink/models';

export function mapProduct(product: ProductSearchResultItem): ProductCard {
  return {
    ...product,
    AttributeTags: mapAttributeTags(),
    VariantTag: product.ColorCount
      ? `${product.ColorCount} Color${product.ColorCount > 1 ? 's' : ''}`
      : '',
    ShowAdLabel: AD_TYPES_FOR_AD_LABEL.includes(product.Ad?.Type),
  } as ProductCard;

  function mapAttributeTags(): AttributeTag[] {
    const tags = [];
    if (product.IsNew) {
      tags.push({
        Icon: 'exclamation-circle',
        Label: 'New Product',
      });
    }
    // if (this.Product.Specials?.length) {
    //   _tags.push({
    //     Icon: 'fa-tag',
    //     Label: this.Product.Specials[0].Type,
    //   });
    // }
    return tags;
  }
}
