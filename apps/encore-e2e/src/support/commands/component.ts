interface Window {
  ng: {
    getComponent: (element: any) => any;
  };
}

declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    getComponent: typeof getComponent;
  }
}

Cypress.Commands.add('getComponent', getComponent);

// export const getComponent = (component: string) =>
//   cy.window().should('have.property', component);

function getComponent(selector: string) {
  return cy.get('body').then(($body) => {
    try {
      const el = $body.find(selector)[0];
      const win = el.ownerDocument.defaultView;
      return win.ng.getComponent(el);
    } catch (error) {
      console.log({ error });
      return null;
    }
  });
}
