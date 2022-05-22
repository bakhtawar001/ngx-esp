/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Collection } from '@esp/collections';
import {
  ActionBar,
  AddToCollection,
  CreateCollectionDialog,
  Emoji,
  InlineEditComponent,
  ManageCollaboratorsDialog,
} from '../../shared';
import { randomStringGenerator, standardSetup } from '../../utils';
import { ProductCardHarness } from '../products';
import { ProductSearchPage } from '../products/pages';
import { InterceptProduct } from '../products/utils/intercept';
import { generateCollection } from './factories';
import { collectionDetail } from './fixtures';
import { CollectionDetailPage } from './pages/collection-detail.page';
import {
  createCollection,
  duplicate,
  getCollection,
  Intercept,
  removeCollection,
} from './utils';

const fixture = collectionDetail(Cypress.env('environment'));
const page = new CollectionDetailPage();
const productSearchPage = new ProductSearchPage();

standardSetup(fixture);

describe('API E2E Test cases.', () => {
  context('UI based testing', () => {
    let collection: Collection;
    let newCollection: Collection;
    before('Create new collection without mock', () => {
      createCollection(
        generateCollection({ Name: randomStringGenerator(10) }),
        false
      )
        .then((res) => (collection = res))
        .then((collection) =>
          cy.log(
            `Created new collection (${collection.Id}:${collection.Name}).`
          )
        );
    });

    after('Remove collection', () => removeCollection(collection, false));

    it('By default Every one Within your Company radio Button should be selected under Manage Collection. Also very that the Allow Editing check box is checked By default.', () => {
      expect(collection.AccessLevel).to.equal('Everyone');
      expect(collection.Access).to.eql([
        { AccessLevel: 'Everyone', EntityId: 0, AccessType: 'ReadWrite' },
      ]);
    });

    it('EN 217 : Clicking Create New Collection should copy the existing collection with collection name as entered on screen, description copied from the source collection, icon copied from the source collection, all products copied from the source collection correctly. Here  we are Verifying the products are getting copied or not.', () => {
      Intercept.duplicateCollection(collection.Id);
      page.open(collection.Id).duplicate();
      CreateCollectionDialog.create();
      cy.wait('@duplicateCollection').then(({ response: { body } }) => {
        newCollection = body;
        Intercept.getCollectionProducts(newCollection.Id);
        cy.wait('@getCollectionProducts').then(({ response: { body } }) => {
          expect(body.Results.length).to.equal(collection.Products.length);
          let list = [];
          collection.Products.forEach(($element) => {
            list.push($element.ProductId);
          });
          body.Results.forEach(($product) => {
            expect(list).to.include($product.ProductId);
          });
          cy.get('@duplicateCollection.all').should('have.length', 1);
        });
      });
    });

    it('EN 217 : User should be update name, icon and description form collection landing page of the copied collection. ', () => {
      Intercept.updateCollection(newCollection);
      // Arrange
      const updatedName = `duplicateCollection Updated Name ${randomStringGenerator(
        10
      )}`;
      const nameEditControl = new InlineEditComponent(
        CollectionDetailPage.SELECTORS.name
      );

      // Act
      nameEditControl.edit().type(updatedName).save();
      cy.wait('@updateCollection');

      // Assert
      page.get('name').should('have.text', updatedName);

      // Arrange
      const updatedDescription = `duplicateCollection Updated Description ${randomStringGenerator(
        10
      )}`;

      const descriptionEditControl = new InlineEditComponent(
        CollectionDetailPage.SELECTORS.description
      );

      // Act
      descriptionEditControl.edit().type(updatedDescription).save();

      cy.wait('@updateCollection');

      // Assert
      page.get('description').should('have.text', updatedDescription);
      cy.get('@updateCollection.all').should('have.length', 3);
    });

    it('EN 240 : User should be able to update emoji for a copied collection', () => {
      Intercept.updateCollection(newCollection)
        .getCollection(newCollection)
        .getCollectionProducts(newCollection.Id, { from: 1 });
      page.open(newCollection.Id);
      cy.wait('@getCollection');
      cy.wait('@getCollectionProducts');
      let emoji = new Emoji(CollectionDetailPage.SELECTORS.name);
      emoji.clickicon();
      emoji.dialogBox().should('exist');
      emoji.SmileysPeople(5).click({ force: true });
      emoji.dialogBox().should('not.exist');
      emoji.invokeNGReflectEmoji().should('be.eql', ':sweat_smile:');
      cy.wait('@updateCollection').then((xhr) => {
        const emoji = new Emoji(CollectionDetailPage.SELECTORS.name);
        emoji.invokeNGReflectEmoji().then((icon) => {
          expect(icon).to.equal(':sweat_smile:');
        });
      });
    });
  });

  context('API Based Testing', () => {
    let source: Collection;
    let target: Collection;

    it('EN 217 : Owner of the target collection should be correctly set to the user who is duplicating the collection when the owner of the source collection is different user.', () => {
      getCollection(fixture.data.duplicateCollection.id).then((resp) => {
        //Verify that the owner is different
        source = resp;
        expect(source.CreatedBy).to.equal(
          fixture.data.duplicateCollection.name
        );
        expect(source.AccessLevel).to.equal('Custom');

        duplicate(source, { Name: randomStringGenerator(10) }).then((resp) => {
          target = resp;
          const auth_user = JSON.parse(window.localStorage.getItem('auth'));
          // EN 217 : Created By for the target collection should be set to the user who has copied the collection.
          expect(target.CreatedBy).to.equal(auth_user.user.GivenName);
          expect(target.OwnerId).to.be.equal(auth_user.user.Id);
        });
      });
    });

    it('EN 217 : Created date for the target collection should be set to the date/time when collection is copied.', () => {
      expect(target.CreateDate.substring(0, 10)).to.equal(
        new Date().toISOString().substring(0, 10)
      );
    });

    it('EN 217 : Admins should have access to the copied collection.', () => {
      cy.logOut().then(() => {
        cy.login(Cypress.env('adminUserName'), Cypress.env('adminPassword'));
        Intercept.getCollectionDetails(target.Id);
        new CollectionDetailPage().open(target.Id);
        cy.wait('@getCollectionDetails').then((intercept) => {
          expect(intercept.response.body.IsVisible).to.be.true;
          expect(intercept.response.body.IsEditable).to.be.true;
          cy.logOut().then(() => {
            cy.login(Cypress.env('username'), Cypress.env('password'));
            page.open(target.Id);
          });
        });
      });
    });

    it('EN 217 : Owner of the source collection should NOT be updated when duplicating that collection. ', () => {
      getCollection(fixture.data.duplicateCollection.id).then(
        (parent: Collection) => {
          //Verify that the owner is different
          expect(parent.CreatedBy).to.equal(
            fixture.data.duplicateCollection.name
          );
        }
      );
    });

    it('EN 217 : User should be able to add or manage the collaborators on a collection. ', () => {
      Intercept.updateCollection(target).getCollectionDetails(target.Id);
      page.open(target.Id);
      cy.wait('@getCollectionDetails');
      page.manage();
      ManageCollaboratorsDialog.custom([
        { name: fixture.data.newOwner, role: 'view' },
      ]).save();
      cy.wait('@updateCollection').then((intercept) => {
        target = intercept.response.body;
        expect(target.Collaborators.length).to.be.eq(2);
      });
    });

    it('EN 217 : User should be able to add or remove products to the target collection. ', () => {
      Intercept.searchCollection();
      const list: number[] = [];

      InterceptProduct.searchProducts();

      productSearchPage.open('cups');

      cy.get('img').should('be.visible');
      let productCard = new ProductCardHarness(
        productSearchPage.get('productList').eq(0)
      );

      productCard
        .check()
        .getProductId()
        .then((value) => {
          list.push(parseInt(value.trim()));
        });

      productCard = new ProductCardHarness(
        productSearchPage.get('productList').eq(5)
      );

      productCard
        .check()
        .getProductId()
        .then((value) => {
          list.push(parseInt(value.trim()));
        });

      ActionBar.addToCollection();
      cy.wait('@searchCollection');
      Intercept.searchCollection({ term: target.Name }).addProductsToCollection(
        target.Id
      );
      AddToCollection.search(target.Name);
      cy.wait('@searchCollection');
      AddToCollection.selectCollection(0);
      cy.wait('@addProductsToCollection');
    });
  });
});
