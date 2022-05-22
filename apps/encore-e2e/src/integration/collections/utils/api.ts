import { Collection, CollectionStatus } from '@esp/collections';
import { URLs } from '.';

export function createCollection(
  collection: Partial<Collection>,
  mock = true
): Cypress.Chainable<Collection> {
  if (mock) {
    collection.Id = 1000;

    return cy.wrap(collection as Collection);
  }
  const token: any = window.localStorage.getItem('auth');
  let asiToken = JSON.parse(token).session.access_token;
  return cy
    .request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/collections`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${asiToken}`,
        origin: Cypress.config().baseUrl,
      },
      body: collection,
    })
    .its('body');
}

export function removeCollection(collection: Collection, mock?) {
  if (collection) {
    const message = `Removed collection (${collection.Id}).`;
    deleteCollection(collection.Id, mock).then(() => cy.log(message));
  }
}

export function deleteCollection(
  id: number,
  mock = true
): Cypress.Chainable<Collection> {
  if (mock) return cy.wrap(null as Collection);
  const token: any = window.localStorage.getItem('auth');
  let asiToken = JSON.parse(token).session.access_token;
  return cy
    .request({
      method: 'DELETE',
      url: `${Cypress.env('apiUrl')}/collections/${id}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${asiToken}`,
        origin: Cypress.config().baseUrl,
      },
    })
    .its('body');
}
export function getCollection(
  id: number,
  options?: Partial<Cypress.RequestOptions>
): Cypress.Chainable<Collection> {
  const token: any = window.localStorage.getItem('auth');
  let asiToken = JSON.parse(token).session.access_token;
  return cy
    .request({
      method: 'GET',
      url: `${Cypress.env('apiUrl')}/collections/${id}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${asiToken}`,
        origin: Cypress.config().baseUrl,
      },
      ...options,
    })
    .its('body');
}
export function updateCollection(
  collection: Partial<Collection>,
  mock = true
): Cypress.Chainable<Collection> {
  if (mock) {
    collection.Id = 1000;

    return cy.wrap(collection as Collection);
  }
  const token: any = window.localStorage.getItem('auth');
  const asiToken = JSON.parse(token).session.access_token;
  return cy
    .request({
      method: 'PUT',
      url: `${Cypress.env('apiUrl')}/collections/${collection.Id}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${asiToken}`,
        origin: Cypress.config().baseUrl,
      },
      body: collection,
    })
    .its('body');
}
export function duplicate(
  source: Collection,
  body?: { Emoji?: string; Name?: string; Description?: string }
): Cypress.Chainable<Collection> {
  const token: any = window.localStorage.getItem('auth');
  let asiToken = JSON.parse(token).session.access_token;
  return cy
    .request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/collections/${source.Id}/copy`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${asiToken}`,
        origin: Cypress.config().baseUrl,
      },
      body: {
        Emoji: source.Emoji,
        Name: source.Name,
        Description: source.Description,
        ...body,
      },
    })
    .its('body');
}
export function AddCollectionProducts(
  collectionId: number,
  body: Array<{
    ProductId: number;
    Name: string;
    Description: string;
    ImageUrl: string;
    Price: number;
  }>
) {
  const token: any = window.localStorage.getItem('auth');
  let asiToken = JSON.parse(token).session.access_token;
  return cy
    .request({
      method: 'PUT',
      url: `${Cypress.env('asiServiceUrl')}${
        URLs.api.collections
      }/${collectionId}/products`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${asiToken}`,
        origin: Cypress.config().baseUrl,
      },
      body: body,
    })
    .its('body');
}
export function recentCollections() {
  const token: any = window.localStorage.getItem('auth');
  let asiToken = JSON.parse(token).session.access_token;
  return cy
    .request({
      method: 'GET',
      url: `${Cypress.env('asiServiceUrl')}${
        URLs.api.collections
      }/searchrecent?`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${asiToken}`,
        origin: Cypress.config().baseUrl,
      },
    })
    .its('body');
}
export function getCollectionList(
  page: number,
  size: number,
  status: CollectionStatus,
  type: string
) {
  const token: any = window.localStorage.getItem('auth');
  let asiToken = JSON.parse(token).session.access_token;
  return cy
    .request({
      method: 'GET',
      url: `${Cypress.env('asiServiceUrl')}${URLs.api.collections}/search?`,
      qs: {
        from: page,
        size: size,
        term: '',
        sortBy: 'default',
        status: status,
        type: type,
        filters: '',
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${asiToken}`,
        origin: Cypress.config().baseUrl,
      },
    })
    .its('body');
}
