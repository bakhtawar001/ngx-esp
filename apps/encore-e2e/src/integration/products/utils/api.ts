import { CollectionProduct } from '@esp/collections';
import { URLs } from '../../collections/utils';

export function getProducts(
  input: Partial<{
    AggregationsToInclude: [
      'CategoryGroup',
      'CategoryValue',
      'Supplier',
      'Color',
      'ImprintMethod',
      'Material',
      'LineName',
      'Shape',
      'Size',
      'Theme',
      'TradeName'
    ];
    ExcludeTerms;
    Filters: {};
    NumericFilters: [];
    PriceFilter: {
      From: number;
      To: number;
      Quantity: number;
    };
    Terms: String;
    From: number;
    OrganicSize: number;
  }>
) {
  const token: any = window.localStorage.getItem('auth');
  let asiToken = JSON.parse(token).session.access_token;
  return cy
    .request({
      method: 'POST',
      url: `${Cypress.env('asiServiceUrl')}${URLs.api.productUrl}`,
      body: {
        AggregationsToInclude: [
          'CategoryGroup',
          'CategoryValue',
          'Supplier',
          'Color',
          'ImprintMethod',
          'Material',
          'LineName',
          'Shape',
          'Size',
          'Theme',
          'TradeName',
        ],
        ExcludeTerms: null,
        Filters: {},
        NumericFilters: [],
        PriceFilter: { From: null, To: null, Quantity: null },
        Terms: '',
        From: 1,
        OrganicSize: 48,
        ...input,
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${asiToken}`,
        origin: Cypress.config().baseUrl,
      },
    })
    .its('body');
}

export function getProductDetails(
  productId
): Cypress.Chainable<CollectionProduct> {
  const token: any = window.localStorage.getItem('auth');
  let asiToken = JSON.parse(token).session.access_token;
  return cy
    .request({
      method: 'GET',
      url: `${URLs.api.productUrl}${URLs.api.productDetailsPath}${productId}.json`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${asiToken}`,
        origin: Cypress.config().baseUrl,
      },
    })
    .its('body');
}
