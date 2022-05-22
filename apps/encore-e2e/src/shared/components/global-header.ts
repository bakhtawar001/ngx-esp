export class GlobalHeader {
  static SELECTORS = {
    collectionsEle:
      '.cos-global-nav-menu>li>.mat-menu-trigger>span:contains("Collections")',
    account:
      '.cos-global-nav-menu>li>.mat-menu-trigger>span:contains("Account")',
    logout: '.fa.fa-sign-out-alt',
    noRecentCollectionMessage: 'p.no-collections',
    createCollectionButton: '.not-found>button.create-collection-btn',
    allCollections: '.all-collections-link',
    recentCollectionList: 'h4',
    searchCollection: '.collection-search-input',
    recentCollection: 'h5',
  };
  static get(selector: string) {
    return cy.get(this.SELECTORS[selector]);
  }
  static clickElement(selector: string) {
    cy.get(this.SELECTORS[selector]).invoke('click');
    return this;
  }
  static collections() {
    cy.get(this.SELECTORS.collectionsEle).invoke('click');
    return this;
  }

  static searchCollection(input: string) {
    this.collections().get('searchCollection').type(input);
    return this;
  }

  static getHref() {
    return this.get('recentCollectionList')
      .first()
      .parents('a')
      .invoke('attr', 'href');
  }

  static getSearchCollections() {
    return cy.get('esp-collections-menu').then(($element) => {
      try {
        return $element.find('.ng-star-inserted').find('h4');
      } catch (error) {
        console.log({ error });
        return null;
      }
    });
  }
  static createCollection() {
    return this.get('createCollectionButton').click();
  }
}
