import { Environment, Fixtures } from '@cosmos/cypress';
import { CollectionProduct } from '@esp/collections';

interface CollectionDetailPageData {
  OwnerId: number;
  products?: Array<CollectionProduct>;
  newOwner: string;
  duplicateCollection: { id: number; name: string };
}

const testFixtures: Fixtures<CollectionDetailPageData> = {
  dev: {
    email: Cypress.env('email'),
    username: Cypress.env('username'),
    password: Cypress.env('password'),
    data: {
      newOwner: 'Adnan Unit Test',
      OwnerId: 941,
      duplicateCollection: {
        id: 21259,
        name: 'Leigh',
      },
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
      newOwner: '',
      OwnerId: 0,
      duplicateCollection: { id: 0, name: '' },
    },
  },
  production: {
    email: Cypress.env('email'),
    username: Cypress.env('username'),
    password: Cypress.env('password'),
    data: {
      newOwner: '',
      OwnerId: 0,
      duplicateCollection: { id: 0, name: '' },
    },
  },
};

export const collectionDetail = (env: Environment) => testFixtures[env];
