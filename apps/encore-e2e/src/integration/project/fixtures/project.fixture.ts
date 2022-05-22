import { Environment, Fixtures } from '@cosmos/cypress';

interface ProjectPageData {}

const testFixtures: Fixtures<ProjectPageData> = {
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

export const projectDetail = (env: Environment) => testFixtures[env];
