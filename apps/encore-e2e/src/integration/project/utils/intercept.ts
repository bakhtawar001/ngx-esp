//import { SearchCriteria } from '@esp/search';
import { SearchCriteria } from '@esp/projects';

export class Intercept {
  static searchProjects() {
    cy.intercept({
      method: 'POST',
      path: `/babou/api/vulcan/projects/search`,
    }).as('searchProjects');
    return this;
  }
  static searchRecentCompany() {
    cy.intercept({
      method: 'GET',
      url: `/babou/api/esp/companies/searchrecent?*`,
    }).as('searchRecentCompany');
    return this;
  }
  static searchCompany() {
    cy.intercept({
      method: 'GET',
      url: `/babou/api/esp/companies/search?*`,
    }).as('searchCompany');
    return this;
  }
  static searchProjectsFromProjectTab() {
    cy.intercept({
      method: 'POST',
      url: `/babou/api/vulcan/projects/search`,
    }).as('searchProjectsFromProjectTab');
    return this;
  }
  
}
