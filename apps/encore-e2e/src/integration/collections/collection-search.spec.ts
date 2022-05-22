/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Collection } from '@esp/collections';
import { ConfirmDialog } from '../../shared';
import { standardSetup } from '../../utils';
import { generateCollection } from './factories';
import { collectionSearch } from './fixtures';
import { CollectionSearchPage } from './pages/collection-search.page';
import { CollectionCardHarness } from './shared';
import { createCollection, Intercept, removeCollection } from './utils';
import { mock } from './utils/mock';

const fixture = collectionSearch(Cypress.env('environment'));
const page = new CollectionSearchPage();
let collection: Collection;
let sortOptions = fixture.data.sortOptions;

standardSetup(fixture);

describe('Collection Search', () => {
  before('Create new collection', () => {
    createCollection(generateCollection())
      .then((res) => (collection = res))
      .then((collection) =>
        cy.log(`Created new collection (${collection.Id}:${collection.Name}).`)
      );
  });

  after('Remove collection', () => removeCollection(collection));

  it('EN 210 : No collections found text should be displayed when user deletes all collection displayed in search results.', () => {
    mock.testSetup();
    mock.searchCollection([], {});
    page.open().then(() => {
      cy.wait('@searchCollection');
      page.get('noCollection').should('contain.text', 'No collections found.');
    });
  });

  it('EN 210 : No collections found text should be displayed when user archive all collection displayed in search results.', () => {
    mock.testSetup();
    mock.searchCollection([], {});
    page.open().then(() => {
      cy.wait('@searchCollection');
      page.get('noCollection').should('contain.text', 'No collections found.');
    });
  });

  it('EN 207 : Data should be refreshed and all Collections should be sorted on the basis of Collection Name in ascending order when user selects sorting option as Name A-Z.', () => {
    Intercept.searchCollection();
    page.open().then(() => {
      cy.wait('@searchCollection');
      page.sort([sortOptions[3]]);
      cy.wait('@searchCollection').then(({ request: { url } }) => {
        expect(url).to.include('sortBy=az');
      });
    });
  });

  it('EN 207 : Data should be refreshed and all Collections should be sorted on the basis of Collection Name in descending order when user selects sorting option as Name Z-A.', () => {
    Intercept.searchCollection({ term: '' });
    page.open().then(() => {
      cy.wait('@searchCollection');
      page.sort([sortOptions[4]]);
      cy.wait('@searchCollection').then(({ request: { url } }) => {
        expect(url).to.include('sortBy=za');
      });
    });
  });

  it('EN 210 : As user types in the collections should be filtered based on the Contains search', () => {
    const searchText = 'asi';
    Intercept.searchCollection({ term: searchText });

    page.open().then(() => {
      page.get('searchField').clear({ force: true });
      page.get('searchField').type(searchText);
      cy.wait('@searchCollection').then(({ request: { url } }) => {
        expect(url).to.include(searchText);
      });
    });
  });

  it('EN 210 : User should be able to filter collection when single character  is typed in', () => {
    const searchText = 'c';
    Intercept.searchCollection({ term: searchText });
    page.open().then(() => {
      page.get('searchField').clear();
      page.get('searchField').type(searchText);
      cy.wait('@searchCollection').then(({ request: { url } }) => {
        expect(url).to.include(searchText);
      });
    });
  });

  it('EN 210 : User should be able to filter collections when multiple characters are typed in', () => {
    const searchText = 'collection';
    Intercept.searchCollection({ term: searchText });
    page.open().then(() => {
      page.get('searchField').clear();
      page.get('searchField').type(searchText);
      cy.wait('@searchCollection').then(({ request: { url } }) => {
        expect(url).to.include(searchText);
      });
    });
  });

  it('EN 210 : User should be able to filter collections when multiple words are typed in', () => {
    let searchText = 'New ASI Collection';
    Intercept.searchCollection({ term: searchText });
    page.open().then(() => {
      page.get('searchField').clear();
      page.get('searchField').type(searchText);
      cy.wait('@searchCollection').then(({ request: { url } }) => {
        expect(url).to.include(encodeURI(searchText));
      });
    });
  });

  it('EN 210 : User should be able to filter collections when user types in alpha characters', () => {
    const searchText = 'collectionName';
    Intercept.searchCollection({ term: searchText });
    page.open().then(() => {
      page.get('searchField').clear({ force: true });
      page.get('searchField').type(searchText);
      cy.wait('@searchCollection').then(({ request: { url } }) => {
        expect(url).to.include(searchText);
      });
    });
  });

  it('EN 210 : User should be able to filter the collections when user types in special characters', () => {
    const searchText = 'AutoCollection-';
    Intercept.searchCollection({ term: searchText });
    page.open().then(() => {
      page.get('searchField').clear();
      page.get('searchField').type(searchText);
      cy.wait('@searchCollection').then(({ request: { url } }) => {
        expect(url).to.include(searchText);
      });
    });
  });

  it('EN 210 : User should be able to filter collections when user types in the numeric characters e.g. dates etc.', () => {
    const searchText = '123';
    Intercept.searchCollection({ term: searchText });
    page.open().then(() => {
      page.get('searchField').clear();
      page.get('searchField').type(searchText);
      cy.wait('@searchCollection').then(({ request: { url } }) => {
        expect(url).to.include(searchText);
      });
    });
  });

  it('EN 210 : User should be able to filter collections when user types in the combination of alpha and numeric characters,', () => {
    const searchText = 'collection1';
    Intercept.searchCollection({ term: searchText });
    page.open().then(() => {
      page.get('searchField').clear();
      page.get('searchField').type(searchText);
      cy.wait('@searchCollection').then(({ request: { url } }) => {
        expect(url).to.include(searchText);
      });
    });
  });

  it('EN 210 : User should be able to search collections on the basis of Collection name and description.', () => {
    page.open().then(() => {
      let searchText = 'Col';
      page.get('searchField').clear();
      page.get('searchField').type(searchText);
      Intercept.searchCollection({ term: searchText });
      cy.wait('@searchCollection').then(({ request }) => {
        expect(request.url).to.include(searchText);
      });
    });
  });

  it('EN 210 : Search text should be retained when user performs an action on a collection i.e deletes a collection', () => {
    Intercept.searchCollection();

    page.open();

    cy.wait('@searchCollection');

    const text = 'collection';
    page.get('searchField').focus().click().type(text);

    cy.wait('@searchCollection');

    const collectionCard = new CollectionCardHarness(
      page.get('collectionList').first()
    );

    collectionCard.openContextMenu().find('button.delete-collection').click();

    ConfirmDialog.confirm();

    cy.wait('@searchCollection');

    page.get('searchField').should('have.value', text);
  });

  it('EN 210 : Removing text from the search field should update the collections displayed.', () => {
    Intercept.searchCollection({ term: '' });
    page.open().then(() => {
      cy.wait('@searchCollection').then(() => {
        const text = 'collection';
        page.get('searchField').focus().click().type(text);
        Intercept.searchCollection({ term: text });
        cy.wait('@searchCollection');
        page.get('searchField').clear();
        Intercept.searchCollection({ term: '' });
        cy.wait('@searchCollection');
      });
    });
  });

  it(
    'EN 210 : Search text should not be retained when user navigates away from the page.',
    {
      retries: {
        runMode: 2,
        openMode: 2,
      },
    },
    () => {
      page.open().then(() => {
        const searchText = 'collection';
        Intercept.searchCollection({ term: searchText });
        page.get('searchField').clear();
        page.get('searchField').type(searchText);
        cy.wait('@searchCollection');
        page.get('firstCollection').click({ force: true });
        page.open().then(() => {
          page.get('searchField').should('not.contain', 'collection');
          cy.log('end of the test');
        });
      });
    }
  );

  it('EN 207 : selection should be retained on at the user level at local machine when user changes from default sort to another option. i.e. when next time user logs in last selected sort option should be retained. We are checking the Sort by: Newest Option after login in again.', () => {
    Intercept.searchCollection();
    page.open();
    page.get('collectionList').should('be.visible');
    page.sort([sortOptions[2]]);
    cy.wait('@searchCollection').then(() => {
      page.get('sortMenuTrigger').should('contain.text', 'Newest');
      cy.logOut();
      cy.login(fixture.username, fixture.password);
      page.open();
      page.get('collectionList').should('be.visible');
      page.get('sortMenuTrigger').should('contain.text', 'Newest');
      cy.log('The end of the Test.');
    });
  });

  it('EN 207 : Sort selection should be retained on at the user level at local machine when user changes from default sort to another option. i.e. when net time user logs in last selected sort option should be retained. We are checking the Sort by: Oldest Option after login in again.', () => {
    Intercept.searchCollection();
    page.open();
    page.get('collectionList').should('be.visible');
    page.sort([sortOptions[1]]);
    cy.wait('@searchCollection').then(() => {
      page.get('sortMenuTrigger').should('contain.text', 'Oldest');
      cy.logOut();
      cy.login(fixture.username, fixture.password);
      page.open();
      page.get('collectionList').should('be.visible');
      page.get('sortMenuTrigger').should('contain.text', 'Oldest');
      cy.log('The end of the Test.');
    });
  });
});
