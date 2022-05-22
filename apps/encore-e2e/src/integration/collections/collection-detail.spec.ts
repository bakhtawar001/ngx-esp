/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Collection, CollectionProduct } from '@esp/collections';
import {
  ActionBar,
  AddToCollection,
  ConfirmDialog,
  CreateCollectionDialog,
  Emoji,
  InlineEditComponent,
  Toast,
  TransferOwnershipDialog,
} from '../../shared';
import { esc, randomStringGenerator, standardSetup } from '../../utils';
import { ProductCardHarness } from '../products';
import { generateCollectionProduct } from '../products/factories/product';
import { generateCollection } from './factories';
import { collectionDetail } from './fixtures';
import { CollectionDetailPage, CollectionSearchPage } from './pages';
import { Intercept, URLs } from './utils';
import { mock } from './utils/mock';

const fixture = collectionDetail(Cypress.env('environment'));
const page = new CollectionDetailPage();
const collectionSearchPage = new CollectionSearchPage();
let auth: any;

standardSetup(fixture);

function testSetup(options?: {
  collection?: Partial<Collection>;
  collectionProducts?: CollectionProduct[];
}) {
  const collection = generateCollection({
    OwnerId: fixture.data.OwnerId,
    Products: fixture.data.products,
    ...options?.collection,
  });

  mock.testSetup({
    collection,
    collectionProducts: options?.collectionProducts,
  });

  page.open(collection.Id);

  cy.wait('@getCollection');
  cy.wait('@getCollectionProducts');

  return { collection };
}

before(() => {
  cy.waitUntil(() =>
    cy.window().then(() => {
      JSON.parse(localStorage.getItem('auth')).user != null;
    })
  ).then(() => {
    auth = JSON.parse(localStorage.getItem('auth')).user;
  });
});

