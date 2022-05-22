declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    login: typeof login;
  }
}

Cypress.Commands.add('login', login);

function login(username: string, password: string) {
  cy.intercept('GET', '/babou/api/esp/users/me').as('getSessionInfo');

  return cy
    .getComponent('esp-login')
    .then((componentInstance: any) => {
      if (componentInstance) {
        cy.log(`[Login]`);

        componentInstance.login({ username, password });
      }
    })
    .wait('@getSessionInfo')
    .get('cos-global-header')
    .should('exist');
}
