import { Page } from '@cosmos/cypress';

const PAGE_OBJECTS = {
  username: () => cy.get('input[placeholder="Username or email"]'),
  password: () => cy.get('input[placeholder="Password"]'),
  checkbox: () => cy.get('[type="checkbox"]'),
  loginButton: () => cy.get('.cos-flat-button.cos-primary'),
} as const;

export class LoginPage extends Page<typeof PAGE_OBJECTS> {
  uri = '/auth/login';

  constructor() {
    super(PAGE_OBJECTS);
  }

  open() {
    return cy.visit(`${this.uri}`);
  }
}