describe('Collection Detail : Archive / Activate', () => {
  it('Users with only view rights for a collection should NOT be displayed with make Archive option.', () => {
    testSetup({ collection: { IsEditable: false } });

    page.openContextMenu().get('archiveElement').should('not.exist');
  });

  it('EN 423 : User should not be able to delete products from an Archive collection.', () => {
    testSetup({
      collection: {
        Status: 'Archived',
        Id: 1001,
      },
    });

    cy.wait('@getCollectionProducts');

    const productCard = new ProductCardHarness(page.get('productList').eq(0));

    productCard
      .openContextMenu()
      .find('.remove-from-collection')
      .should('be.disabled');
  });

  it('EN 422 : Selecting the Remove from collection option from three dot menu should remove that product from the collection detail page.', () => {
    const { collection } = testSetup({
      collection: {
        Status: 'Active',
        Id: 1000,
      },
    });

    cy.wait('@getCollectionProducts');

    new ProductCardHarness(page.get('productList').eq(0)).check();

    collection.Products = collection.Products.slice(1);

    mock.removeFromCollection(collection);

    ActionBar.removeFromCollection();

    cy.wait('@removeFromCollection').then(({ request: { body } }) => {
      //EN 422 : selecting a single product from the collection and clicking Remove from collection from action bar should remove that single product from the collection
      expect(body).to.have.length(1);
      expect(body[0]).to.equal(fixture.data.products[0].Id);
    });

    page.get('productList').should('have.length', 2);
  });

  it('EN 422 : Selecting the multiple products from the collection and clicking Remove from collection from action bar should remove the all selected products from the collection. ', () => {
    const { collection } = testSetup({
      collection: {
        Status: 'Active',
        Id: 1001,
      },
    });

    cy.get('img').should('be.visible');

    new ProductCardHarness(page.get('productList').eq(0)).check();
    new ProductCardHarness(page.get('productList').eq(1)).check();

    collection.Products = collection.Products.slice(2);
    mock.removeFromCollection(collection);
    ActionBar.removeFromCollection();
    cy.wait('@removeFromCollection').then(({ request: { body } }) => {
      expect(body).to.have.length(2);
      expect(body[0]).to.equal(fixture.data.products[0].Id);
      expect(body[1]).to.equal(fixture.data.products[1].Id);
    });

    // 'EN 422 : Page should be refreshed to show the changes once the product(s) is deleted.'
    page.get('productList').should('have.length', 1);
  });

  it('EN 422 : User should be able to remove all products from the collection. ', () => {
    const { collection } = testSetup({
      collection: {
        Status: 'Active',
        Id: 1000,
      },
    });

    cy.wait('@getCollectionProducts');
    cy.get('img').should('be.visible');
    new ProductCardHarness(page.get('productList').eq(0)).check();
    new ProductCardHarness(page.get('productList').eq(1)).check();
    new ProductCardHarness(page.get('productList').eq(2)).check();
    collection.Products = [];
    mock.testSetup({ collection });
    mock.removeFromCollection(collection);
    ActionBar.removeFromCollection();
    cy.wait('@removeFromCollection').then(({ request: { body } }) => {
      expect(body).to.have.length(fixture.data.products.length);
      expect(body[0]).to.equal(fixture.data.products[0].Id);
      expect(body[1]).to.equal(fixture.data.products[1].Id);
      expect(body[2]).to.equal(fixture.data.products[2].Id);
    });

    // Assert: 'EN 422 : Success Toast displayed correctly as : "Success!" with subtext "N products deleted." when a multiple products removed from the collection and N is the number of products. '
    Toast.component.should('exist').and('be.visible');
    Toast.title.should('eq', `Success!`);
    Toast.message.should('eq', '3 products deleted.');
  });

  it('EN 423 : User should be able to update an Active collection to Archive. ', () => {
    //EN 423 : User should be able to make active an archive collection
    const { collection } = testSetup({
      collection: {
        Status: 'Active',
        Id: 1002,
      },
    });

    page.archive();
    Toast.component.should('exist').and('be.visible');
    Toast.title.should('eq', `Collection ${collection.Name} Archived!`);
  });

  it('EN 423 : User with view only rights should not be able to update the status.', () => {
    const { collection } = testSetup({
      collection: {
        Status: 'Active',
        Id: 1001,
        IsVisible: true,
        IsEditable: false,
      },
    });

    page
      .openContextMenu()
      .get(CollectionDetailPage.SELECTORS.archive)
      .should('not.exist');
  });

  it('EN 423 : User with edit rights should be able to update the status.', () => {
    const { collection } = testSetup({
      collection: {
        Status: 'Active',
        Id: 1001,
        IsVisible: true,
        IsEditable: true,
      },
    });

    page
      .openContextMenu()
      .get(CollectionDetailPage.SELECTORS.archive)
      .should('exist');
    esc();
  });

  it('EN 423 : User should NOT be able to perform following actions on an archived collection from collction details page: Update icon, Update Name, Update decription, Add products, remove products, Update collaborators and transfer ownership. ', () => {
    const { collection } = testSetup({
      collection: {
        Status: 'Archived',
        Id: 1002,
        IsVisible: true,
        IsEditable: true,
      },
    });

    const emoji = new Emoji(CollectionDetailPage.SELECTORS.name);
    emoji
      ._element()
      .invoke('attr', 'ng-reflect-readonly')
      .should('be.equal', 'true');
  });

  it('EN 456 : User with edit rights should NOT be able to transfer ownreship.', () => {
    const { collection } = testSetup({
      collection: {
        Status: 'Active',
        Id: 1003,
        IsVisible: true,
        IsEditable: false,
      },
    });

    page.openContextMenu();
    page.get('transferOwnerShip').should('not.exist');
  });

  it('EN 423 : Archived collection should be displayed under the Archived tab only. ', () => {
    Intercept.searchCollection({}, { status: 'archived' });
    collectionSearchPage.open();
    collectionSearchPage.get('collectionList').should('be.visible');
    collectionSearchPage.archiveTab();
    cy.wait('@searchCollection');
  });

  it('Should activate a Collection', () => {
    const { collection } = testSetup({
      collection: {
        Status: 'Archived',
        Id: 1002,
      },
    });

    page.activate();
    Toast.component.should('exist').and('be.visible');
    Toast.title.should('eq', `Collection ${collection.Name} is Active!`);
  });
});

describe('Collection Detail: Delete', () => {
  it('should NOT remove collection when delete action is dismissed.', () => {
    // Arrange
    const { collection } = testSetup();

    page.delete();
    ConfirmDialog.cancel();

    // Assert
    cy.get('@deleteCollection').should('be.null');
    Toast.component.should('not.exist');
    cy.url().should('include', `/collections/${collection.Id}`);
  });

  it('should remove collection when delete action is confirmed.', () => {
    // Arrange
    const { collection } = testSetup();

    page.delete();
    ConfirmDialog.confirm();

    // Assert
    Toast.component.should('exist').and('be.visible');
    Toast.title.should('eq', 'Success!');

    cy.url().should('contain', new CollectionSearchPage().uri);
    cy.get('@deleteCollection.all').should('have.length', 1);
  });
});

