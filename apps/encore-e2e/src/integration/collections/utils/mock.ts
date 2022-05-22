import {
  Collection,
  CollectionProduct,
  SearchCriteria,
} from '@esp/collections';
import { URLs } from './urls';

export class mock {
  static testSetup = (input?: {
    collection?: Collection;
    duplicateCollection?: Collection;
    collectionProducts?: CollectionProduct[];
  }) => {
    if (input != undefined) {
      if (input.collection != undefined) {
        if (!input.collection.Id) input.collection.Id = 1000;

        const url = `${Cypress.env('asiServiceUrl')}${URLs.api.collections}/${
          input.collection.Id
        }`;

        cy.intercept('DELETE', `${url}`, { statusCode: 200 }).as(
          'deleteCollection'
        );

        cy.intercept('PUT', `${url}/status/Archived`, {
          ...input.collection,
          Status: 'Archived',
        }).as('archiveCollection');

        cy.intercept('PUT', `${url}/status/Active`, {
          ...input.collection,
          Status: 'Active',
        }).as('activateCollection');

        cy.intercept('PUT', url, input.collection).as('updateCollection');

        cy.intercept(
          'POST',
          `${Cypress.env('asiServiceUrl')}${URLs.api.collections}`,
          {
            ...input.collection,
            Id: 1001,
          }
        ).as('newCollection');

        cy.intercept('PUT', `${url}/newowner/*`, {
          body: {
            Id: input.collection.Id,
            Name: input.collection.Name,
            Description: input.collection.Description,
            Status: input.collection.Status,
            Emoji: input.collection.Emoji,

            CreatedBy: 'Kevin Diem',
            UpdatedBy: 'Kevin',
            OwnerId: 2018,
            TenantId: input.collection.TenantId,
            AccessLevel: 'Everyone',
            Access: [
              {
                AccessLevel: 'Everyone',
                EntityId: 0,
                AccessType: 'ReadWrite',
              },
            ],
            Collaborators: [
              {
                UserId: 2018,
                Name: 'Adnan Unit Test',
                IsTeam: false,
                Role: 'Owner',
              },
            ],
            IsVisible: true,
          },
          statusCode: 200,
        }).as('transfer');

        if (input.duplicateCollection) {
          cy.intercept(
            'POST',
            `${URLs.api.collections}/${input.collection.Id}/copy`,
            {
              ...input.duplicateCollection,
            }
          ).as('duplicateCollection');
          cy.intercept(
            {
              method: 'GET',
              url: `${URLs.api.collections}/${input.duplicateCollection.Id}`,
            },
            { body: input.duplicateCollection }
          ).as('getDuplicateCollectionDetails');
          cy.intercept(
            'GET',
            `${URLs.api.collections}/${input.duplicateCollection.Id}/productsearch*`,
            {
              Results: input.duplicateCollection.Products,
              ResultsTotal: input.collection.Products?.length ?? 0,
            }
          ).as('getDuplicateCollectionProducts');
        }
        cy.intercept(
          {
            method: 'GET',
            url: `${URLs.api.collections}/${input.collection.Id}`,
          },
          { body: { ...input.collection } }
        ).as('getCollection');

        if (input.collectionProducts == undefined) {
          cy.intercept(
            'GET',
            `${URLs.api.collections}/${input.collection.Id}/productsearch*`,
            {
              Results: input.collection.Products,
              ResultsTotal: input.collection.Products?.length ?? 0,
            }
          ).as('getCollectionProducts');
        } else {
          const len = input.collectionProducts.length;
          cy.intercept(
            'GET',
            `${URLs.api.collections}/${input.collection.Id}/productsearch*`,
            {
              Results: input.collectionProducts,
              ResultsTotal: len,
            }
          ).as('getCollectionProducts');
        }
      }
    }
  };

  static recentSearch(result: Array<Collection> = []) {
    cy.intercept('GET', `${URLs.api.recentCollectionAPIurl}`, {
      Results: result,
      ResultsTotal: result?.length ?? 0,
    }).as('searchRecent');
  }

  static removeFromCollection(collection: Collection) {
    cy.intercept(
      {
        method: 'POST',
        url: `${URLs.api.collections}/${collection.Id}/products/remove`,
      },
      { body: { ...collection } }
    ).as('removeFromCollection');
    return this;
  }

  static addProductsToCollection(
    collection?: Collection,
    duplicateProductIds?: Array<number>
  ) {
    cy.intercept(
      'PUT',
      `${URLs.api.collections}/${collection ? collection.Id : '*'}/products`,
      {
        body: {
          Collection: {
            ...collection,
          },
          ProductsDuplicated: duplicateProductIds,
          ProductsTruncated: [],
        },
      }
    ).as('addProductsToCollection');
    return this;
  }

  static searchCollection(
    collectionList: Array<Collection>,
    queryParams: Partial<SearchCriteria>,
    AddQueryParams?: { status: 'active' | 'archived' }
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
    if (AddQueryParams) {
      if (AddQueryParams.status) obj.status = String(AddQueryParams.status);
    }
    cy.intercept(
      {
        method: 'GET',
        url: `${URLs.api.collectionSearch}?*`,
        query: obj,
      },
      {
        body: {
          Results: [...collectionList],
          ResultsTotal: collectionList.length,
        },
      }
    ).as('searchCollection');
    return this;
  }
}
