import { isOfType } from '@cosmos/core';
import { Product, ProductSearchResultItem } from '@smartlink/models';
import { CollectionProduct } from '../models';

export function productToCollectionProduct(
  product: Product | ProductSearchResultItem
): CollectionProduct {
  let Price: number = null;

  if (isOfType<Product>(product, 'Prices')) {
    Price = product?.Prices?.[0]?.Price;
  } else if (isOfType<ProductSearchResultItem>(product, 'Price')) {
    Price = product?.Price?.Price;
  }

  return {
    ProductId: product.Id,
    Name: product.Name,
    Description: product.Description,
    ImageUrl: product.ImageUrl,
    Price,
  };
}
