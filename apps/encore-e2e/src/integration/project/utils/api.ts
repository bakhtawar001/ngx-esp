import { BaseE2EApi } from '@cosmos/cypress';
import { Project } from '@esp/models';
import { URLs } from './urls';
export class ProjectsApi extends BaseE2EApi<Project> {
  constructor() {
    super(`${Cypress.env('apiProjUrl')}/projects`);
  }
  getSearchComapnyResults(
    page: number,
    size: number,
    term: string,
    status: 'Active'
  ) {
    return this.getSearch({
      url: `${Cypress.env('asiServiceUrl')}${URLs.api.projectSearch}`,
      requestOptions: {
        qs: {
          from: page,
          size: size,
          term: term,
          sortBy: '',
          status: status,
          filters: '',
        },
      },
    });
  }
  searchProjects(from: number, size: number, term: string, status: 'Active') {
    const token: any = window.localStorage.getItem('auth');
    let asiToken = JSON.parse(token).session.access_token;
    return cy.request({
      method: 'GET',
      url: `${Cypress.env('asiServiceUrl')}${URLs.api.projectSearch}`,
      qs: {
        term: term,
        filters: '',
        from: from,
        size: size,
        sortBy: '',
        status: 'Active',
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${asiToken}`,
        origin: Cypress.config().baseUrl,
      },
    });
  }
}
