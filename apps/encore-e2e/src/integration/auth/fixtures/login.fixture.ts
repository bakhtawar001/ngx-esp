import { Environment, Fixtures } from '@cosmos/cypress';

interface LoginPageData {}

const testFixtures: Fixtures<LoginPageData> = {
  dev: {
    email: Cypress.env('email'),
    username: Cypress.env('username'),
    password: Cypress.env('password'),
    data: {},
  },
  uat: {
    email: Cypress.env('email'),
    username: Cypress.env('username'),
    password: Cypress.env('password'),
    data: {},
  },
  production: {
    email: Cypress.env('email'),
    username: Cypress.env('username'),
    password: Cypress.env('password'),
    data: {},
  },
};

export const login = (env: Environment) => testFixtures[env];
