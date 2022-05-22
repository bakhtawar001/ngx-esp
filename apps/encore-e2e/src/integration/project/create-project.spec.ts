import { Company, Contact, Presentation, Project } from '@esp/models';
import { esc, randomStringGenerator, standardSetup } from '../../utils';
import { generateCompany } from '../company/factories';
import { generateContact } from '../company/factories/contact';
import { generatePresentation } from '../presentations/factories';
import { generateProject } from './factories';
import { projectDetail } from './fixtures';
import { ProjectPage } from './pages/project.page';
import { Intercept, mock } from './utils';

const fixture = projectDetail(Cypress.env('environment'));
const page = new ProjectPage();
let searchTerm: string = 'MACPAK';
var duplicateCompany: any;
standardSetup(fixture);

const projectComponents = {
  companyName: `MACPAK ${randomStringGenerator(10)}`,
  primaryFirstName: `Aly ${randomStringGenerator(10)}`,
  primaryLastName: `Zee ${randomStringGenerator(10)}`,
  phoneNumber: '+923474357444',
  eventType: 'Awards',
  projectTitle: `CRMOrders ${randomStringGenerator(10)}`,
};
function testSetup(options?: {
  company: Company;
  presentation: Presentation;
  project: Project;
  contact: Contact;
}) {
  const project = generateProject({ Id: 2000 });
  const presentation = generatePresentation({ ProjectId: 5000 });
  const company = generateCompany({ Name: projectComponents.companyName });
  const contact = generateContact({
    GivenName: projectComponents.primaryFirstName,
    FamilyName: projectComponents.primaryLastName,
  });

  mock.testSetupCreateProject(project, presentation, company, contact);
  page.openProject();
  return { project, presentation, company, contact };
}
describe('Company And Project Creation', () => {
  it('Create project from projects tab', () => {
    //Act
    page.click('projectsTab');
    page.click('allProjects');
    page.click('createProject');
    //Assert
    page
      .get('projectHeader')
      .should('contain.text', 'Create a new Customer or Select a Customer');
  });
  it('Create company with required fields ', () => {
    //Arrange
    testSetup();
    //Action
    page.click('createNewCompany');
    cy.wait(0.5);
    page
      .get('companyName')
      .type(projectComponents.companyName, { force: true })
      .type('{enter}');
    page.get('primaryFirstName').type(projectComponents.primaryFirstName);
    page.get('primaryLastName').type(projectComponents.primaryLastName);
    page.get('phoneNumber').type(projectComponents.phoneNumber);
    page.click('nextButton');
    page.get('eventType').type(projectComponents.eventType).type('{enter}');
    page.get('projectTitle').type(projectComponents.projectTitle);
    page.get('budget').type('5');
    page.get('attendees').type('5');
    page.click('createCompanyButton');
    cy.wait('@createCustomer').then(({ request: { body } }) => {
      body;
    });
    cy.wait('@addContact').then(({ request: { body } }) => {
      body;
    });

    cy.wait('@createProject').then(({ request: { body } }) => {
      body;
    });
    cy.wait('@createPresentation').then(({ request: { body } }) => {
      body;
    });
    cy.wait('@getProject').then(({ request: { body } }) => {
      body;
    });
    //Assert
    page.get('projectDetailPage').should('exist');
  });

  it('Verify company is searchable from customer model window', () => {
    //Arrange
    testSetup();
    //Act
    Intercept.searchRecentCompany();
    page.click('createProject');
    Intercept.searchCompany();
    page.search(searchTerm);
    cy.wait('@searchRecentCompany').then;
    cy.wait('@searchCompany').then(({ request, response }) => {
      expect(response.statusCode).to.eq(200);
      cy.log(JSON.stringify(response.body, null, 4));
    });
    //Assert
    page.get('companyCard').should('contain.text', searchTerm);
    esc();
  });
  it('Verify the confirmation message while creating the duplicate company', () => {
    //Arrange
    testSetup();
    Intercept.searchRecentCompany();
    page.click('createProject');
    Intercept.searchCompany();
    page.search(searchTerm);
    cy.wait('@searchRecentCompany').then;
    cy.wait('@searchCompany').then(({ request, response }) => {
      expect(response.statusCode).to.eq(200);
      cy.log(JSON.stringify(response.body, null, 4));
      duplicateCompany = response.body.Results[1].Name;
      cy.log(duplicateCompany);
      cy.log('duplicateCompany', response.body.Results[1].Name);
      //Act
      page.click('createNewCompany');
      cy.wait(0.5);
      page.get('companyName').type(duplicateCompany);
      page.get('primaryFirstName').type(projectComponents.primaryFirstName);
      page.get('primaryLastName').type(projectComponents.primaryLastName);
      //Assert
      page.get('duplicateCompany').should('contain.text', duplicateCompany);
    });
    cy.reload();
  });
  it('Verify the company card count on create new presentation model window', () => {
    //Arrange
    testSetup();
    var itemCount: any;
    //Act
    page.click('createProject');
    //Assert
    page
      .get('companyCardsCount')
      .children()
      .then(($el) => {
        itemCount = Cypress.$($el).length;
        cy.log('count ' + itemCount);
        expect(itemCount).to.not.equal(13);
      });
  });
  it('Verify the confirmation message when changes are unsaved while creating the project', () => {
    //Arrange
    testSetup();
    //Act
    page.click('createNewCompany');
    page.get('primaryFirstName').type(projectComponents.primaryFirstName);
    page.get('primaryLastName').type(projectComponents.primaryLastName);
    page.get('phoneNumber').type(projectComponents.phoneNumber);
    page.click('backButton');
    //Assert
    page
      .get('projectHeader')
      .should('contain.text', 'Create a new Customer or Select a Customer');
  });
});
