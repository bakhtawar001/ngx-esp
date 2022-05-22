/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Collection } from '@esp/collections';
import { CreateCollectionDialog, Emoji, Toast } from '../../shared';
import { standardSetup } from '../../utils';
import { generateCollection } from './factories';
import { collectionDetail } from './fixtures';
import { CollectionDetailPage, CollectionSearchPage } from './pages';
import {
  createCollection,
  deleteCollection,
  getCollection,
  Intercept,
  URLs,
} from './utils';

const fixture = collectionDetail(Cypress.env('environment'));
const colDetailPage = new CollectionDetailPage();
const createDialogBox = new CreateCollectionDialog();
const colSearchPage = new CollectionSearchPage();

standardSetup(fixture);

describe('Create Collection', () => {
  let collection: Collection;
  let emoji;

  it('EN 213 : User should be able to create collection without entering description', () => {
    createCollection(
      //EN 213 : Should be able to create a new collection using POST/api/collections with valid inputs.
      generateCollection({ Description: '', Products: [] }),
      false
    )
      .then((res) => (collection = res))
      .then((collection) => {
        cy.log(`Created new collection (${collection.Id}:${collection.Name}).`);
        colDetailPage
          .open(collection.Id)
          .get('description')
          .invoke('text')
          .then((text: string) => {
            expect(text.trim()).to.equal('');
            deleteCollection(collection.Id, false);
          });
      });
  });

  it('EN 213 : User should be able to create collection with description entered.', () => {
    createCollection(
      generateCollection({ Description: 'Valid Description', Products: [] }),
      false
    )
      .then((res) => (collection = res))
      .then((collection) => {
        cy.log(`Created new collection (${collection.Id}:${collection.Name}).`);
        colDetailPage
          .open(collection.Id)
          .get('description')
          .invoke('text')
          .then((text: string) => {
            expect(text.trim()).equal('Valid Description');
            deleteCollection(collection.Id, false);
          });
      });
  });

  it('EN 213 : User should be able to create collection with alpha characters in collection name field.', () => {
    createCollection(generateCollection({ Name: 'das' }), false)
      .then((res) => (collection = res))
      .then((collection) => {
        cy.log(`Created new collection (${collection.Id}:${collection.Name}).`);
        colDetailPage
          .open(collection.Id)
          .get('description')
          .should('have.text', ' collectionName description ');
        deleteCollection(collection.Id, false);
      });
  });

  it('EN 213 : User should be able to create collection with numeric characters in the collection name field. ', () => {
    createCollection(generateCollection({ Name: '123' }), false)
      .then((res) => (collection = res))
      .then((collection) => {
        cy.log(`Created new collection (${collection.Id}:${collection.Name}).`);
        colDetailPage
          .open(collection.Id)
          .get('description')
          .should('have.text', ' collectionName description ');
        deleteCollection(collection.Id, false);
      });
  });

  it('EN 213 : User should be able to create collection with special characters in collection name field. E.g.  * & ^<>?/', () => {
    createCollection(generateCollection({ Name: '* & ^<>?/' }), false)
      .then((res) => (collection = res))
      .then((collection) => {
        cy.log(`Created new collection (${collection.Id}:${collection.Name}).`);
        colDetailPage
          .open(collection.Id)
          .get('description')
          .should('have.text', ' collectionName description ');
        deleteCollection(collection.Id, false);
      });
  });

  it('EN 213 : User should be able to create collection with alpha characters in collection description field.', () => {
    createCollection(generateCollection({ Description: 'fdsaf' }), false)
      .then((res) => (collection = res))
      .then((collection) => {
        cy.log(`Created new collection (${collection.Id}:${collection.Name}).`);
        colDetailPage.open(collection.Id);
        colDetailPage.get('description').should('contain.text', 'fdsaf');
        deleteCollection(collection.Id, false);
      });
  });

  it('EN 213 : User should be able to create collection with numeric  characters in collection description field. ', () => {
    createCollection(generateCollection({ Description: '234' }), false)
      .then((res) => (collection = res))
      .then((collection) => {
        cy.log(`Created new collection (${collection.Id}:${collection.Name}).`);
        colDetailPage
          .open(collection.Id)
          .get('description')
          .should('contain.text', '234');
        deleteCollection(collection.Id, false);
      });
  });

  it('EN 213 : User should be able to create collection with special characters in collection description field.  E.g. * & ^<>?/', () => {
    createCollection(generateCollection({ Description: '* & ^<>?/' }), false)
      .then((res) => (collection = res))
      .then((collection) => {
        cy.log(`Created new collection (${collection.Id}:${collection.Name}).`);
        colDetailPage.open(collection.Id);
        colDetailPage.get('description').should('contain.text', '* & ^<>?/');
        deleteCollection(collection.Id, false);
      });
  });

  it('EN 213 : Add collection with maximum special characters in name and description field.', () => {
    Intercept.postNewCollection();
    colSearchPage.open();
    colSearchPage.get('createCollectionButton').click();
    createDialogBox.get('title').then((element) => {
      // EN 213 : User should NOT be able to enter more than the 50 characters in the collection name field
      cy.wrap(element).invoke('attr', 'maxlength').should('be.equal', '50');
      cy.wrap(element)
        .clear()
        .type('!@#$%^&*()!@#$%^&*()!@#$%^&*()!@#$%^&*()!@#$%^&*()!')
        .invoke('val')
        .should('have.length', '50');
    });

    createDialogBox.get('description').then((element) => {
      // EN 213 : User should NOT be able to enter more than the 100 characters in the collection description field
      // EN 213 : User should be able to create collection with maximum allowed characters in the collection description field.i.e .100 characters
      cy.wrap(element).invoke('attr', 'maxlength').should('be.equal', '100');
      cy.wrap(element)
        .clear()
        .type(
          '!@#$%^&*()!@#$%^&*()!@#$%^&*()!@#$%^&*()!@#$%^&*()!@#$%^&*()!@#$%^&*()!@#$%^&*()!@#$%^&*()!@#$%^&*()!'
        )
        .invoke('val')
        .should('have.length', '100');
      CreateCollectionDialog.create();
      cy.wait('@postNewCollection').then(
        ({
          response: {
            body: { Id },
          },
        }) => {
          deleteCollection(Id, false);
        }
      );
    });
  });

  it('EN 213 : User should be able to create collection with maximum allowed characters in the collection name field. i.e. 50', () => {
    Intercept.searchCollection().postNewCollection();
    colSearchPage.open();
    cy.wait('@searchCollection');
    colSearchPage.get('createCollectionButton').click();
    CreateCollectionDialog.title(
      '!@#$%^&*()!@#$%^&*()!@#$%^&*()!@#$%^&*()!@#$%^&*()!'
    )
      .description(
        '!@#$%^&*()!@#$%^&*()!@#$%^&*()!@#$%^&*()!@#$%^&*()!@#$%^&*()!@#$%^&*()!@#$%^&*()!@#$%^&*()!@#$%^&*()!'
      )
      .create();
    cy.wait('@postNewCollection').then((Response) => {
      // EN 213 : Collection Detail page is displayed when user clicks at the Create new collection button with the correct details.
      cy.url().should('contain', `${new CollectionDetailPage().uri}/`);
      Toast.component.should('exist').and('be.visible');
      Toast.title.should('eq', 'Success: Collection created!');
      deleteCollection(Response.response.body.Id, false);
    });
  });

  it('EN 213 : clicking on the emoji icon should open the emoji menu', () => {
    colSearchPage.open();
    colSearchPage.get('createCollectionButton').click();
    CreateCollectionDialog.title(
      '!@#$%^&*()!@#$%^&*()!@#$%^&*()!@#$%^&*()!@#$%^&*()!'
    ).description(
      '!@#$%^&*()!@#$%^&*()!@#$%^&*()!@#$%^&*()!@#$%^&*()!@#$%^&*()!@#$%^&*()!@#$%^&*()!@#$%^&*()!@#$%^&*()!'
    );
    emoji = new Emoji(CreateCollectionDialog.component);
    emoji.getIcon().click();
    emoji
      .dialogBox()
      .should('be.visible')
      .invoke('height')
      .should('be.greaterThan', 380);
  });

  it('EN 213 : User should be able to create a collection with non default emoji.', () => {
    emoji = new Emoji(CreateCollectionDialog.component);
    emoji.SmileysPeople(0).click({ force: true });
    CreateCollectionDialog.create();

    // EN 213 : clikcing create new collection button should close the menu
    CreateCollectionDialog.dialog.should('not.exist');
    Toast.component.should('exist').and('be.visible');
    Toast.title.should('eq', 'Success: Collection created!');
    new Emoji('body').invokeNGReflectEmoji().should('be.eql', `:grinning:`);
  });
  context('creating an collection', () => {
    const json = JSON.parse(window.localStorage.getItem('auth'));
    it('EN 213 : User should be able to create collection with the default emoji(box)', () => {
      cy.intercept('GET', `${URLs.api.collections}/*`).as('collectionDetails');
      colSearchPage.open();
      colSearchPage.get('createCollectionButton').click();
      CreateCollectionDialog.title('tester').description('desc');
      new Emoji(CreateCollectionDialog.component)
        .invokeNGReflectEmoji()
        .should('be.eql', `:package:`);

      CreateCollectionDialog.create();
      Toast.component.should('exist').and('be.visible');
      Toast.title.should('eq', 'Success: Collection created!');

      cy.wait('@collectionDetails');
      colDetailPage.get('name').should('contain.text', 'tester');
      new Emoji('body').invokeNGReflectEmoji().should('be.eql', `:package:`);
    });

    it('EN 213 : Created by user information should be saved when a new collection is created.', () => {
      cy.url().then((collectionNumber) => {
        collectionNumber = collectionNumber.split('/').slice(-1)[0];

        getCollection(parseInt(collectionNumber)).then((xhr) => {
          collection = xhr;
          expect(collection.CreatedBy).to.equal(json.user.GivenName);
        });
      });
    });

    it('EN 213 : Created date should be saved when a new collection is created.', () => {
      expect(collection.CreateDate.substring(0, 10)).to.be.equal(
        new Date().toISOString().substring(0, 10)
      );
    });

    it('EN 213 : owner information should be saved when a new collection is created, creator is the owner by default.', () => {
      expect(collection.CreatedBy).to.equal(json.user.GivenName);
      expect(collection.OwnerId).to.equal(json.user.Id);
    });

    it('EN 213 : Last updated date should be saved when a new collection is created, at this time the create date and update date should be same', () => {
      expect(collection.CreateDate.substring(0, 17)).to.eql(
        collection.UpdateDate.substring(0, 17)
      );
    });

    it('EN 213 : Last updated by should be saved when a new collection is created i.e. the user who created the collection', () => {
      expect(collection.UpdatedBy).to.eql(collection.CreatedBy);
    });

    it('EN 213 : Collection status should be saved when a new collection is created i.e. Active for new collections', () => {
      expect(['active', 'Active']).to.include(collection.Status);
    });
  });
});
