/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Collection } from '@esp/collections';
import { CreateCollectionDialog, GlobalHeader } from '../../shared';
import { standardSetup } from '../../utils';
import { generateCollection } from './factories';
import { collectionDetail } from './fixtures';
import { CollectionDetailPage, CollectionSearchPage } from './pages';
import { Intercept, mock } from './utils';

const fixture = collectionDetail(Cypress.env('environment'));
const page = new CollectionDetailPage();

standardSetup(fixture);

function testSetup(options?: { recentCollections?: Collection[] }) {
  const collection = generateCollection();

  mock.testSetup({ collection });
  mock.recentSearch(options?.recentCollections);

  page.open(collection.Id);

  cy.wait('@getCollection');

  cy.wait('@searchRecent');
}

describe('Collections Menu with mocking', () => {
  it('EN 209 : Recent menu displayed with  text "You don’t have any collections that you can add to yet."', () => {
    testSetup();

    GlobalHeader.collections();
    GlobalHeader.get('noRecentCollectionMessage')
      .should(
        'contains.text',
        "You don't have any Collections that you can add to yet."
      )
      .and('be.visible');
  });

  it('EN 209 : Recent menu displayed with  Create New collection and All collection options when there are no collections the user has access to or are shared with the user.', () => {
    testSetup();

    GlobalHeader.get('createCollectionButton')
      .should('be.visible')
      .and('have.length', 1);
    GlobalHeader.get('allCollections').should('be.visible');
  });

  it('EN 209 : Clicking back on the Create new collection modal should take user back to from where the modal was invoked.', () => {
    testSetup();

    Intercept.postNewCollection();
    GlobalHeader.createCollection();
    CreateCollectionDialog.dialog.should('exist');
    CreateCollectionDialog.cancel();
    CreateCollectionDialog.dialog.should('not.exist');
    cy.get('@postNewCollection.all').should('have.length', 0);
    cy.url().should('contain', new CollectionSearchPage().uri);
  });

  it('EN 209 : Dismissing the Create new collection modal should take user back to from where the modal was invoked.', () => {
    testSetup();

    Intercept.postNewCollection();
    GlobalHeader.collections().createCollection();
    CreateCollectionDialog.dialog.should('exist');
    cy.get('body').type('{esc}');
    CreateCollectionDialog.dialog.should('not.exist');
    cy.url().should('contain', new CollectionSearchPage().uri);
  });
});

describe('Collections Menu without mocking', () => {
  it('EN 209 : Recent menu should be displayed when user clicks on Collections icon from the tool bar. ', () => {
    testSetup({ recentCollections: [generateCollection()] });

    GlobalHeader.collections()
      .get('recentCollection')
      .should('contain.text', 'Recent Collections');
  });
});
