import { Page } from '@cosmos/cypress';

const PAGE_OBJECTS = {
  description: () =>
    cy.get(CollectionDetailPage.SELECTORS.description).find('span>span'),
  name: () => cy.get(CollectionDetailPage.SELECTORS.name).find('span>span'),
  productList: () => cy.get('cos-product-card'),
  archiveElement: () => cy.get(CollectionDetailPage.SELECTORS.archive),
  transferOwnerShip: () => cy.get('.transfer-collection'),
} as const;

export class CollectionDetailPage extends Page<typeof PAGE_OBJECTS> {
  uri = '/collections';

  constructor() {
    super(PAGE_OBJECTS);
  }

  static SELECTORS = {
    name: '.collection-detail-title',
    description: '.collection-detail-description',
    archive: '.archive-collection',
    transFerDialog: '.mat-dialog-container',
  };

  activate() {
    return this.openContextMenu()
      .get('.activate-collection')
      .click({ force: true });
  }

  archive() {
    return this.openContextMenu()
      .get(CollectionDetailPage.SELECTORS.archive)
      .click({ force: true });
  }

  delete() {
    return this.openContextMenu()
      .get('.delete-collection')
      .click({ force: true });
  }

  duplicate() {
    return this.openContextMenu()
      .get('.duplicate-collection')
      .click({ force: true });
  }

  openContextMenu() {
    return cy.wrap(null).then(() => {
      return new Cypress.Promise((resolve) => {
        return this.isAttached(
          resolve,
          'button.mat-menu-trigger.actions-button',
          0
        );
      }).then((el) => {
        return cy.wrap(el).click({ force: true });
      });
    });
  }

  open(id: number) {
    cy.navigateByUrl(`${this.uri}/${id}`);

    this.get('name')
      .invoke('text')
      .then((name) =>
        cy.log(`Opened Collection Detail Page (${id}:${name.trim()})`)
      );

    return this;
  }

  transferOwnership() {
    return this.openContextMenu()
      .get('.transfer-collection')
      .should('be.visible')
      .invoke('click');
  }

  manage() {
    cy.get('.manage-collaborators-btn').click({ force: true });
    return this;
  }

  isAttached = (resolve, selector, count = 0) => {
    const el = Cypress.$(selector);
    // is element attached to the DOM?
    count = Cypress.dom.isAttached(el) ? count + 1 : 0;
    // hit our base case, return the element
    if (count >= 3) {
      return resolve(el);
    }
    // retry after a bit of a delay
    setTimeout(() => this.isAttached(resolve, selector, count), 500);
  };
}
