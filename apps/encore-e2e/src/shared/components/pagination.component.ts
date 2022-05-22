export class Pagination {
  static component = 'cos-pagination.cos-pagination.mat-paginator';

  constructor() {
    Pagination.element();
  }
  static element() {
    return cy.get(this.component);
  }
  static prev() {
    return Pagination.element()
      .find('button[aria-label="Previous page"]')
      .click();
    return this;
  }
  static next() {
    Pagination.element().find('button[aria-label="Next page"]').click();
    return this;
  }
  static getCurrentPage() {
    return Pagination.element()
      .find('.cos-pagination-page-links.ng-star-inserted>button')
      .filter('[aria-current="true"]')
      .invoke('text');
  }
}
