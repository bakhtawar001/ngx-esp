import type { ProductCard } from '@cosmos/components/product-card';
import { PresentationProduct } from '@esp/models';
import { Price } from '@smartlink/models';

export function mapPresentationProduct(
  product: PresentationProduct
): ProductCard {
  const mappedProduct: { Price?: Price; ImageUrl: string; Supplier: null } = {
    ImageUrl: product.DefaultMedia && 'media/' + product.DefaultMedia.Id,
    Supplier: null,
  };

  if (product.HighestPrice) {
    mappedProduct.Price = {
      ...product.HighestPrice,
      Quantity: product.HighestPrice.Quantity['From'],
    };
  }

  return {
    ...product,
    ...mappedProduct,
  } as ProductCard;
}
