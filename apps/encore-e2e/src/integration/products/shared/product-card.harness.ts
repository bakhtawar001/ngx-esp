const SELECTORS = {
  ellipsis: 'button>i.fa.fa-ellipsis-h',
  checkbox: 'input[type="checkbox"]',
  image: 'esp-product-image>div',
};

export class ProductCardHarness {
  constructor(private _element: Cypress.Chainable<any>) {
    this._element.find('.cos-product-card', { timeout: 1000 });
  }

  get(element: keyof typeof SELECTORS) {
    return this._element.find(SELECTORS[element]);
  }

  getProductId() {
    return this._element
      .parents('a')
      .invoke('attr', 'href')
      .then((text) => {
        return text.replace('/products/', '').split('?')[0];
      });
  }

  openContextMenu() {
    this.get('ellipsis').click({ force: true });

    return cy.get('.cdk-overlay-container .cos-global-menu-panel');
  }

  check() {
    this.get('checkbox').check({ force: true });

    return this;
  }

  uncheck() {
    this.get('checkbox').uncheck({ force: true });

    return this;
  }
}