describe('Collection Detail', () => {
  it('User able to Edit Collection Name and Collection Description.', () => {
    const { collection } = testSetup();

    cy.wait('@getCollectionProducts').then(() => {
      // Arrange
      const updatedName = `Automation Updated Name ${randomStringGenerator(
        10
      )}`;
      const nameEditControl = new InlineEditComponent(
        CollectionDetailPage.SELECTORS.name
      );
      // Act
      nameEditControl.edit().type(updatedName).save();
      cy.wait('@updateCollection').then(
        ({
          request: {
            body: { Name },
          },
        }) => {
          expect(Name).to.equal(updatedName);
          // Assert
          page.get('name').should('have.text', updatedName);

          // Arrange
          const updatedDescription = `collection Updated Description ${randomStringGenerator(
            10
          )}`;

          const descriptionEditControl = new InlineEditComponent(
            CollectionDetailPage.SELECTORS.description
          );

          // Act
          descriptionEditControl.edit().type(updatedDescription).save();
          cy.wait('@updateCollection');
          cy.wait('@updateCollection').then(
            ({
              request: {
                body: { Description },
              },
            }) => {
              expect(Description).to.equal(updatedDescription);
              // Assert
              page.get('description').should('have.text', updatedDescription);
            }
          );
        }
      );
    });
  });

  it('EN 240 : Emoji icon should be updated at collection landing page when user clicks on a different emoji', () => {
    const { collection } = testSetup();

    const emoji = new Emoji(CollectionDetailPage.SELECTORS.name);
    emoji.getIcon().click();
    emoji.dialogBox().should('exist');
    emoji.SmileysPeople(5).click({ force: true });
    cy.wait('@updateCollection').then(
      ({
        request: {
          body: { Emoji },
        },
      }) => {
        emoji.invokeNGReflectEmoji().should('be.eql', `:sweat_smile:`);
        expect(Emoji).to.equal(':sweat_smile:');
      }
    );
  });

  it('Product List displayed under Collection Detail Page.', () => {
    const { collection } = testSetup();

    page
      .get('productList')
      .should('exist')
      .and('be.visible')
      .its('length')
      .should('eq', collection.Products.length);
  });

  it('Transfer Ownership', () => {
    const { collection } = testSetup({
      collection: { TenantId: auth.TenantId },
    });

    page.transferOwnership();
    TransferOwnershipDialog.setOwner(fixture.data.newOwner).save();
    ConfirmDialog.confirm();
    cy.wait('@transfer').then(() => {
      Toast.component.should('exist').and('be.visible');
      Toast.title.should('eq', 'Ownership Transferred!');
    });
  });

  it('EN 456 : Current owner should not be listed in the users dropdown. ', () => {
    const { collection } = testSetup({
      collection: {
        Id: 1003,
        CreatedBy: auth.GivenName,
        TenantId: auth.TenantId,
        OwnerId: auth.Id,
        Access: [
          { AccessLevel: 'Everyone', EntityId: 0, AccessType: 'ReadWrite' },
        ],
        Collaborators: [
          {
            UserId: auth.Id,
            Name: auth.Name,
            IsTeam: false,
            Role: 'Owner',
          },
        ],
      },
    });
    const dialog = new TransferOwnershipDialog();

    Intercept.users(auth.Id);

    page.transferOwnership();

    cy.wait('@users');

    dialog.get('input').click();

    dialog.get('userList').contains(auth.Name).should('not.exist');

    TransferOwnershipDialog.close();
  });

  it('EN 223 : Clicking on an existing collection should add the product to the selected collection successfully.', () => {
    const { collection } = testSetup();

    const list = [
      generateCollection({ Id: 2001 }),
      generateCollection({ Id: 2002 }),
    ];
    // EN 421 : Deleted Collection should NOT be available on Add Products modal both by default and using search.
    // EN 431 : Deleted Collection should NOT be available on Add Products modal both by default and using search.
    mock
      .searchCollection(list, {
        from: 1,
        size: 20,
        editOnly: true,
        excludeList: '1000',
        status: 'Active',
      })
      .addProductsToCollection(list[1]);

    new ProductCardHarness(page.get('productList').eq(0)).check();

    ActionBar.addToCollection();

    cy.wait('@searchCollection');

    AddToCollection.selectCollection(1);

    cy.wait('@addProductsToCollection').then(({ request: { url, body } }) => {
      expect(url).to.contain(`${URLs.api.collections}/${list[1].Id}/products`);
      expect(body[0].ProductId).to.equal(fixture.data.products[0].Id);
      expect(body[0].Name).to.equal(fixture.data.products[0].Name);
      expect(body[0].Description).to.equal(
        fixture.data.products[0].Description
      );
      expect(body[0].ImageUrl).to.equal(fixture.data.products[0].ImageUrl);
    });
  });

  it('EN 223 : Duplicate Product should not be added to a collection when it already exists in the selected collection. ', () => {
    const { collection } = testSetup();

    const list = [
      generateCollection({ Id: 2001 }),
      generateCollection({ Id: 2002 }),
    ];
    mock
      .searchCollection(list, {
        editOnly: true,
        from: 1,
        size: 20,
        excludeList: collection.Id.toString(),
        status: 'Active',
      })
      .addProductsToCollection(list[1], [100]);
    new ProductCardHarness(page.get('productList').eq(0)).check();
    ActionBar.addToCollection();
    cy.wait('@searchCollection');
    AddToCollection.selectCollection(1);
    cy.wait('@addProductsToCollection').then((xhr) => {
      Toast.component.should('exist').and('be.visible');
      Toast.title.should('eq', `Error: Products not added!`);
      Toast.message.should(
        'eq',
        '1 product(s) already exist in collectionName!'
      );
    });
  });

  it('EN 223 : Product should be added to a collection when user creates new collection while no existing collections exixts in the system(Add Products modal is bypassed)', () => {
    const { collection } = testSetup();

    cy.get('img').should('be.visible');
    mock.searchCollection([], {
      editOnly: true,
      excludeList: collection.Id.toString(),
      status: 'Active',
      from: 1,
      size: 1,
    });
    new ProductCardHarness(page.get('productList').eq(0)).check();
    ActionBar.addToCollection();
    cy.wait('@searchCollection');
    CreateCollectionDialog.dialog.should('exist');
    CreateCollectionDialog.create();
    cy.wait('@newCollection').then(({ request: { body } }) => {
      expect(body.Emoji).to.equal(':package:');
      expect(body.Name).to.equal('New Collection');
      expect(body.Description).to.equal('');
      expect(body.Products).to.eql([
        {
          ProductId: fixture.data.products[0].Id,
          Name: fixture.data.products[0].Name,
          Description: fixture.data.products[0].Description,
          ImageUrl: fixture.data.products[0].ImageUrl,
        },
      ]);
    });
  });

  it('EN 501 : product name, product id, supplier name, price information should continue to display when the product is no longer available. ', () => {
    const collectionProducts = [
      generateCollectionProduct({ Id: 2001, IsDeleted: true }),
      generateCollectionProduct({ Id: 2002 }),
      generateCollectionProduct({ Id: 2003 }),
    ];

    const { collection } = testSetup({ collectionProducts });

    // TODO: where are the tests?
  });

  it('EN 501 : User should NOT be able to add the product that is no longer available to another collection ', () => {
    const collectionProducts = [
      generateCollectionProduct({ Id: 2001, IsDeleted: true }),
      generateCollectionProduct({ Id: 2002 }),
      generateCollectionProduct({ Id: 2003 }),
    ];

    const { collection } = testSetup({ collectionProducts });

    cy.wait('@getCollectionProducts');

    const productCard = new ProductCardHarness(page.get('productList').first());

    productCard.get('checkbox').should('not.be.visible');
  });

  it("EN 501 : When user does a select All from Action bar the not available product's checkbox should not be selected,", () => {
    const collectionProducts = [
      generateCollectionProduct({ Id: 2001, IsDeleted: true }),
      generateCollectionProduct({ Id: 2002 }),
      generateCollectionProduct({ Id: 2003 }),
    ];

    const { collection } = testSetup({ collectionProducts });

    cy.wait('@getCollectionProducts');

    let productCard = new ProductCardHarness(page.get('productList').eq(1));

    productCard.check();

    ActionBar.selectUnselectAllProducts('check');

    productCard = new ProductCardHarness(page.get('productList').eq(0));

    productCard.get('checkbox').should('not.be.visible');
  });
});
