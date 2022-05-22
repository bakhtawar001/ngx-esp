/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Collection } from '@esp/collections';
import { CreateCollectionDialog, Toast } from '../../shared';
import { standardSetup } from '../../utils';
import { generateCollection } from './factories';
import { collectionSearch } from './fixtures';
import { CollectionSearchPage } from './pages/collection-search.page';
import { CollectionCardHarness } from './shared';
import { Intercept, mock, removeCollection } from './utils';

const fixture = collectionSearch(Cypress.env('environment'));
const colSearchPage = new CollectionSearchPage();
let collection: Collection;

standardSetup(fixture);

describe('EN 212', () => {
  after('Remove collection', () => removeCollection(collection));

  it('EN 212 : Collection should be successfully created when user enters data on the Create New Collection Modal and click at Create New Collection.', () => {
    collection = generateCollection({ Id: 1001 });
    mock.testSetup({ collection: collection });
    colSearchPage.open();
    colSearchPage.createCollection();
    CreateCollectionDialog.create();
    cy.wait('@newCollection');
    cy.wait('@getCollection');
  });

  it('EN 212 : User should be redirected to the Collections detail  page  of the newly created collection  with correct Name, description and Emoji when a new collection is created successfully. ', () => {
    cy.url().should('contain', `collections/${collection.Id}`);
  });

  it('EN 212 : Success Toast should not be displayed when user dismisses the create new collection modal. ', () => {
    Intercept.postNewCollection();
    colSearchPage.open();
    colSearchPage.createCollection();
    CreateCollectionDialog.cancel();
    Toast.component.should('not.exist');
    cy.get('@postNewCollection.all').should('have.length', 0);
  });
});

describe('EN 425', () => {
  after('Remove collection', () => removeCollection(collection));

  it('EN 425 : Users with only view rights for a collection should NOT be displayed with make Active option.', () => {
    colSearchPage.open();
    colSearchPage.get('collectionList').should('be.visible');
    mock.searchCollection(
      [generateCollection({ Id: 1001, Status: 'Archived', IsEditable: false })],
      {},
      { status: 'archived' }
    );

    colSearchPage.archiveTab();

    cy.wait('@searchCollection');

    const collectionCard = new CollectionCardHarness(
      colSearchPage.get('collectionList').first()
    );

    collectionCard
      .openContextMenu()
      .find('.activate-collection')
      .should('not.exist');
  });
});
