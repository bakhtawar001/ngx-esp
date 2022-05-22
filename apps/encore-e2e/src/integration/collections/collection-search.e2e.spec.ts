/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Collection, CollectionProduct } from '@esp/collections';
import { standardSetup } from '../../utils';
import { randomStringGenerator } from '../../utils/base';
import { getProducts } from '../products/utils/api';
import { generateCollection } from './factories';
import { collectionSearch } from './fixtures';
import { CollectionSearchPage } from './pages';
import { CollectionCardHarness } from './shared';
import {
  AddCollectionProducts,
  createCollection,
  getCollection,
  getCollectionList,
  Intercept,
  removeCollection,
  updateCollection,
} from './utils';

const fixture = collectionSearch(Cypress.env('environment'));
const page = new CollectionSearchPage();
let collection: Collection;
const sortOptions = fixture.data.sortOptions;

standardSetup(fixture);

describe('Collection Search E2E', () => {
  before('Create new collection', () => {
    createCollection(generateCollection())
      .then((res) => (collection = res))
      .then((collection) =>
        cy.log(`Created new collection (${collection.Id}:${collection.Name}).`)
      );
  });

  after('Remove collection', () => removeCollection(collection));

  it('EN 207 : If two collections has the same exact name last Updated date should be used to sort the data among the collections with same name.', () => {
    let collectionOne: Collection;
    let collectionTwo: Collection;
    const name = randomStringGenerator(9);
    createCollection(generateCollection({ Name: name }), false)
      .then((res) => {
        collectionOne = res;
        expect(['active', 'Active']).to.include(collectionOne.Status);
      })
      .then(() => {
        createCollection(generateCollection({ Name: name }), false)
          .then((res) => (collectionTwo = res))
          .then((collectionTwo) => {
            cy.log(
              `The first collection id generated is ${collectionOne.Id} and the second collection id generated is ${collectionTwo.Id}`
            );
            Intercept.searchCollection();
            page.open().then(() => {
              cy.wait('@searchCollection').then(() => {
                cy.log(JSON.stringify(sortOptions[3]));
                page.sort([sortOptions[3]]);
                page.get('collectionList').should('be.visible');
                Intercept.searchCollection({ term: name });
                page.search(name.trim());
                cy.wait('@searchCollection').then(() => {
                  page.get('collectionList').should('have.length', 2);
                  page.selectCollection(0);
                  cy.url().should('contain', collectionTwo.Id);
                });
                cy.log('The end of the Test.');
              });
            });
          });
      });
  });

  it.only('EN 207 : All collections should be sorted on the basis of the last updated date when last updated date option is selected form sort dropdown. i.e. collections updated recently should be displayed first.', () => {
    page.open();

    getCollectionList(1, 2, 'Active', 'me').then(function (resp: any) {
      const collectionId: number = resp.Results[1].Id;

      cy.log(`We are going to change the collection Id ${collectionId}`);

      const newName = 'AutoCollection-' + randomStringGenerator(4);

      resp.Results[1].Name = newName;
      resp.Results[1].CreatedBy = resp.Results[1].Collaborators[1]
        ? resp.Results[1].Collaborators[1].Name
        : Cypress.env('username');

      updateCollection(resp.Results[1], false).then(() => {
        // Waiting for algolia to update.
        cy.wait(5000);

        Intercept.searchCollection();

        page.open();

        cy.wait('@searchCollection').then((intercept) => {
          page.get('collectionList').should('be.visible');
          expect(intercept.response.statusCode).eq(200);

          const collectionCard = new CollectionCardHarness(
            page.get('collectionList').first()
          );

          collectionCard.get('name').should('have.text', newName);
        });
      });
    });
  });

  //TC3
  it('EN 207 : All collections should be sorted on the basis of the Last Updated Date  when Last Updated Date option is selected form sort dropdown. i.e. Collections updated recently should be displayed first. We would edit the collection Description and Verify that the collection is at the top of the list.', () => {
    page.open();

    Intercept.searchCollection();

    getCollectionList(1, 2, 'Active', 'me').then(({ Results }) => {
      collection = Results[1];
      collection.CreatedBy = JSON.parse(localStorage.getItem('auth')).user.Name;
      collection.Description = collection.Description + 'Updated by Automation';
      updateCollection(collection, false);
      Intercept.getCollectionDetails(collection.Id);
      page.open().then(() => {
        cy.wait('@searchCollection');
        page.sort([sortOptions[0]]).then(() => {
          cy.wait('@searchCollection').then(() => {
            page.selectCollection(0);
            cy.wait('@getCollectionDetails');
          });
        });
      });
    });
  });

  //TC4
  it('EN 207 : All collections should be sorted on the basis of the Last Updated Date  when Last Updated Date option is selected form sort dropdown. i.e. Collections updated recently should be displayed first. We would edit the collection Product and Verify that the collection is at the top of the list.', () => {
    getCollectionList(1, 2, 'Active', 'default').then(function ({ Results }) {
      collection = Results[1];
      getCollection(collection.Id).then((resp) => {
        collection = resp;
        getProducts({
          Terms: 'cup',
        }).then(({ Results }) => {
          const product: CollectionProduct = Results[0];
          const body = [
            {
              ProductId: product.Id,
              Name: product.Name,
              Description: product.Description,
              ImageUrl: product.ImageUrl,
              Price: 0.8,
            },
          ];
          AddCollectionProducts(collection.Id, body).then((resp) => {
            page.open().then(() => {
              page.get('collectionList').should('be.visible');
              page.sort([sortOptions[0]]).then(() => {
                page
                  .get('firstCollection')
                  .should('have.text', collection.Name);
              });
            });
          });
        });
      });
    });
  });
  //TC5
  it('EN 207 : Data should be refreshed and all Collections should be sorted on the basis of Create Date/time of the collection in ascending order when user selects sorting option as Newest.', () => {
    createCollection(
      generateCollection({ Name: randomStringGenerator(10) }),
      false
    )
      .then((res) => (collection = res))
      .then((collection) => {
        cy.log(collection.Name);
        Intercept.searchCollection();
        page.open();
        cy.wait('@searchCollection').then((intercept) => {
          page.get('collectionList').should('be.visible');
          page.sort([sortOptions[2]]).then(() => {
            page.get('firstCollection').should('have.text', collection.Name);
          });
        });
      });
  });
  it('EN 210 : User should be able to search collections on the basis of updated collections data when user updates the collection name and description and then searches from collection landing page', () => {
    page.open();

    getCollectionList(1, 2, 'Active', 'default').then(function (resp) {
      const collectionId: number = resp.Results[1].Id;
      resp.Results[1].Name = 'AutoCollection-' + randomStringGenerator(4);
      resp.Results[1].Description =
        'AutoCollection-' + randomStringGenerator(4);
      const newName = resp.Results[1].Name;
      resp.Results[1].CreatedBy = resp.Results[1].Collaborators[0]
        ? resp.Results[1].Collaborators[0].Name
        : Cypress.env('username');
      updateCollection(resp.Results[1], false).then(() => {
        page.open().then(() => {
          page.get('searchField').focus();
          page.get('searchField').click();
          page.get('searchField').type(newName);
          page.get('firstCollection').should('contain.text', newName);
        });
      });
    });
  });

  it('EN 211 : Only Active Collections should be available and displayed under All Collections tab', () => {
    page.open().then(() => {
      page.get('nextButton').should('be.visible');
      getCollectionList(1, 50, 'Active', 'default').then(function (resp) {
        for (let i = 0; i < resp.Results.length; i++)
          assert.equal(resp.Results[i].Status, 'Active');
      });
    });
  });
  it('EN 211 : Archived Collections should NOT be available under All Collections tab.', () => {
    page.open().then(() => {
      page.get('nextButton').should('be.visible');
      getCollectionList(1, 50, 'Active', 'default').then(function (resp) {
        for (let i = 0; i < resp.Results.length; i++)
          assert.notEqual(resp.Results[i].Status, 'archived');
      });
    });
  });

  it('EN 211 : Owned by Me tab should show only Active collections owned by the user.', () => {
    page.open().then(() => {
      page.get('nextButton').should('be.visible');
      const userId = JSON.parse(localStorage.getItem('auth')).user.Id;
      getCollectionList(1, 50, 'active', 'me').then(function ({ Results }) {
        let flag: boolean = true;
        for (let i = 0; i < Results.length; i++) {
          if (Results[i].OwnerId !== userId) {
            flag = false;
          }
        }
        if (flag === false) {
          assert.fail('failed to show active collections owned by the user');
        }
        cy.log('Shows active collections owned by the user');
      });
    });
  });

  it('EN 211 : Active collections should NOT be displayed under Archive tab.', () => {
    page.open().then(() => {
      page.get('nextButton').should('be.visible');
      const name = JSON.parse(localStorage.getItem('auth')).user.Name;
      getCollectionList(1, 50, 'active', 'default').then(function (resp) {
        cy.log(resp.Results.length);
        for (let i = 0; i < resp.Results.length; i++)
          assert.notEqual(resp.Results[i].Status, 'archived');
      });
    });
  });

  it('EN 211 : Only collections with Archive status should be displayed under the archive tab. ', () => {
    page.open().then(() => {
      page.get('nextButton').should('be.visible');
      const name = JSON.parse(localStorage.getItem('auth')).user.Name;
      getCollectionList(1, 50, 'archived', 'me').then(function (resp) {
        cy.log(resp.Results.length);
        for (let i = 0; i < resp.Results.length; i++)
          assert.equal(resp.Results[i].Status, 'Archived');
      });
    });
  });
  it('EN 211 : Archived collections should NOT be available under the Owned by Me tab', () => {
    page.open().then(() => {
      page.get('nextButton').should('be.visible');
      const name = JSON.parse(localStorage.getItem('auth')).user.Name;
      getCollectionList(1, 50, 'active', 'me').then(function (resp) {
        cy.log(resp.Results.length);
        for (let i = 0; i < resp.Results.length; i++)
          assert.notEqual(resp.Results[i].Status, 'Archived');
      });
    });
  });
});
