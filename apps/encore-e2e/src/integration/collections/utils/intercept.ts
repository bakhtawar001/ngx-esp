//import { SearchCriteria } from '@esp/search';
import { Collection, SearchCriteria } from '@esp/collections';
import { URLs } from './urls';

export class Intercept {
  static searchRecent() {
    cy.intercept('GET', `${URLs.api.recentCollectionAPIurl}`).as(
      'searchRecent'
    );
    return this;
  }
  static searchCollection(
    queryParams?: Partial<SearchCriteria>,
    addQueryParams?: { status: 'active' | 'archived' }
  ) {
    interface LooseObject {
      [key: string]: any;
    }
    var obj: LooseObject = {};

    if (queryParams) {
      if (queryParams.editOnly) obj.editOnly = String(queryParams.editOnly);
      if (queryParams.excludeList) obj.excludeList = queryParams.excludeList;
      if (queryParams.from) obj.from = String(queryParams.from);
      if (queryParams.size) obj.size = String(queryParams.size);
      if (queryParams.status) obj.status = String(queryParams.status);
      if (queryParams.term) obj.term = String(queryParams.term);
      if (queryParams.sortBy) obj.sortBy = String(queryParams.sortBy);
      if (queryParams.type) obj.type = String(queryParams.type);
    }
    if (addQueryParams) {
      if (addQueryParams.status) obj.status = String(addQueryParams.status);
    }
    cy.intercept({
      method: 'GET',
      path: `${URLs.api.collectionSearch}?*`,
      query: obj,
    }).as('searchCollection');
    return this;
  }
  // This gets invoked when we land into the collection detail Page
  static getCollectionDetails(input?: number) {
    cy.intercept({
      method: 'GET',
      url: `${URLs.api.collections}/${input ? input : '*'}`,
    }).as('getCollectionDetails');
    return this;
  }

  static updateCollection(input?: Collection) {
    cy.intercept({
      method: 'PUT',
      url: `${URLs.api.collections}/${input ? input.Id : '*'}`,
    }).as('updateCollection');
    return this;
  }

  // This gets invoked when we land into the collection Detail page.
  static getCollectionProducts(
    collectionId?: number,
    queryParams?: Partial<SearchCriteria>
  ) {
    interface LooseObject {
      [key: string]: any;
    }
    var obj: LooseObject = {};
    if (queryParams) if (queryParams.from) obj.from = String(queryParams.from);
    if (queryParams) if (queryParams.size) obj.size = String(queryParams.size);
    if (queryParams)
      if (queryParams.sortBy) obj.sortBy = String(queryParams.sortBy);
    cy.intercept({
      method: 'GET',
      path: `${URLs.api.collections}/${
        collectionId ? collectionId : '*'
      }/productsearch?*`,
      query: obj,
    }).as('getCollectionProducts');
    return this;
  }

  static addProductsToCollection(collectionId?: number) {
    cy.intercept(
      'PUT',
      `${URLs.api.collections}/${collectionId ? collectionId : '*'}/products`
    ).as('addProductsToCollection');
    return this;
  }

  static postNewCollection() {
    cy.intercept({ method: 'POST', url: `${URLs.api.collections}` }).as(
      'postNewCollection'
    );
  }

  static duplicateCollection(collectionId: number) {
    cy.intercept({
      method: 'POST',
      url: `${URLs.api.collections}/${collectionId}/copy`,
    }).as('duplicateCollection');
    return this;
  }

  static getCollection(collection: Collection) {
    cy.intercept({
      method: 'GET',
      url: `${URLs.api.collections}/${collection.Id}`,
    }).as('getCollection');
    return this;
  }
  static usersandteams() {
    cy.intercept({
      method: 'GET',
      url: `/babou/api/esp/autocomplete/usersandteams?term=&from=1&sortBy=&status=Active&filters=&excludeList=*`,
    }).as('usersandteams');
    return this;
  }

  static users(UserId: String) {
    cy.intercept({
      method: 'GET',
      url: `/babou/api/esp/autocomplete/users?term=&from=1&sortBy=&status=Active&filters=&excludeList=${UserId}`,
    }).as('users');
  }
  static searchProduct() {
    cy.intercept({
      method: 'POST',
      path: `${URLs.api.productUrl}*`,
    }).as('searchProduct');
    return this;
  }
  static mockCollections(collection: any) {
    cy.intercept(`${URLs.api.collectionSearch}?*`, (req) => {
      req.continue((res) => {
        res.send(collection);
      });
    }).as('mockCollections');
  }
}
