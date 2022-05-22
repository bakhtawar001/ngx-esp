const SELECTORS = {
  name: '.cos-collection-header-text > h2',
  ellipsis: 'button>i.fa.fa-ellipsis-h',
};

export class CollectionCardHarness {
  constructor(private _element: Cypress.Chainable<any>) {
    this._element.find('.cos-collection-card', { timeout: 1000 });
  }

  get(element: keyof typeof SELECTORS) {
    return this._element.find(SELECTORS[element]);
  }

  openContextMenu() {
    this.get('ellipsis').click({ force: true });

    return cy.get('.cdk-overlay-container .cos-global-menu-panel');
  }
}
