import { standardSetup } from '../../utils';
import { projectDetail } from './fixtures';
import { ProjectsApi } from './utils';
let projectsApi: ProjectsApi;
const fixture = projectDetail(Cypress.env('environment'));
standardSetup(fixture);
describe('API E2E Test cases.', () => {
  before(() => {
    projectsApi = new ProjectsApi();
  });

  context('Projects search engine testing', () => {
    it('Verify user is able to search cutomer from cutomer model window using primary Email Address', () => {
      // Act
      projectsApi
        .searchProjects(1, 10, 'bakhtawarmallick@hotmail.com', 'Active')
        .then((response) => {
          expect(response.status).equals(200);
          //Assert
          expect(response.body.Results[0].PrimaryEmail).equals(
            'bakhtawarmallick@hotmail.com'
          );
        });
    });
    it('Verify user is able to search cutomer from cutomer model window using Customer Name', () => {
      // Act
      projectsApi.searchProjects(1, 10, 'macpak', 'Active').then((response) => {
        expect(response.status).equals(200);
        var count = Object.keys(response.body.Results).length;
        for (let i = 0; i < count; i++) {
          //Assert
          expect(response.body.Results[i].Name.toLowerCase()).to.include(
            'macpak'.toLowerCase()
          );
        }
      });
    });
    it('Verify user is able to search cutomer from cutomer model window using Phone Number', () => {
      // Act
      projectsApi
        .searchProjects(1, 10, '03476665554', 'Active')
        .then((response) => {
          expect(response.status).equals(200);
          var count = Object.keys(response.body.Results).length;
          //Assert
          for (let i = 0; i < count; i++) {
            expect(response.body.Results[i].PrimaryPhone).to.include(
              '03476665554'
            );
          }
        });
    });
    it('Verify user is able to search cutomer from cutomer model window using Line1 address', () => {
      // Act
      projectsApi
        .searchProjects(1, 10, 'Pennsylvania Avenue NW', 'Active')
        .then((response) => {
          expect(response.status).equals(200);
          var count = Object.keys(response.body.Results).length;
          //Assert
          for (let i = 0; i < count; i++) {
            expect(response.body.Results[i].PrimaryAddress.Line1).to.include(
              'Pennsylvania Avenue NW'
            );
          }
        });
    });
    it('Verify user is able to search cutomer from cutomer model window using City', () => {
      // Act
      projectsApi
        .searchProjects(1, 10, 'Washington', 'Active')
        .then((response) => {
          expect(response.status).equals(200);
          var count = Object.keys(response.body.Results).length;
          //Assert
          for (let i = 0; i < count; i++) {
            expect(response.body.Results[i].PrimaryAddress.City).to.include(
              'Washington'
            );
          }
        });
    });
    it('Verify user is able to search cutomer from cutomer model window using Postal Code', () => {
      // Act
      projectsApi.searchProjects(1, 10, '19147', 'Active').then((response) => {
        expect(response.status).equals(200);
        var count = Object.keys(response.body.Results).length;
        //Assert
        for (let i = 0; i < count; i++) {
          expect(response.body.Results[i].PrimaryAddress.PostalCode).to.include(
            '19147'
          );
        }
      });
    });
    it('Verify user is able to search cutomer from cutomer model window using Country', () => {
      // Act
      projectsApi
        .searchProjects(1, 10, 'United States', 'Active')
        .then((response) => {
          expect(response.status).equals(200);
          var count = Object.keys(response.body.Results).length;
          //Assert
          for (let i = 0; i < count; i++) {
            expect(response.body.Results[i].PrimaryAddress.Country).to.include(
              'United States'
            );
          }
        });
    });
    it('Verify user is able to search cutomer from cutomer model window using State', () => {
      // Act
      projectsApi.searchProjects(1, 10, 'DC', 'Active').then((response) => {
        expect(response.status).equals(200);
        var count = Object.keys(response.body.Results).length;
        //Assert
        for (let i = 0; i < count; i++) {
          expect(response.body.Results[i].PrimaryAddress.State).to.include(
            'DC'
          );
        }
      });
    });
    it('Verify user is able to search cutomer from cutomer model window using Primary Website', () => {
      // Act
      projectsApi
        .searchProjects(1, 10, 'www.sysltd.com', 'Active')
        .then((response) => {
          expect(response.status).equals(200);
          var count = Object.keys(response.body.Results).length;
          //Assert
          for (let i = 0; i < count; i++) {
            expect(response.body.Results[i].PrimaryWebsite).to.include(
              'www.sysltd.com'
            );
          }
        });
    });
  });
});
