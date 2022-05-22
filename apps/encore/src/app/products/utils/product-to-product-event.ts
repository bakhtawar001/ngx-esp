import { Ad } from '@cosmos/components/product-card';
import { CollectionProductSearchResultItem } from '@esp/collections';
import { AdTrackEvent, Product } from '@esp/products';
import { ProductSearchResultItem } from '@smartlink/models';

export function productToProductEvent(
  product: ProductSearchResultItem | CollectionProductSearchResultItem,
  productIndex?: number,
  pfpMode?: string
): Product {
  return {
    id: product.Id,
    ad: getAdInfo(product.Ad, pfpMode),
    currencyCode: product?.Price?.CurrencyCode,
    productIndex: productIndex,
    objectID: product.ObjectId ? product.ObjectId : undefined,
  };
}

export function getAdInfo(
  productAd: Ad,
  pfpMode?: string
): AdTrackEvent | undefined {
  const adInfo: AdTrackEvent = productAd?.Id
    ? {
        id: productAd?.Id,
        index: productAd?.Index,
        serveTypeCode: productAd?.Type === 'PFP' ? pfpMode : undefined,
        levelId: productAd?.LevelId,
      }
    : undefined;
  return adInfo;
}
