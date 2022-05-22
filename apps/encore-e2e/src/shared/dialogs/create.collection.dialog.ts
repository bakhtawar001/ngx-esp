import { Dialog } from './dialog';

const PAGE_OBJECTS = {
  description: () =>
    cy
      .get(CreateCollectionDialog.component)
      .find('.collection-description'),
  title: () =>
    cy
      .get(CreateCollectionDialog.component)
      .find('.collection-name-input'),
  heading: () => cy.get('.dialog-header-section>p')
} as const;
export class CreateCollectionDialog extends Dialog<typeof PAGE_OBJECTS> {
  static component = 'esp-create-collection-dialog';
  constructor() {
    super(PAGE_OBJECTS);
  }
  static get dialog() {
    return cy.get(this.component);
  }
  static create() {
    this.dialog
      .find('.create-collection-btn.cos-flat-button.cos-primary')
      .click();
    return this;
  }
  static cancel() {
    this.dialog.find('.cancel-create-collection-btn').click({ force: true });
    return this;
  }
  static title(name: string) {
    PAGE_OBJECTS.title().clear().type(name);
    return this;
  }
  static description(description: string) {
    PAGE_OBJECTS.description().clear().type(description);
    return this;
  }
}
