import { RouteHandler } from 'cypress/types/net-stubbing';

/**
 * How to use:
 *
    ```ts
    export class MockEntityCRUD extends MockCRUD {

      constructor() {
        super(/api/goes/here, 'Collection');
      }
    }
    ```
 *
 */
export class MockCRUD {
  constructor(private endpointUrl: string, private alias: string) {}

  /**
   *
   * @param options
   *
   * it mocks the defined action and creates aliases based on the given alias:
   * If the given alias is 'Collection', it will:
   * * GET -> getCollectionById_mock
   * * UPDATE -> updateCollection_mock
   * * CREATE -> createCollection_mock
   * * DELETE -> deleteCollection_mock
   */
  static action<T extends MockCRUD>(
    this: new (
      action: 'GET' | 'UPDATE' | 'CREATE' | 'DELETE',
      entityId?: number,
      stub?: RouteHandler
    ) => T,
    action: 'GET' | 'UPDATE' | 'CREATE' | 'DELETE',
    options: {
      entityId?: number;
      stub?: RouteHandler;
    }
  ) {
    const self = new this(action, options.entityId, options.stub);

    switch (action) {
      case 'GET':
        cy.intercept(
          'GET',
          `${self.endpointUrl}/${options.entityId}`,
          options.stub
        ).as(`get${self.alias}ById_mock`);
        break;

      case 'UPDATE':
        cy.intercept(
          'PUT',
          `${self.endpointUrl}/${options.entityId}`,
          options.stub
        ).as(`update${self.alias}_mock`);
        break;

      case 'CREATE':
        cy.intercept('POST', `${self.endpointUrl}`, options.stub).as(
          `create${self.alias}_mock`
        );
        break;

      case 'DELETE':
        cy.intercept(
          'DELETE',
          `${self.endpointUrl}/${options.entityId}`,
          options.stub
        ).as(`delete${self.alias}_mock`);
        break;
    }
  }
}
