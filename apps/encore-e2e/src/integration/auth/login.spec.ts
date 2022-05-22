import { GlobalHeader } from '../../shared';
import { CollectionSearchPage } from '../collections/pages';
import { login } from './fixtures';
import { LoginPage } from './pages/login.page';

const loginPage = new LoginPage();
const homePage = '/home';
const collectionSearchPage = new CollectionSearchPage();
const fixture = login(Cypress.env('environment'));

describe('Login description.', () => {
  it('User should be redirected to auth page if not authenticated and once authenticated should be redirected to the url entered.', () => {
    const url = collectionSearchPage.uri;
    collectionSearchPage.open();
    cy.url().should('include', 'redirectUrl=');
    loginPage.get('username').type(fixture.username);
    loginPage.get('password').type(fixture.password);
    loginPage.get('loginButton').click().url().should('contain', url);
  });

  it('The user should be on login page without entering username and password by clicking on the login button', () => {
    loginPage.open();
    loginPage
      .get('loginButton')
      .click()
      .then(() => {
        cy.url().should('contain', `${new LoginPage().uri}`);
      });
  });

  it('The user should be landed to home page once logged in.', () => {
    loginPage.open();
    loginPage.get('username').clear().type(fixture.username);
    loginPage.get('password').type(fixture.password);
    loginPage.get('loginButton').should('not.be.disabled');
    loginPage
      .get('loginButton')
      .click()
      .then(() => {
        cy.url().should('include', `${homePage}`);
      });
  });

  it('Verify that the user is able to login by User email.', () => {
    loginPage.open();
    loginPage.get('username').clear().type(fixture.email);
    loginPage.get('password').type(fixture.password);
    loginPage
      .get('loginButton')
      .click()
      .then(() => {
        cy.url().should('include', `${homePage}`);
      });
  });

  it('once logged in, user can go back to the login page by pressing the back button on browser.', () => {
    loginPage.open();
    loginPage.get('username').type(fixture.username);
    loginPage.get('password').type(fixture.password);
    loginPage.get('loginButton').click();
    cy.url()
      .should('include', `${homePage}`)
      .go('back')
      .url()
      .should('include', `${loginPage.uri}`);
  });

  it('once logged out, user  cannot go back to the system by pressing the back button on browser.', () => {
    loginPage.open();
    loginPage.get('username').type(fixture.username);
    loginPage.get('password').type(fixture.password);
    loginPage.get('loginButton').click().url().should('include', `${homePage}`);
    GlobalHeader.clickElement('account').clickElement('logout');
    cy.go('back')
      .url()
      .should('include', `${loginPage.uri}`)
      .and('include', 'redirectUrl=');
  });
});
