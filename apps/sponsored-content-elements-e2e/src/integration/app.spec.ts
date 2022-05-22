import { getGreeting } from '../support/app.po';

describe('sponsored-content-elements', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    getGreeting().contains('Welcome to sponsored-content-elements!');
  });
});
