// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    // login(username, password): void;

    logOut(): any;
  }
}

Cypress.Commands.add('logOut', () => {
  localStorage.clear();
  return cy.wait(1000).visit('/auth/login').wait(4000);
});
