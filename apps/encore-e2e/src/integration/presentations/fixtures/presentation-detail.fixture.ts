import { Environment, Fixtures } from '@cosmos/cypress';

interface PresentationDetailPageData {}

const testFixtures: Fixtures<PresentationDetailPageData> = {
  dev: {
    username: Cypress.env('username'),
    password: Cypress.env('password'),
    data: {},
  },
  uat: {
    username: Cypress.env('username'),
    password: Cypress.env('password'),
    data: {},
  },
  production: {
    username: Cypress.env('username'),
    password: Cypress.env('password'),

    data: {},
  },
};

export const presentationDetail = (env: Environment) => testFixtures[env];
