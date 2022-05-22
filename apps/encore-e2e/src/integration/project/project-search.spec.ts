import { Project } from '@esp/models';
import { esc, randomStringGenerator, standardSetup } from '../../utils';
import { generateProject } from './factories';
import { projectDetail } from './fixtures';
import { ProjectPage } from './pages/project.page';
import { Intercept, mock } from './utils';
const fixture = projectDetail(Cypress.env('environment'));
const page = new ProjectPage();
var projectName: any;
standardSetup(fixture);
function testSetup(options?: { recentProjects?: Project[] }) {
  const project = generateProject();
  mock.testSetup({ project });
  mock.recentSearch(options?.recentProjects);
  page.open(project.Id);
  cy.wait('@getProjectById_mock');
  cy.wait('@searchRecent');
}

describe('Company And Project Creation', () => {
  it('Verify the message when project is not found from project menu search', () => {
    //Arrange
    testSetup();
    //Act
    page.click('projectsTab');
    page.searchProject(randomStringGenerator(5));
    //Assert
    page
      .get('noProjectFound')
      .should(
        'contains.text',
        'No projects found. Try changing the search term.'
      )
      .and('be.visible');
  });
  it('Access project landing page from projects tab', () => {
    //Arrange
    testSetup();
    //Act
    page.click('allProjects');
    //Assert
    page.get('projectLandingPage').should('contain.text', 'Projects');
  });
  it('Verify 5 records should be displayed once search is applied from project menu', () => {
    const searchTerm = 'MACPAK';
    //Act
    page.click('projectsTab');
    Intercept.searchProjectsFromProjectTab();
    page.searchProject(searchTerm);
    cy.wait('@searchProjectsFromProjectTab').then(({ request, response }) => {
      expect(response.statusCode).to.eq(200);
      cy.log(JSON.stringify(response.body, null, 4));
      var count = Object.keys(response.body.Results).length;
      console.log(count);
      //Assert
      expect(count).to.eq(5);
    });
  });
  it('Verify search term is retain when menu is closed', () => {
    //Arrange
    const searchTerm = 'MACPAK';
    //Act
    page.click('allProjects');
    page.click('projectsTab');
    page
      .get('searchProject')
      .invoke('val')
      .then((val) => {
        const inputValue = val;
        //Assert
        expect(inputValue).to.equal(searchTerm);
      });
  });
  it('Verify Customer Name,Project Name and Company favicon should be displayed in search result', () => {
    //Arrange
    const searchTerm = 'MACPAK';
    //Act
    cy.reload();
    page.click('projectsTab');
    Intercept.searchProjectsFromProjectTab();
    page.get('searchProject').type(searchTerm);
    cy.wait(0.5);
    cy.wait('@searchProjectsFromProjectTab').then(({ request, response }) => {
      expect(response.statusCode).to.eq(200);
      cy.log(JSON.stringify(response.body, null, 4));
      Cypress._.each(response.body.Results, (Result) => {
        //Assert
        expect(Result.Name).to.not.be.null;
        expect(Result.Customer.Name).to.include(searchTerm);
        page.get('projectFavicon').should('be.visible');
      });
    });
  });
  it('Verify user is able to search with Project name from project menu', () => {
    //Arrange
    const searchTerm = 'MACPAK123';
    //Act
    cy.reload();
    page.click('projectsTab');
    Intercept.searchProjectsFromProjectTab();
    page.get('searchProject').type(searchTerm);
    cy.wait(0.5);
    cy.wait('@searchProjectsFromProjectTab').then(({ request, response }) => {
      expect(response.statusCode).to.eq(200);
      cy.log(JSON.stringify(response.body, null, 4));
      projectName = response.body.Results[1].Name;
      cy.log(projectName);
      cy.log('projectName', response.body.Results[1].Name);
      Intercept.searchProjectsFromProjectTab();
      page.get('searchProject').clear().type(projectName);
      cy.wait('@searchProjectsFromProjectTab').then(({ request, response }) => {
        Cypress._.each(response.body.Results, (Result) => {
          //Assert
          expect(Result.Name).to.include(projectName);
        });
      });
    });
  });
  it('Verify that Recent Project label should not be visible once user provide search term', () => {
    //Act
    page.get('searchProject').clear().type('macpak');
    //Assert
    page.get('recentProject').should('not.exist');
    page.get('clearIcon').should('be.visible');
  });
  it('Verify Active companies are being displayed on select customer model window by click on create presentation', () => {
    //Arrange
    const searchTerm = 'MACPAK';
    //Act
    page.click('allProjects');
    Intercept.searchRecentCompany();
    page.click('createProject');
    Intercept.searchCompany();
    page.search(searchTerm);
    cy.wait('@searchRecentCompany');
    cy.wait('@searchCompany').then(({ request, response }) => {
      expect(response.statusCode).to.eq(200);
      cy.log(JSON.stringify(response.body, null, 4));
      var count = Object.keys(response.body.Results).length;
      console.log(count);
      Cypress._.each(response.body.Results, (Result) => {
        //Assert
        expect(Result.IsActive).to.be.true;
      });
    });
    esc();
  });
  it('Verify company type is Customer only select customer model window by click on create presentation', () => {
    //Arrange
    const searchTerm = 'MACPAK';
    //Act
    Intercept.searchRecentCompany();
    page.click('createProject');
    Intercept.searchCompany();
    page.search(searchTerm);
    cy.wait('@searchRecentCompany').then;
    cy.wait('@searchCompany').then(({ request, response }) => {
      expect(response.statusCode).to.eq(200);
      cy.log(JSON.stringify(response.body, null, 4));
      var count = Object.keys(response.body.Results).length;
      console.log(count);
      for (let i = 0; i < count; i++) {
        //Assert
        expect(response.body.Results[i].Types[0]).to.equal('Customer');
      }
    });
  });
  it('Verify that user is able to view the customer', () => {
    //Act
    page.click('viewCustomer');
    //Assert
    page
      .get('presentationTitle')
      .should('contain.text', 'Create a New Presentation');
    esc();
  });
  it('Verify that company should be searchable with Email address', () => {
    //Arrange
    const email = 'bakhtawarmallick@hotmail.com';
    //Act
    Intercept.searchRecentCompany();
    page.click('createProject');
    Intercept.searchCompany();
    page.search(email);
    cy.wait('@searchRecentCompany').then;
    cy.wait('@searchCompany').then(({ request, response }) => {
      expect(response.statusCode).to.eq(200);
      cy.log(JSON.stringify(response.body, null, 4));
      //Assert
      expect(response.body.Results[0].Emails[0]).to.equal(
        'bakhtawarmallick@hotmail.com'
      );
    });
  });
});
