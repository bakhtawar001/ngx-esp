export function standardSetup(fixture: { username: string; password: string }) {
  before('login', () => {
    cy.visit('/').then(() => {
      cy.login(fixture.username, fixture.password);
    });
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });
}
