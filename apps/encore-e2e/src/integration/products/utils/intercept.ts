//import { SearchCriteria } from '@esp/search';

export class InterceptProduct {
  // this gets invoked when land into the search products page
  static searchProducts() {
    cy.intercept({
      url: '/babou/api/ardor/products/search',
    }).as('searchProducts');
    return this;
  }
}
