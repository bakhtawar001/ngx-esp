import { Company, Contact, Presentation, Project } from '@esp/models';
import { SearchCriteria } from '@esp/projects';
import { MockCRUD } from '@cosmos/cypress';
import { URLs } from './urls';
export class MockProjectCRUD extends MockCRUD {
  constructor() {
    super(URLs.api.projects, 'Project');
  }
}


export class mock {
  static testSetup = (input?: {
    project?: Project;
   
  }) => {
    if (input?.project) {
      input.project.Id ||= 1000;

      MockProjectCRUD.action('GET', {
        entityId: input.project.Id,
        stub: {
          body: {
            ...input.project,
          },
        },
      });

      MockProjectCRUD.action('CREATE', {
        stub: {
          body: {
            ...input.project,
          },
        },
      });

      MockProjectCRUD.action('UPDATE', {
        entityId: input.project.Id,
        stub: {
          body: {
            ...input.project,
          },
        },
      });

      MockProjectCRUD.action('DELETE', {
        entityId: input.project.Id,
        stub: {
          statusCode: 200,
        },
      });
    }
  };
  static testSetupCreateProject(
    project: Project,
    presentation: Presentation,
    company: Company,
    contact: Contact
  ) {
    cy.intercept(
      {
        method: 'POST',
        url: `babou/api/esp/companies?*`,
      },
      {
        body: { ...company },
      }
    ).as('createCustomer');

    cy.intercept(
      {
        method: 'POST',
        url: `/babou/api/esp/contacts`,
      },
      {
        body: { ...contact },
      }
    ).as('addContact');
    cy.intercept(
      {
        method: 'PUT',
        url: `/babou/api/esp/companies/*`,
      },
      {
        body: { ...company },
      }
    ).as('updateCompany');

    cy.intercept(
      {
        method: 'POST',
        url: `/babou/api/vulcan/projects`,
      },
      {
        body: { ...project },
      }
    ).as('createProject');
    cy.intercept(
      {
        method: 'POST',
        url: `babou/api/venus/presentations`,
      },
      {
        body: { ...presentation },
      }
    ).as('createPresentation');
    cy.intercept(
      {
        method: 'GET',
        url: `	/babou/api/vulcan/projects/*`,
      },
      {
        body: { ...project },
      }
    ).as('getProject');
  }
  static searchProject(searchTerm: SearchCriteria) {
    cy.intercept(
      {
        method: 'POST',
        url: `/babou/api/vulcan/projects/search`,
      },
      {
        body: { ...searchTerm },
      }
    ).as('searchProjects');
  }
  static recentSearch(result: Array<Project> = []) {
    cy.intercept('POST', `/babou/api/vulcan/projects/searchrecent`, {
      Results: result,
      ResultsTotal: result?.length ?? 0,
    }).as('searchRecent');
  }
}
