export class Toast {
  static get component() {
    return cy.get('body').then(($body) => {
      if ($body.find('hot-toast').length) {
        return cy.get('hot-toast', { timeout: 1000 }).last();
      }

      return cy.get('hot-toast', { timeout: 1000 });
    });
  }

  static get message() {
    return this.component
      .find('cos-notification-body')
      .invoke({ timeout: 0 }, 'text');
  }

  static get title() {
    return this.component
      .find('cos-notification-title')
      .invoke({ timeout: 0 }, 'text');
  }
}
