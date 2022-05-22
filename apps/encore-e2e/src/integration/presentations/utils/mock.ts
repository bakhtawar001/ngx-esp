import { Presentation, Project } from '@esp/models';

export class mockPresentations {
  static initial(project: Project, presentation: Presentation) {
    cy.intercept(
      {
        method: 'GET',
        url: `/babou/api/vulcan/projects/${project.Id}`,
      },
      {
        body: { ...project },
      }
    ).as('getProjects');

    cy.intercept(
      {
        method: 'GET',
        url: `/babou/api/venus/presentations/${presentation.Id}`,
      },
      {
        body: { ...presentation },
      }
    ).as('getPresentations');

    cy.intercept(
      {
        url: `/babou/api/venus/presentations/${presentation.Id}`,
        method: 'PUT',
      },
      {
        body: { ...presentation },
      }
    ).as('updatePresenation');
  }
}
