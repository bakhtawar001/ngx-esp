declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    navigateByUrl: typeof navigateByUrl;
  }
}

Cypress.Commands.add('navigateByUrl', navigateByUrl);

function navigateByUrl(url: string) {
  return cy.getComponent('esp-app-root').then((componentInstance: any) => {
    if (componentInstance) {
      cy.log(`[Navigate] ${url}`);
      componentInstance.navigateByUrl(url);
      cy.url().should('contain', url);
    } else {
      cy.saveLocalStorage();

      cy.log(`Cypress nav to '${url}' `);
      cy.visit(url);

      cy.restoreLocalStorage();
    }
  });
}
