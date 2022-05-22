export class BaseE2EApi<T> {
  auth: any;

  constructor(protected url: string) {
    this.auth = JSON.parse(window.localStorage.getItem('auth'));
  }

  protected get headers() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.auth?.session.access_token}`,
      origin: Cypress.config().baseUrl,
    };
  }

  getById(
    id: number,
    options: {
      headers?: Record<string, any>;
      requestOptions?: Partial<Cypress.RequestOptions>;
      url: string;
    } = {
      url: `${this.url}/${id}`,
    }
  ): Cypress.Chainable<T> {
    return cy
      .request({
        method: 'GET',
        url: options.url,
        headers: {
          ...this.headers,
          ...options?.headers,
        },
        ...options?.requestOptions,
      })
      .its('body');
  }

  getSearch(
    options: {
      headers?: Record<string, any>;
      requestOptions?: Partial<Cypress.RequestOptions>;
      url: string;
    } = {
      url: `${this.url}`,
    }
  ): Cypress.Chainable<T> {
    return cy
      .request({
        method: 'GET',
        url: options.url,
        headers: {
          ...this.headers,
          ...options?.headers,
        },
      })
      .its('body');
  }
  get(
    options: {
      headers?: Record<string, any>;
      requestOptions?: Partial<Cypress.RequestOptions>;
      url: string;
    } = {
      url: `${this.url}`,
    }
  ): Cypress.Chainable<T> {
    return this.getById(null, options);
  }

  post(
    body: Partial<T>,
    options: {
      headers?: Record<string, any>;
      url: string;
    } = {
      url: this.url,
    }
  ): Cypress.Chainable<T> {
    return cy
      .request({
        method: 'POST',
        url: options.url,
        headers: {
          ...this.headers,
          ...options?.headers,
        },
        body: body,
      })
      .its('body');
  }

  delete(
    id: number,
    options: { headers?: Record<string, any>; url: string } = {
      url: `${this.url}/${id}`,
    }
  ): Cypress.Chainable<T> {
    return cy
      .request({
        method: 'DELETE',
        url: options.url,
        headers: {
          ...this.headers,
          ...options?.headers,
        },
      })
      .its('body');
  }

  update(
    id: number,
    body: Partial<T>,
    options: { headers?: Record<string, any>; url: string } = {
      url: `${this.url}/${id}`,
    }
  ) {
    return cy
      .request({
        method: 'PUT',
        url: options.url,
        headers: {
          ...this.headers,
          ...options?.headers,
        },
        body,
      })
      .its('body');
  }
}
