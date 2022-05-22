import { Environment, Fixtures } from '@cosmos/cypress';
import { CollectionProduct } from '@esp/collections';
import { sortOptions } from 'apps/encore/src/app/collections/configs/sort-options.config';

interface CollectionSearchPageData {
  sortOptions: typeof sortOptions;
  products: Array<CollectionProduct>;
}

const testFixtures: Fixtures<CollectionSearchPageData> = {
  dev: {
    email: Cypress.env('email'),
    username: Cypress.env('username'),
    password: Cypress.env('password'),
    data: {
      sortOptions,
      products: [
        {
          ProductId: 5074676,
          Name: 'Unisex Baby Thermal Long Sleeve T-Shirt',
          ImageUrl: 'media/7005828',
          Id: 123,
          Description: 'string',
          Price: 456,
        },
        {
          ProductId: 5074762,
          Name: 'Youth Fine Jersey Short Sleeve',
          ImageUrl: 'media/7005630',
          Id: 124,
          Description: 'string',
          Price: 456,
        },
        {
          ProductId: 5074660,
          Name: 'Kids Leisure Shirt',
          ImageUrl: 'media/5703300',
          Id: 125,
          Description: 'string',
          Price: 456,
        },
      ],
    },
  },
  uat: {
    email: Cypress.env('email'),
    username: Cypress.env('username'),
    password: Cypress.env('password'),
    data: {
      sortOptions,
      products: [],
    },
  },
  production: {
    email: Cypress.env('email'),
    username: Cypress.env('username'),
    password: Cypress.env('password'),
    data: {
      sortOptions,
      products: [],
    },
  },
};

export const collectionSearch = (env: Environment) => testFixtures[env];
