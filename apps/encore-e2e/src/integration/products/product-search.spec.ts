/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { ActionBar, AddToCollection } from '../../shared';
import { esc, standardSetup } from '../../utils';
import { generateCollection } from '../collections/factories';
import { Intercept } from '../collections/utils';
import { productSearch } from './fixtures';
import { ProductSearchPage } from './pages';
import { ProductCardHarness } from './shared';
import { InterceptProduct } from './utils/intercept';

const fixture = productSearch(Cypress.env('environment'));
const page = new ProductSearchPage();
let collection = generateCollection();

standardSetup(fixture);

describe('Product Search ', () => {
  it('EN 214 : Clicking Add to collection option should take user to the Add to collection modal when there are multiple existing collections and user has edit rights for all of collections.', () => {
    const productsAdded = [];

    // EN 393 : Clicking Add to collection option should take user to the Add to collection modal when there are multiple existing collections and user has edit rights for all of collections.
    Intercept.searchCollection();
    InterceptProduct.searchProducts();

    page.open('cups');

    const productCard = new ProductCardHarness(page.get('productList').eq(0));

    productCard
      .check()
      .getProductId()
      .then((value: string) => {
        productsAdded.push(+value);
      });

    ActionBar.addToCollection();

    cy.wait('@searchCollection');

    AddToCollection.dialog().should('exist');

    esc();
  });

  //   it('EN 214 : Clicking Add to collection option should take user to the Create new collection modal when there are no existing active  collections.', () => {
  //     // EN 214 : Clicking Add  to collection option should take user to the Create new collection modal when there are existing collections with View Only rights.
  //     mock.searchCollection([], { editOnly: true, size: 1 });
  //     ActionBar.addToCollection();
  //     cy.wait('@searchCollection');
  //     CreateCollectionDialog.dialog.should('exist');
  //   });

  //   it('EN 214 : Product should be added to a collection when user creates new collection while no existing collections exists in the system(Add Products modal is bypassed).', () => {
  //     mock.testSetup({ collection: collection });
  //     CreateCollectionDialog.create();
  //     cy.wait('@newCollection').then(
  //       ({
  //         request: {
  //           body: { Products },
  //         },
  //       }) => {
  //         expect(Products).to.have.lengthOf(1);
  //         Toast.component.should('exist').and('be.visible');
  //         Toast.title.should('eq', 'Success: Collection created!');
  //         Toast.component.should('not.exist');
  //         expect(Products[0].ProductId).to.equal(productsAdded[0]);
  //       }
  //     );
  //   });

  //   it('EN 214 : Product should be added to the collection when user creates new collection using Add products modal.', () => {
  //     //EN 223 : Product should be added to the collection when user creates new collection using Add products modal.

  //     mock.testSetup({ collection: collection });
  //     new ProductCardHarness(page.get('productList').eq(0)).check();
  //     ActionBar.addToCollection();
  //     AddToCollection.createANewCollection();
  //     CreateCollectionDialog.create();
  //     cy.wait('@newCollection').then(
  //       ({
  //         request: {
  //           body: { Products },
  //         },
  //       }) => {
  //         Toast.component.should('exist').and('be.visible');
  //         Toast.title.should('eq', 'Success: Collection created!');
  //         Toast.component.should('not.exist');

  //         expect(Products[0].ProductId).to.equal(productsAdded[0]);
  //       }
  //     );
  //   });

  //   it('EN 214 : User should be redirected back to the search results when user selects and adds a product to a collection successfully.', () => {
  //     cy.url().should('contain', `${new ProductSearchPage().uri}`);
  //   });

  //   it('EN 214 : Product should not be added to a collection when it already exists in the selected collection. ', () => {
  //     mock.testSetup({ collection: collection });
  //     const firstProduct = new ProductCardHarness(page.get('productList').eq(0));
  //     firstProduct.check();
  //     mock.searchCollection([collection], { size: 20 });
  //     ActionBar.addToCollection();
  //     cy.wait('@searchCollection');
  //     mock.addProductsToCollection(collection, [1]);
  //     AddToCollection.selectCollection(0);
  //     cy.wait('@addProductsToCollection');
  //     Toast.component.should('exist').and('be.visible');
  //     Toast.title.should('eq', 'Error: Products not added!');
  //     Toast.message.should(
  //       'eq',
  //       `1 product(s) already exist in ${collection.Name}!`
  //     );
  //     Toast.component.should('not.exist');
  //   });

  //   it('EN 214 : User should be redirected back to the search results when product is NOT added to a collection(e.g. Duplicate product).', () => {
  //     cy.url().should('contain', `${new ProductSearchPage().uri}`);
  //   });
  // });

  // describe('EN 215 : Multiple Products', () => {
  //   productsAdded = [];
  //   it('EN 215 : Clicking Add to collection option from action bar should take user to the Add to collection modal when there are multiple existing collections and user has edit rights for all of collections. ', () => {
  //     InterceptProduct.searchProducts();
  //     page.open('test');
  //     cy.get('img').should('be.visible');
  //     mock.searchCollection([collection], { size: 20 });

  //     let productCard = new ProductCardHarness(page.get('productList').eq(0));
  //     productCard
  //       .check()
  //       .getProductId()
  //       .then((value: string) => {
  //         productsAdded.push(parseInt(value));

  //         productCard = new ProductCardHarness(page.get('productList').eq(6));
  //         productCard
  //           .check()
  //           .getProductId()
  //           .then((value: string) => {
  //             productsAdded.push(parseInt(value));
  //           });
  //         ActionBar.addToCollection();
  //         cy.wait('@searchCollection');
  //         AddToCollection.dialog().should('exist');
  //         esc();
  //       });
  //   });

  //   it('EN 215 : Clicking Add to collection option should take user to the Create new collection modal when there are no existing active collections.', () => {
  //     mock.searchCollection([], { size: 1 });
  //     ActionBar.addToCollection();
  //     cy.wait('@searchCollection');
  //     CreateCollectionDialog.dialog.should('exist');
  //   });

  //   it('EN 215 : Products should be added to a collection when user selects one or more products and create new collection while no existing collections exixts in the system(Add Products modal is bypassed)', () => {
  //     mock.testSetup({ collection: collection });
  //     CreateCollectionDialog.create();
  //     cy.wait('@newCollection').then(
  //       ({
  //         request: {
  //           body: { Products },
  //         },
  //       }) => {
  //         Toast.component.should('exist').and('be.visible');
  //         expect(Products).to.have.lengthOf(2);
  //         expect(productsAdded).to.include(Products[0].ProductId);
  //         expect(productsAdded).to.include(Products[1].ProductId);
  //         Toast.component.should('not.exist');
  //       }
  //     );
  //   });

  //   it('EN 215 : Clicking on an existing collection at Add to Collection modal should add the selected products to the selected collection successfully.', () => {
  //     // EN 215 : All selected products should be added successfully when user selects and add products from a single page.
  //     mock.searchCollection([collection], { size: 20 });
  //     productsAdded = [];

  //     let productCard = new ProductCardHarness(page.get('productList').eq(0));

  //     productCard
  //       .check()
  //       .getProductId()
  //       .then((value: string) => {
  //         productsAdded.push(parseInt(value));
  //       });

  //     productCard = new ProductCardHarness(page.get('productList').eq(6));
  //     productCard
  //       .check()
  //       .getProductId()
  //       .then((value: string) => {
  //         productsAdded.push(parseInt(value));
  //       });

  //     mock.addProductsToCollection(collection);
  //     ActionBar.addToCollection();
  //     cy.wait('@searchCollection').then(() => {
  //       AddToCollection.selectCollection(0);
  //       cy.wait('@addProductsToCollection').then(({ request: { body } }) => {
  //         expect(body).to.have.lengthOf(2);
  //         expect(productsAdded).to.include(body[0].ProductId);
  //         expect(productsAdded).to.include(body[1].ProductId);
  //         Toast.component.should('exist').and('be.visible');
  //         Toast.title.should('eq', 'Success: Products added!');
  //         Toast.message.should('eq', `2 product(s) added to ${collection.Name}!`);
  //         Toast.component.should('not.exist');
  //       });
  //     });
  //   });

  //   it('EN 215 : Products should be added to the collection when user selects one or more products and create new collection using Add products modal.', () => {
  //     mock.testSetup({ collection: collection });
  //     let productCard = new ProductCardHarness(page.get('productList').eq(0));
  //     productCard
  //       .check()
  //       .getProductId()
  //       .then((value: string) => {
  //         productsAdded.push(parseInt(value));
  //       });
  //     productCard = new ProductCardHarness(page.get('productList').eq(8));
  //     productCard
  //       .check()
  //       .getProductId()
  //       .then((value: string) => {
  //         productsAdded.push(parseInt(value));
  //       });
  //     ActionBar.addToCollection();
  //     AddToCollection.createANewCollection();
  //     CreateCollectionDialog.create();
  //     cy.wait('@newCollection').then(
  //       ({
  //         request: {
  //           body: { Products },
  //         },
  //       }) => {
  //         expect(productsAdded).to.be.includes(Products[0].ProductId);
  //         expect(productsAdded).to.be.includes(Products[1].ProductId);
  //       }
  //     );
  //   });
  // });

  // describe('EN 214 : Select multiple products from multiple pages.', () => {
  //   productsAdded = [];
  //   let Results1 = fixture.data.productList.slice(0, 3);
  //   let Results2 = fixture.data.productList.slice(5, 7);

  //   it('EN 215 : All selected products should be added successfully when user select multiple products across different pages and adds them to a collection. ', () => {
  //     mockProducts.searchProducts(Results1);
  //     page.open('table');
  //     cy.get('img').should('be.visible');
  //     new ProductCardHarness(page.get('productList').eq(0))
  //       .check()
  //       .getProductId()
  //       .then((value: string) => {
  //         productsAdded.push(parseInt(value));

  //         mockProducts.searchProducts(Results2);
  //         Pagination.next();
  //         cy.wait('@searchProducts');
  //         new ProductCardHarness(page.get('productList').eq(1))
  //           .check()
  //           .getProductId()
  //           .then((value: string) => {
  //             productsAdded.push(parseInt(value));
  //           });

  //         mock.searchCollection([collection], { size: 20 });

  //         // EN 424 : Count of selected products should be updated correctly when user selects products individually across different pages.
  //         ActionBar.getProductCount().should('be.equal', 2);
  //         ActionBar.addToCollection();
  //         cy.wait('@searchCollection');
  //         mock.addProductsToCollection(collection);
  //         AddToCollection.selectCollection(0);
  //         cy.wait('@addProductsToCollection').then(({ request: { body } }) => {
  //           expect(body).to.have.lengthOf(2);
  //           expect(productsAdded).to.includes(body[0].ProductId);
  //           expect(productsAdded).to.includes(body[1].ProductId);

  //           Toast.component.should('exist').and('be.visible');

  //           Toast.component.should('not.exist');
  //         });
  //       });
  //   });

  //   it('EN 215 : User should be redirected back to the search results page when user selects multiples products and add all products to a collection successfully from Add Collection Modal.', () => {
  //     cy.url().should('contain', `${new ProductSearchPage().uri}`);
  //     Pagination.getCurrentPage().then((value) => {
  //       expect(parseInt(value.trim())).to.equal(2);
  //     });
  //   });

  //   it('EN 215 : User should be redirected back to the search results when some products are added and some are not after user selects multiple products and add them to a collection from Add Collection Modal.', () => {
  //     Results1 = fixture.data.productList.slice(0, 6);
  //     mockProducts.searchProducts(Results1);
  //     page.open('cups');

  //     new ProductCardHarness(page.get('productList').eq(0)).check();
  //     Pagination.next();
  //     cy.wait('@searchProducts');
  //     mock.searchCollection([collection], { size: 20 });
  //     ActionBar.addToCollection();
  //     cy.wait('@searchCollection').then((xhr) => {
  //       mock.addProductsToCollection(collection, 1);
  //       AddToCollection.selectCollection(0);
  //       cy.wait('@addProductsToCollection');

  //       Toast.component.should('exist').and('be.visible');

  //       Toast.component.should('not.exist');

  //       cy.url().should('contain', `${new ProductSearchPage().uri}`);
  //       Pagination.getCurrentPage().then((value) => {
  //         expect(parseInt(value.trim())).to.be.equal(2);
  //       });
  //     });
  //   });

  //   it('EN 424 : Selecting checkbox from tool bar should not select products from other pages', () => {
  //     Results1 = fixture.data.productList.slice(0, 3);
  //     mockProducts.searchProducts(Results1);
  //     page.open('cups');
  //     new ProductCardHarness(page.get('productList').eq(0)).check();
  //     ActionBar.getProductCount().should('be.equal', 1);

  //     let Results2 = fixture.data.productList.slice(5, 7);
  //     mockProducts.searchProducts(Results2);
  //     Pagination.next();
  //     cy.wait('@searchProducts');

  //     ActionBar.selectUnselectAllProducts('check')
  //       .getProductCount()
  //       .should('be.equal', 3);
  //     mockProducts.searchProducts(Results1);
  //     Pagination.prev();

  //     cy.wait('@searchProducts');

  //     new ProductCardHarness(page.get('productList').eq(0))
  //       .get('checkbox')
  //       .should('be.checked');

  //     new ProductCardHarness(page.get('productList').eq(1))
  //       .get('checkbox')
  //       .should('not.be.checked');
  //   });

  //   it('EN 215 : Clicking Add to collection option from action bar should take user to the Add to collection modal when there are multiple existing collections and user has edit rights to any one of collections. ', () => {
  //     InterceptProduct.searchProducts();
  //     page.open('test');

  //     mock.searchCollection([collection], { size: 20 });
  //     let productCard = new ProductCardHarness(page.get('productList').eq(0));
  //     productCard
  //       .check()
  //       .getProductId()
  //       .then((value: string) => {
  //         productsAdded.push(parseInt(value));
  //       });
  //     productCard = new ProductCardHarness(page.get('productList').eq(2));
  //     productCard
  //       .check()
  //       .getProductId()
  //       .then((value: string) => {
  //         productsAdded.push(parseInt(value));
  //       });
  //     ActionBar.addToCollection();
  //     cy.wait('@searchCollection');
  //     AddToCollection.dialog().should('exist');
  //     esc();
  //   });

  //   it('EN 215 : User should be redirected back to the correct page in search results where user selects products from single page other than page 1.', () => {
  //     mockProducts.searchProducts(Results1);
  //     page.open('table');

  //     new ProductCardHarness(page.get('productList').eq(0).should('be.visible'))
  //       .check()
  //       .getProductId()
  //       .then((value: string) => {
  //         productsAdded.push(parseInt(value));
  //         new ProductCardHarness(
  //           page.get('productList').eq(1).should('be.visible')
  //         )
  //           .check()
  //           .getProductId()
  //           .then((value: string) => {
  //             productsAdded.push(parseInt(value));
  //           });
  //         mockProducts.searchProducts(Results2);
  //         Pagination.next();
  //         cy.wait('@searchProducts');
  //         mock.searchCollection([collection], { size: 20 });

  //         ActionBar.getProductCount().should('be.equal', 2);

  //         new ProductCardHarness(
  //           page.get('productList').eq(1).should('be.visible')
  //         )
  //           .check()
  //           .getProductId()
  //           .then((value: string) => {
  //             productsAdded.push(parseInt(value));

  //             // EN 424 : Count of selected products should be updated correctly when user selects products individually across different pages.
  //             ActionBar.getProductCount().should('be.equal', 3);

  //             ActionBar.addToCollection();
  //             cy.wait('@searchCollection');
  //             mock.addProductsToCollection(collection);
  //             AddToCollection.selectCollection(0);
  //             cy.wait('@addProductsToCollection').then(
  //               ({ request: { body } }) => {
  //                 expect(body).to.have.lengthOf(3);
  //                 expect(productsAdded).to.includes(body[0].ProductId);
  //                 expect(productsAdded).to.includes(body[1].ProductId);
  //                 expect(productsAdded).to.includes(body[2].ProductId);
  //               }
  //             );
  //           });
  //       });
  //   });

  //   it('EN 215 : User should be redirected back to the search results when none of the products are added after user selects multiple products and add them to a collection from Add Collection Modal.', () => {
  //     productsAdded = [];
  //     mockProducts.searchProducts(Results1);
  //     page.open('laptop');

  //     new ProductCardHarness(page.get('productList').eq(0).should('be.visible'))
  //       .check()
  //       .getProductId()
  //       .then((value: string) => {
  //         productsAdded.push(parseInt(value));
  //         mockProducts.searchProducts(Results2);

  //         Pagination.next();
  //         cy.wait('@searchProducts');
  //         mock.addProductsToCollection(collection, 2);
  //         cy.url().should('contain', `${new ProductSearchPage().uri}`);
  //         Pagination.getCurrentPage().then((value) => {
  //           expect(parseInt(value.trim())).to.be.equal(2);
  //         });
  //       });
  //   });

  //   it('EN 259 : Add Products modal Modal should be displayed when existing collections exist.', () => {
  //     Intercept.searchCollection();
  //     InterceptProduct.searchProducts();
  //     page.open('cups');

  //     const productCard = new ProductCardHarness(page.get('productList').eq(0));
  //     productCard
  //       .check()
  //       .getProductId()
  //       .then((value: string) => {
  //         productsAdded.push(parseInt(value));
  //       });
  //     ActionBar.addToCollection();
  //     cy.wait('@searchCollection');
  //     AddToCollection.dialog().should('exist');
  //     esc();
  //   });

  //   it('EN 259 : Add Products modal should NOT be displayed when user with no existing collections selects a product(s) and tries to add to a collection.', () => {
  //     InterceptProduct.searchProducts();
  //     mock.searchCollection([], { size: 1 });
  //     page.open('cups');

  //     const productCard = new ProductCardHarness(page.get('productList').eq(0));

  //     productCard
  //       .check()
  //       .getProductId()
  //       .then((value: string) => {
  //         productsAdded.push(parseInt(value));
  //       });
  //     ActionBar.addToCollection();
  //     cy.wait('@searchCollection');
  //     AddToCollection.dialog().should('not.exist');
  //     esc();
  //   });

  //   it('EN 259 : Collections should have Default Sort: Recently Updated', () => {
  //     InterceptProduct.searchProducts();
  //     collection = generateCollection();
  //     let Results = [];
  //     Results.push(collection);
  //     Intercept.mockCollections({
  //       Aggregations: {},
  //       Results: Results,
  //       ResultsTotal: 1,
  //     });
  //     mock.testSetup({ collection: collection });
  //     page.open('cups');

  //     const productCard = new ProductCardHarness(page.get('productList').eq(0));
  //     productCard
  //       .check()
  //       .getProductId()
  //       .then((value: string) => {
  //         productsAdded.push(parseInt(value));
  //       });
  //     ActionBar.addToCollection();
  //     cy.wait('@mockCollections');
  //     AddToCollection.dialog().should('exist');
  //     esc();
  //   });
  //   it('EN 259 : Clicking show more should NOT display show less. ', () => {
  //     InterceptProduct.searchProducts();
  //     page.open('cups');

  //     const productCard = new ProductCardHarness(page.get('productList').eq(0));
  //     productCard
  //       .check()
  //       .getProductId()
  //       .then((value: string) => {
  //         productsAdded.push(parseInt(value));
  //       });
  //     ActionBar.addToCollection();
  //     AddToCollection.dialog().should('exist');
  //     page.get('showMore').click();
  //     page.get('showLess').should('not.exist');
  //     // esc();
  //   });
  //   it('EN 259 : Clicking show more will convert the modal height to the max height.', () => {
  //     AddToCollection.dialog().invoke('height').should('be.greaterThan', 610);
  //     esc();
  //   });
  // });

  // describe.skip('EN 2694 : Product Search: CPN Search', () => {
  //   it("EN 2694 : Users should be able to enter a CPN number in the Home page search. Users should execute a code product number search by entering the string 'CPN-xxxxxxxxx'", () => {
  //     page.get('productCpnSearch').clear().type('school bags').type('{enter}');
  //     page.get('selectProduct').eq(0).click();
  //     page
  //       .get('productCpnNum')
  //       .invoke('text')
  //       .then(($el) => {
  //         fixture.data.cpnNum = Number($el.split('-')[1]);
  //         page
  //           .get('productCpnSearch')
  //           .clear()
  //           .type(`cpn-${fixture.data.cpnNum.toString()}`)
  //           .type('{enter}');
  //         fixture.data.prodNum = fixture.data.cpnNum - fixture.data.companyId;
  //         cy.url().should('have.string', fixture.data.prodNum);
  //       });
  //   });

  //   it('EN 2694 : Users should be taken to the product detail page corresponding to the CPN number entered in the search results', () => {
  //     page.open('books');
  //     page
  //       .get('productCpnSearch')
  //       .clear()
  //       .type(`cpn-${fixture.data.cpnNum.toString()}`)
  //       .type('{enter}');
  //     fixture.data.prodNum = fixture.data.cpnNum - fixture.data.companyId;
  //     cy.url().should('have.string', fixture.data.prodNum);
  //   });

  //   it('EN 259 : User should be able to scroll through all collections at Add products modal', () => {
  //     cy.get('mat-dialog-content').scrollTo('bottom');
  //     esc();
  //   });

  //   it('EN 259 : Accessing Add Products Modal from Search results page all existing active collections should be displayed', () => {
  //     InterceptProduct.searchProducts();
  //     page.open('test');

  //     mock.searchCollection([collection], { size: 20 });
  //     const productCard = new ProductCardHarness(page.get('productList').eq(0));
  //     productCard.check();
  //     ActionBar.addToCollection();
  //     cy.wait('@searchCollection').then(
  //       ({
  //         response: {
  //           body: { Results: Results },
  //         },
  //       }) => {
  //         cy.log(Results[0].Id, collection.Id);
  //         assert(Results[0].Id, collection.Id.toString());
  //         AddToCollection.dialog().should('exist');
  //         esc();
  //       }
  //     );
  //   });

  //   it('EN 259 : User Should be able to search on the basis of collections name', () => {
  //     InterceptProduct.searchProducts();
  //     Intercept.searchCollection();
  //     page.open('test');

  //     mock.searchCollection([collection], { size: 20 });
  //     const productCard = new ProductCardHarness(page.get('productList').eq(0));
  //     productCard.check();
  //     ActionBar.addToCollection();
  //     page.get('searchText').type('col');
  //     cy.wait('@searchCollection').then(
  //       ({
  //         response: {
  //           body: { Results: Results },
  //         },
  //       }) => {
  //         expect(Results.length).to.gte(1);
  //       }
  //     );
  //     esc();
  //   });

  //   it('EN 259 : User Should be able to search on the basis of collections description', () => {
  //     InterceptProduct.searchProducts();
  //     Intercept.searchCollection();
  //     page.open('test');

  //     mock.searchCollection([collection], { size: 20 });
  //     const productCard = new ProductCardHarness(page.get('productList').eq(0));
  //     productCard.check();
  //     ActionBar.addToCollection();
  //     page.get('searchText').type('desc');
  //     cy.wait('@searchCollection').then(
  //       ({
  //         response: {
  //           body: { Results: Results },
  //         },
  //       }) => {
  //         expect(Results.length).to.gte(1);
  //       }
  //     );
  //     esc();
  //   });

  //   it('EN 259 : Removing characters and the collections list should be updated', () => {
  //     InterceptProduct.searchProducts();
  //     Intercept.searchCollection();
  //     page.open('test');

  //     mock.searchCollection([collection], { size: 20 });
  //     const productCard = new ProductCardHarness(page.get('productList').eq(0));
  //     productCard.check();
  //     ActionBar.addToCollection();
  //     page.get('searchText').type('collection').type('{backspace}');
  //     cy.wait('@searchCollection').then(
  //       ({
  //         response: {
  //           body: { Results: Results },
  //         },
  //       }) => {
  //         expect(Results.length).to.gte(1);
  //       }
  //     );
  //     esc();
  //   });

  //   it('EN 259 : Type more characters and the collections list should be updated', () => {
  //     InterceptProduct.searchProducts();
  //     Intercept.searchCollection();
  //     page.open('test');
  //     mock.searchCollection([collection], { size: 20 });
  //     const productCard = new ProductCardHarness(page.get('productList').eq(0));
  //     productCard.check();
  //     ActionBar.addToCollection();
  //     page.get('searchText').type('col');
  //     cy.wait('@searchCollection');
  //     page.get('searchText').type('lection');
  //     cy.wait('@searchCollection').then(
  //       ({
  //         response: {
  //           body: { Results: Results },
  //         },
  //       }) => {
  //         expect(Results.length).to.gte(1);
  //       }
  //     );
  //     esc();
  //   });
  // });

  // describe('EN 3370 : Exclude Filter Behavior and Applied Filter Pills for Exclude', () => {
  //   it('If the user typed in Blue Mug and clicked Apply Filter under Exclude, then the filter should be be displayed as Blue, Mug in the preview. The <space> delimiter should be automatically converted to comma after the apply button is clicked,', () => {
  //     page.get('productCpnSearch').clear().type('mugs').type('{enter}');
  //     page.get('excludeDropdown').click();
  //     page.get('filterMenuExclude').type(fixture.data.ExcludePills.join(' '));
  //     page.get('cosFilterApplyButton').click();
  //     Intercept.searchProduct();
  //     page.get('excludeDropdown').click();
  //     page
  //       .get('filterMenuExclude')
  //       .invoke('val')
  //       .then((text: string) => {
  //         expect(text).equal(fixture.data.ExcludePills.join(', '));
  //       });
  //     page.get('cosFilterApplyButton').click();
  //     cy.wait('@searchProduct').then(
  //       ({
  //         request: {
  //           body: { ExcludeTerms },
  //         },
  //       }) => {
  //         expect(ExcludeTerms).equal(fixture.data.ExcludePills.join(', '));
  //         page.get('pills').each(($el, i) => {
  //           expect($el.text()).to.contain(fixture.data.ExcludePills[i]);
  //         });
  //       }
  //     );
  //     page.get('excludeDropdown').click();
  //     page.get('costFilterResetButton').click();
  //   });
  // });

  // describe('EN 2986: Product Search: Applied Filter Pill UI ', () => {
  //   context(
  //     'Pill values should be visible when the user applies the corresponding filter to their search',
  //     () => {
  //       it('Top Level Filters-AllCategories with subcategories', () => {
  //         let selectedVal;
  //         page.get('productCpnSearch').clear().type('mugs').type('{enter}');
  //         page.get('cosFilterMenu').eq(0).click();
  //         page
  //           .get('filterMenuCategory')
  //           .find("option:contains('Clothing')")
  //           .then(($el) => {
  //             $el.get(0).setAttribute('selected', 'selected');
  //             selectedVal = $el.text();
  //           })
  //           .parent()
  //           .trigger('change');
  //         page.get('filterMenuCategorySearchTerm').type('clothing');
  //         page.get('matPseudoCheckbox').eq(0).click({ force: true });
  //         page.get('cosFilterApplyButton').click();
  //         page
  //           .get('cosFilterMenu')
  //           .eq(0)
  //           .invoke('text')
  //           .then((text: string) => {
  //             page.get('pills').each(($el, i) => {
  //               if ($el.text().split(':')[1].trim() === 'Clothing') {
  //                 expect($el.text()).to.contain(selectedVal);
  //               }
  //               if ($el.text().split(':')[1].trim() === 'Clothing-Underwear') {
  //                 expect($el.text().trim()).to.contain(text.trim());
  //               }
  //             });
  //           });
  //         page.get('cosFilterMenu').eq(0).click();
  //         page.get('costFilterResetButton').click();
  //       });
  //       it('Top Level Filters-AllCategories with out subcategories', () => {
  //         page.get('productCpnSearch').clear().type('mugs').type('{enter}');
  //         page.get('cosFilterMenu').eq(0).click();
  //         page
  //           .get('filterMenuCategory')
  //           .find("option:contains('Bicycle Accessories')")
  //           .then(($el) => {
  //             $el.get(0).setAttribute('selected', 'selected');
  //           })
  //           .parent()
  //           .trigger('change');
  //         page.get('cosFilterApplyButton').click();
  //         page
  //           .get('cosFilterMenu')
  //           .eq(0)
  //           .invoke('text')
  //           .then((text: string) => {
  //             page.get('pills').each(($el, i) => {
  //               expect($el.text()).to.contain(text);
  //             });
  //           });
  //         page.get('cosFilterMenu').eq(0).click();
  //         page.get('costFilterResetButton').click();
  //       });
  //       it('Top Level Filters-Supplier', () => {
  //         page.get('productCpnSearch').clear().type('mugs').type('{enter}');
  //         page.get('cosFilterMenu').eq(1).click();
  //         page.get('filterMenuSupplierSearchTerm').type('alex');
  //         page.get('matPseudoCheckbox').eq(0).click({ force: true });
  //         page.get('cosFilterApplyButton').click();
  //         page
  //           .get('cosFilterMenu')
  //           .eq(1)
  //           .invoke('text')
  //           .then((text: string) => {
  //             page.get('pills').each(($el, i) => {
  //               expect($el.text()).to.contain(text);
  //             });
  //           });
  //         page.get('cosFilterMenu').eq(1).click();
  //         page.get('costFilterResetButton').click();
  //       });
  //       it('Top Level Filters-Quantity', () => {
  //         page.get('productCpnSearch').clear().type('mugs').type('{enter}');
  //         page.get('cosFilterMenu').eq(2).click();
  //         page.get('filterMenuQuantity').type('5');
  //         page.get('cosFilterApplyButton').click();
  //         page
  //           .get('cosFilterMenu')
  //           .eq(2)
  //           .invoke('text')
  //           .then((text: string) => {
  //             page.get('pills').each(($el, i) => {
  //               expect($el.text().trim()).to.eq(text.trim());
  //             });
  //           });
  //         page.get('cosFilterMenu').eq(2).click();
  //         page.get('costFilterResetButton').click();
  //       });
  //       it('Top Level Filters-Price Per Unit Range', () => {
  //         page.get('productCpnSearch').clear().type('mugs').type('{enter}');
  //         page.get('cosFilterMenu').eq(3).click();
  //         page.get('filterMenuPriceFrom').type('100');
  //         page.get('filterMenuPriceTo').type('1000');
  //         page.get('cosFilterApplyButton').click();
  //         page
  //           .get('cosFilterMenu')
  //           .eq(3)
  //           .invoke('text')
  //           .then((text: string) => {
  //             page.get('pills').each(($el, i) => {
  //               expect($el.text().split(':')[1].trim()).to.eq(text.trim());
  //             });
  //           });
  //         page.get('cosFilterMenu').eq(3).click();
  //         page.get('costFilterResetButton').click();
  //       });
  //       it('Top Level Filters-All Rating', () => {
  //         page.get('productCpnSearch').clear().type('mugs').type('{enter}');
  //         page.get('cosFilterMenu').eq(4).click();
  //         page
  //           .get('filterMenuRating')
  //           .find("option:contains('3 stars & up')")
  //           .then(($el) => {
  //             $el.get(0).setAttribute('selected', 'selected');
  //           })
  //           .parent()
  //           .trigger('change');
  //         page.get('cosFilterApplyButton').click();
  //         page
  //           .get('cosFilterMenu')
  //           .eq(4)
  //           .invoke('text')
  //           .then((text: string) => {
  //             page.get('pills').each(($el, i) => {
  //               expect($el.text().split(':')[1].trim()).to.eq(text.trim());
  //             });
  //           });
  //         page.get('cosFilterMenu').eq(4).click();
  //         page.get('costFilterResetButton').click();
  //       });
  //       it('Top Level Filters-Color', () => {
  //         page.get('productCpnSearch').clear().type('mugs').type('{enter}');
  //         page.get('cosFilterMenu').eq(5).click();
  //         page.get('filterMenuColorSearchTerm').type('yellow');
  //         page.get('matPseudoCheckbox').eq(0).click({ force: true });
  //         page.get('cosFilterApplyButton').click();
  //         page
  //           .get('cosFilterMenu')
  //           .eq(5)
  //           .invoke('text')
  //           .then((text: string) => {
  //             page.get('pills').each(($el, i) => {
  //               expect($el.text()).to.contain(text);
  //             });
  //           });
  //         page.get('cosFilterMenu').eq(5).click();
  //         page.get('costFilterResetButton').click();
  //       });
  //       it('Top Level Filters-input-Material', () => {
  //         page.get('productCpnSearch').clear().type('mugs').type('{enter}');
  //         page.get('cosFilterMenu').eq(5).click();
  //         page.get('showMoreLessButton').type('{enter}');
  //         Intercept.searchProduct();
  //         page
  //           .get('cosFormFieldTypeCosInput')
  //           .eq(0)
  //           .type('Metal')
  //           .type('{home}')
  //           .type('{downarrow}')
  //           .type('{enter}');
  //         page.get('cosMegaMenuApplyButton').click();
  //         cy.wait('@searchProduct');
  //       });
  //       it('Top Level Filters-input-Include Rush Time', () => {
  //         page.get('productCpnSearch').clear().type('mugs').type('{enter}');
  //         page.get('cosFilterMenu').eq(5).click();
  //         page.get('showMoreLessButton').type('{enter}');
  //         Intercept.searchProduct();
  //         page
  //           .get('cosFormFieldTypeCosInput')
  //           .eq(7)
  //           .type('4 days')
  //           .type('{home}')
  //           .type('{downarrow}')
  //           .type('{enter}');
  //         page.get('Checkbox').eq(0).click();
  //         page.get('cosMegaMenuApplyButton').click();
  //         cy.wait('@searchProduct');
  //         page.get('clearPill').eq(0).click();
  //       });
  //       it('Top Level Filters-Checkbox-New Products', () => {
  //         page.get('productCpnSearch').clear().type('mugs').type('{enter}');
  //         page.get('cosFilterMenu').eq(5).click();
  //         page.get('showMoreLessButton').type('{enter}');
  //         Intercept.searchProduct();
  //         page.get('Checkbox').eq(1).click();
  //         page.get('cosMegaMenuApplyButton').click();
  //         cy.wait('@searchProduct').then(
  //           ({
  //             request: {
  //               body: {
  //                 Filters: { IsNew },
  //               },
  //             },
  //           }) => {
  //             expect(IsNew.toString()).equal('true');
  //             page.get('pills').each(($el, i) => {
  //               expect($el.text()).to.contain('New Products');
  //             });
  //           }
  //         );
  //       });
  //     }
  //   );
});
