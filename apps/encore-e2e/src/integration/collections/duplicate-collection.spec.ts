import { Collection } from '@esp/collections';
import { CreateCollectionDialog, Emoji, Toast } from '../../shared';
import { esc, standardSetup } from '../../utils';
import { generateCollection } from './factories';
import { collectionDetail } from './fixtures';
import { CollectionDetailPage } from './pages';
import {
  createCollection,
  Intercept,
  mock,
  removeCollection,
  URLs,
} from './utils';

const fixture = collectionDetail(Cypress.env('environment'));
const cDetail = new CollectionDetailPage();
const createDialog = new CreateCollectionDialog();
let collection: Collection;
let duplicateCollection: Collection;

standardSetup(fixture);

describe('Duplicate Collection scenarios.', () => {
  before('Create new collection', () => {
    createCollection(
      generateCollection({
        OwnerId: fixture.data.OwnerId,
        Products: fixture.data.products,
      })
    )
      .then((res) => (collection = res))
      .then((collection) => {
        cy.log(`Created new collection (${collection.Id}:${collection.Name}).`);
        duplicateCollection = generateCollection({
          ...collection,
          Id: 1001,
          Name: 'asi Duplicate Name',
          Description: 'asi Duplicate Description',
        });
      });
  });

  after('Remove collection', () => removeCollection(collection));

  it('EN 217 : Clicking Back on Create new collection modal should redirect user back to the source collection detail page and the collection should not be copied/created and success/error toast should NOT be displayed. ', () => {
    mock.testSetup({
      collection: collection,
      duplicateCollection: duplicateCollection,
    });
    cDetail.open(collection.Id).duplicate();
    CreateCollectionDialog.dialog.should('exist');

    //'text "Add a title and description for your new Collection" under the Create new Collection text.'
    createDialog
      .get('heading')
      .should(
        'have.text',
        ` Add a title and description for your new Collection. `
      );

    CreateCollectionDialog.cancel();
    CreateCollectionDialog.dialog.should('not.exist');
    cy.get('@duplicateCollection.all').should('have.length', 0);
  });

  it('EN 217 : Dismissing the Create new collection modal should redirect user back to the source collection detail page and the collection should not be copied/created and success/error toast should NOT be displayed. ', () => {
    mock.testSetup({
      collection: collection,
      duplicateCollection: duplicateCollection,
    });
    cDetail.open(collection.Id).duplicate();
    CreateCollectionDialog.dialog.should('exist');
    esc();
    CreateCollectionDialog.dialog.should('not.exist');
    cy.get('@duplicateCollection.all').should('have.length', 0);
  });

  it('EN 217 : Create New Collection modal should be displayed with user clicks at the Duplicate Collection icon.', () => {
    mock.testSetup({
      collection: collection,
      duplicateCollection: duplicateCollection,
    });
    cDetail.open(collection.Id).duplicate();
    CreateCollectionDialog.dialog.should('exist');
  });

  it('EN 217 : Description and icon should be copied correctly when user duplicate a collection.', () => {
    createDialog.getVal('description').should('be.eql', collection.Description);
    const emoji = new Emoji(CreateCollectionDialog.component);
    emoji.invokeNGReflectEmoji().should('be.eql', `${collection.Emoji}`);
  });

  it('EN 217 : User should be able to update the collection name on Create New Collection screen while duplicating a collection. ', () => {
    const newName = 'new Name';
    CreateCollectionDialog.title(newName);
    new CreateCollectionDialog().getVal('title').then((value) => {
      expect(value).to.be.eq(newName);
    });
  });

  it('EN 217 : User should be able to update the collection icon on Create New Collection screen while duplicating a collection.', () => {
    const emoji = new Emoji(CreateCollectionDialog.component);
    emoji.getIcon().click();
    emoji.SmileysPeople(5).dblclick({ force: true });
    emoji.invokeNGReflectEmoji().should('be.eql', `:sweat_smile:`);
  });

  it('EN 217 : User should be able to update the description on Create New Collection screen while duplicating a collection.', () => {
    const newDescription = 'new Description';
    CreateCollectionDialog.description(newDescription);
    new CreateCollectionDialog().getVal('description').then((value) => {
      expect(value).to.be.eq(newDescription);
    });
  });

  it(`"EN 217 : Success Toast displayed as "Success: Collection copied!" with Subtext: Collection [Collection name] was copied!"`, () => {
    mock.testSetup({
      collection: collection,
      duplicateCollection: duplicateCollection,
    });
    CreateCollectionDialog.create();
    cy.wait('@duplicateCollection');
    Toast.component.should('exist').and('be.visible');
    Toast.title.should('eq', 'Success: Collection copied');
    Toast.message.should('eq', `Collection ${collection.Name} was copied`);
    cy.get('@duplicateCollection.all').should('have.length', 1);
    cy.wait('@getDuplicateCollectionDetails');
    cy.wait('@getDuplicateCollectionProducts');
  });

  it('EN 217 : Clicking Create New collection button on Create New collection modal should take user to the Collection detail page with all details copied successfully including products.', () => {
    Intercept.getCollectionProducts();
    cy.url().should('include', duplicateCollection.Id);
  });

  it('EN 217 : User should be able to duplicate a collection with no products.', () => {
    collection = generateCollection({
      Products: [],
      Name: 'ASI',
      Id: 2004,
    });
    duplicateCollection = {
      ...collection,
      Id: 1001,
      Name: 'asi Duplicate Name',
      Description: 'asi Duplicate Description',
    };
    mock.testSetup({
      collection: collection,
      duplicateCollection: duplicateCollection,
    });

    cDetail.open(collection.Id).duplicate();
    CreateCollectionDialog.dialog.should('exist');
    CreateCollectionDialog.create();
    cy.wait('@duplicateCollection');
    Toast.component.should('exist').and('be.visible');
    Toast.title.should('eq', 'Success: Collection copied');
    Toast.message.should('eq', `Collection ${collection.Name} was copied`);
  });

  it('EN 217 : "Error toast should be displayed when collection is not copied with text  : Error: Collection not copied with Subtext: Collection [collection name] was not able to be copied".', () => {
    collection = generateCollection({
      Name: 'ASI',
      Id: 1,
    });
    mock.testSetup({
      collection: collection,
    });
    cy.intercept('POST', `${URLs.api.collections}/${collection.Id}/copy`, {
      statusCode: 500,
    }).as('duplicateCollection');

    cDetail.open(collection.Id).duplicate();
    CreateCollectionDialog.dialog.should('exist');
    CreateCollectionDialog.create();
    cy.wait('@duplicateCollection');
    Toast.component.should('exist').and('be.visible');
    Toast.title.should('eq', 'Error: Collection not copied');
    Toast.message.should(
      'eq',
      `Collection ${collection.Name} was not able to be copied`
    );
  });
});
