export class ActionBar {
  static SELECTORS = {
    share: 'cos-stroked-button.cos-primary',
    removeFromCollection: 'button.action-remove-from-collection',
  };

  static _element() {
    return cy.get('cos-action-bar');
  }

  static addToCollection() {
    this._element().find('button').contains('Add to Collection').click();
  }

  static selectUnselectAllProducts(input: 'check' | 'unCheck') {
    if (input == 'check')
      this._element()
        .find('[id="checkbox-products-input"]')
        .check({ force: true });
    else
      this._element()
        .find('[id="checkbox-products-input"]')
        .uncheck({ force: true });
    return this;
  }

  static share() {
    this._element().find(this.SELECTORS.share).click();
  }
  static removeFromCollection() {
    this._element()
      .find('.action-remove-from-collection')
      .click({ force: true });
  }

  static element() {
    return this._element().find;
  }

  static getProductCount() {
    return this._element()
      .find('.cos-checkbox-label>span')
      .invoke('text')
      .then((value) => {
        return parseInt(value);
      });
  }
}
