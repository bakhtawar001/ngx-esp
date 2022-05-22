import { Page } from '@cosmos/cypress';
import { sortOptions } from 'apps/encore/src/app/collections/configs';

const PAGE_OBJECTS = {
  collectionButton: () => cy.get('button.mat-menu-trigger.cos-icon-button'),
  duplicate: () => cy.get('a.cos-text--black.duplicate-collection'),
  emoji: () => cy.get('button.emoji-mart-emoji.ng-star-inserted'),
  submitForm: () =>
    cy.get('button.create-collection-btn.cos-flat-button.cos-primary'),
  sortMenuTrigger: () => cy.get('.collection-sort>.mat-menu-trigger'),
  collectionList: () => cy.get('div.collection-results>cos-collection'),
  collectionOne: () =>
    cy
      .get('div.collection-results>cos-collection')
      .eq(0)
      .find('cos-product-grid>div>ul>li'),
  collectionTwo: () =>
    cy
      .get('div.collection-results>cos-collection')
      .eq(1)
      .find('cos-product-grid>div>ul>li'),
  firstCollection: () =>
    cy.get(
      'cos-collection.cos-collection.ng-star-inserted:first-child>cos-card>div>div>div>button>div>div>h2'
    ),
  collectionDet: () =>
    cy.get('button.mat-menu-trigger.actions-menu-btn.cos-icon-button'),
  removeProduct: () => cy.get('i.fa.fa-trash-alt'),
  createCollectionButton: () => cy.get('.create-collection-btn'),
  searchField: () => cy.get('div.cos-search-field>input'),
  nextButton: () => cy.get('button.next-prev-button.ng-star-inserted'),
  noCollection: () => cy.get('p.body-style-14-shark'),
  confirm: () => cy.get('button.cos-flat-button.cos-primary'),
  clearSearch: () =>
    cy.get('button.form-field-suffix.cos-icon-button.ng-star-inserted'),
} as const;
export class CollectionSearchPage extends Page<typeof PAGE_OBJECTS> {
  uri = '/collections';

  constructor() {
    super(PAGE_OBJECTS);
  }

  open() {
    return cy.navigateByUrl(this.uri);
  }

  sort(value: typeof sortOptions) {
    return cy.wrap(null).then(() => {
      return new Cypress.Promise((resolve) => {
        return this.isAttached(
          resolve,
          '.collection-sort>.mat-menu-trigger',
          0
        );
      }).then((el) => {
        cy.wrap(el)
          .click({ force: true })
          .then(() => {
            cy.get('.mat-menu-panel')
              .should('be.visible')
              .find('[mat-menu-item]')
              .contains(value[0].name)
              .click({ force: true });
          });
      });
    });
  }
  createCollection() {
    this.get('createCollectionButton').click();
    return this;
  }
  archiveTab() {
    cy.get('.mat-tab-labels').children().contains('Archived').click();
    return this;
  }
  allCollectionsTab() {
    cy.get('.mat-tab-labels').contains('All Collections').click();
    return this;
  }
  selectCollection(index: number) {
    this.get('collectionList').eq(index).click();
    return this;
  }
  search(input: string) {
    PAGE_OBJECTS.searchField().type(input);
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
