import { Page } from '@cosmos/cypress';

const PAGE_OBJECTS = {
  projectsTab: () => cy.get(ProjectPage.SELECTORS.projectsTab),
  allProjects: () => cy.get(ProjectPage.SELECTORS.allProjects),
  createProject: () => cy.get(ProjectPage.SELECTORS.createProjects),
  projectHeader: () => cy.get(ProjectPage.SELECTORS.projectHeader),
  projectLandingPage: () => cy.get(ProjectPage.SELECTORS.projectLandingPage),
  createNewCompany: () => cy.get(ProjectPage.SELECTORS.createNewCompany),
  companyName: () => cy.get(ProjectPage.SELECTORS.companyName),
  primaryFirstName: () => cy.get(ProjectPage.SELECTORS.primaryFirstName),
  primaryLastName: () => cy.get(ProjectPage.SELECTORS.primaryLastName),
  phoneNumber: () => cy.get(ProjectPage.SELECTORS.phoneNumber),
  nextButton: () => cy.get(ProjectPage.SELECTORS.nextButton),
  companyHeader: () => cy.get(ProjectPage.SELECTORS.companyHeader),
  projectTitle: () => cy.get(ProjectPage.SELECTORS.projectTitle),
  eventType: () => cy.get(ProjectPage.SELECTORS.eventType),
  budget: () => cy.get(ProjectPage.SELECTORS.budget),
  attendees: () => cy.get(ProjectPage.SELECTORS.attendees),
  createCompanyButton: () => cy.get(ProjectPage.SELECTORS.createCompanyButton),
  projectDetailPage: () => cy.get(ProjectPage.SELECTORS.projectDetailPage),
  searchCompany: () => cy.get(ProjectPage.SELECTORS.searchCompany),
  companyCard: () => cy.get(ProjectPage.SELECTORS.companyCard),
  companyCardsCount: () => cy.get(ProjectPage.SELECTORS.companyCardsCount),
  backButton: () => cy.get(ProjectPage.SELECTORS.backButton),
  cancelButton: () => cy.get(ProjectPage.SELECTORS.cancelButton),
  duplicateCompany: () => cy.get(ProjectPage.SELECTORS.duplicateCompany),
  discardChnages: () => cy.get(ProjectPage.SELECTORS.discardChnages),
  confirmationMessage: () => cy.get(ProjectPage.SELECTORS.confirmationMessage),
  searchProject: () =>
    cy.get(ProjectPage.SELECTORS.searchPtojectFromProjectTab),
  viewCustomer: () => cy.get(ProjectPage.SELECTORS.viewCustomer),
  presentationTitle: () => cy.get(ProjectPage.SELECTORS.presentationTitle),
  projectFavicon: () => cy.get(ProjectPage.SELECTORS.projectFavicon),
  recentProject: () => cy.get(ProjectPage.SELECTORS.recentProject),
  clearIcon: () => cy.get(ProjectPage.SELECTORS.clearIcon),
  searchAllProjects: () => cy.get(ProjectPage.SELECTORS.searchAllProjects),
  noProjectFound: () => cy.get(ProjectPage.SELECTORS.noProjectFound),
} as const;

export class ProjectPage extends Page<typeof PAGE_OBJECTS> {
  uri = '/projects';

  constructor() {
    super(PAGE_OBJECTS);
  }

  static SELECTORS = {
    projectsTab:
      '.cos-global-nav-desktop > .cos-global-nav-menu > li:nth-of-type(4)',
    allProjects: '#all-projects-link',
    createProjects: 'span[data-cy=create-new-presentation]',
    projectLandingPage: 'h1',
    projectHeader: 'h2.mat-dialog-title.header-style-18',
    createNewCompany: '.cards-search-results__item.create-new-button',
    companyName: 'input[placeholder="Enter company name"]',
    primaryFirstName: 'input[placeholder="Enter first name"]',
    primaryLastName: 'input[placeholder="Enter last name"]',
    phoneNumber: 'input[formcontrolname="Number"]',
    nextButton: '[data-cy=next-button]',
    companyHeader: '#mat-dialog-title-1',
    projectTitle: 'input[formcontrolname="Name"]',
    eventType: 'input[placeholder="Select a type of event"]',
    createCompanyButton: '[data-cy=submit-button]',
    budget: 'input[formcontrolname="Budget"]',
    attendees:
      'cos-form-field:nth-of-type(4) .cdk-text-field-autofill-monitored',
    inHandsDate: ' cos-form-field:nth-of-type(1) button',
    eventDate: '.cos-form-field.ng-untouched button',
    searchCompany: 'input[placeholder="Search for a Customer"]',
    projectDetailPage: '.detail-header--entity-title',
    companyCard: '.cards-search-results > asi-details-card:nth-of-type(1)',
    companyCardsCount: '.cards-search-results',
    confirmationMessage: '.mat-dialog-content',
    backButton: '[data-cy=back-button]',
    cancelButton: '[data-cy= cancel-button]',
    duplicateCompany: 'mat-dialog-content.mat-dialog-content.ng-star-inserted',
    discardChnages: '[mat-dialog-close=""]',
    searchPtojectFromProjectTab: 'input[placeholder="Search Projects"]',
    viewCustomer:
      '.cards-search-results [ng-reflect-show-subtitle-tooltip="true"]:nth-child(2) .cursor-pointer',
    presentationTitle: '.header-style-18.mat-dialog-title',
    projectFavicon:
      'div[class*="global-menu-list-item__icon flex items-center justify-center"]',
    recentProject: '.header-style-12-shark',
    clearIcon: '.cos-icon-button.form-field-suffix',
    searchAllProjects: 'input[placeholder="Search All Projects"]',
    noProjectFound: 'p.body-style-14-shark',
  };
  openProject() {
    cy.navigateByUrl(`${this.uri}`);
    return this;
  }

  open(id: number) {
    cy.navigateByUrl(`${this.uri}/${id}`);
    return this;
  }

  search(input: string) {
    PAGE_OBJECTS.searchCompany().clear().type(input);
    return this;
  }
  searchProject(input: string) {
    PAGE_OBJECTS.searchProject()
      .clear()
      .type(input, { force: true })
      .type('{enter}');
    return this;
  }
  openContextMenu() {
    return cy.wrap(null).then(() => {
      return new Cypress.Promise((resolve) => {
        return this.isAttached(
          resolve,
          'button.mat-menu-trigger.actions-button',
          0
        );
      }).then((el) => {
        return cy.wrap(el).click({ force: true });
      });
    });
  }
  isAttached = (resolve, selector, count = 0) => {
    const el = Cypress.$(selector);
    // is element attached to the DOM?
    count = Cypress.dom.isAttached(el) ? count + 1 : 0;
    // hit our base case, return the element
    if (count >= 3) {
      return resolve(el);
    }
    // retry after a bit of a delay
    setTimeout(() => this.isAttached(resolve, selector, count), 500);
  };
}
