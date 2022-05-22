import { Dialog } from './dialog';

const PAGE_OBJECTS = {
  List: () => AddToCollection.dialog().find('cos-collection'),
} as const;

export class AddToCollection extends Dialog<typeof PAGE_OBJECTS> {
  constructor() {
    super(PAGE_OBJECTS);
  }

  static dialog() {
    return cy.get('esp-add-to-collection-dialog');
  }

  static createANewCollection() {
    this.dialog().find('.cos-new-button-text').click();
  }

  static selectCollection(input: number) {
    cy.wait(1000);
    return this.dialog().find('cos-collection').eq(input).click();
  }
  static search(input: string) {
    this.dialog().find('input.search-field-input').type(input, { force: true });
  }
}
