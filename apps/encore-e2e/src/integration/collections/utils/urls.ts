const collections = '/babou/api/zeal/collections';

export const URLs = {
  api: {
    collections: `${collections}`,
    collectionSearch: `${collections}/search`,
    recentCollectionAPIurl: `${collections}/searchrecent`,
    productUrl: '/babou/api/ardor/products/search',
    productDetailsPath: '/v1/suppliers/',
  },
} as const;
