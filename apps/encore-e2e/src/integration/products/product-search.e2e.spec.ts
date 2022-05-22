/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Collection } from '@esp/collections';
import {
  ActionBar,
  AddToCollection,
  CreateCollectionDialog,
  Pagination,
  ProductCardHarness,
} from '../../shared';
import { esc, standardSetup } from '../../utils';
import { generateCollection } from '../collections/factories';
import { CollectionSearchPage } from '../collections/pages';
import { createCollection, Intercept, mock } from '../collections/utils';
import { productSearch } from './fixtures';
import { ProductSearchPage } from './pages';
import { mockProducts } from './utils';
import { InterceptProduct } from './utils/intercept';

const fixture = productSearch(Cypress.env('environment'));
const prodSearch = new ProductSearchPage();
let collection: Collection;

standardSetup(fixture);

before('Create new collection without mock', () => {
  createCollection(generateCollection(), false)
    .then((res) => (collection = res))
    .then((collection) =>
      cy.log(`Created new collection (${collection.Id}:${collection.Name}).`)
    );
});
describe('product Search E2E', () => {
  it('EN 215 : Clicking Add to collection option should take user to the Create new collection modal when there are existing collections with View Only rights.', () => {
    mock.searchCollection([], { size: 1 });
    InterceptProduct.searchProducts();
    prodSearch.open('test');

    new ProductCardHarness(prodSearch.get('productList').eq(0)).check();

    Pagination.next();

    cy.wait('@searchProducts');

    Pagination.getCurrentPage().then((value) => {
      expect(parseInt(value.trim())).to.equal(2);
      ActionBar.addToCollection();
      cy.wait('@searchCollection');

      CreateCollectionDialog.dialog.should('exist');
    });
  });

  it('EN 215 : User should be redirected back to the search results page with product and filter selections retained when user cancels the Create Collection Modal.', () => {
    //'EN 215 : User should be redirected back to the correct page in search results where user selects products from multiple pages(i.e. last page user was on) and adds to a collection.'
    esc();
    cy.url().should('contain', 'page=2');
    ActionBar.addToCollection();
    AddToCollection.selectCollection(0);
    cy.url().should('contain', 'page=2');
  });

  it('EN 424 : Selections should be removed and tool bar should be hidden when user navigates away from and come back to current page again.', () => {
    Intercept.searchCollection();

    let Results1 = fixture.data.productList.slice(0, 6);
    mockProducts.searchProducts(Results1);
    prodSearch.open('tablet');
    cy.get('img').should('be.visible');
    new ProductCardHarness(prodSearch.get('productList').eq(0)).check();
    ActionBar.getProductCount().should('be.equal', 1);
    new CollectionSearchPage().open();
    cy.wait('@searchCollection');
    cy.get('img')
      .should('be.visible')
      .then(() => {
        ActionBar._element().should('not.exist');

        prodSearch.open('tablet');
        cy.get('img').should('be.visible');
        prodSearch.get('productList').each((element) => {
          new ProductCardHarness(cy.wrap(element))
            .get('checkBox')
            .should('not.be.checked');
        });
      });
  });
});
