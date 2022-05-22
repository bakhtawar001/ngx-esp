/**
 * How to use:
 *
  ```ts
  export class Intercept extends InterceptCRUD {

    constructor() {
      super(/api/goes/here, 'Collection');
    }
  }
 * ```
 */
export abstract class InterceptCRUD {
  constructor(private endpointUrl: string, private alias: string) {}

  /**
   *
   * @param action
   * @param entityId
   *
   * it intercepts the defined action and creates aliases based on the given alias:
   * If the given alias is 'Collection', it will:
   * * GET -> getCollectionById
   * * UPDATE -> updateCollection
   * * CREATE -> createCollection
   * * DELETE -> deleteCollection
   */
  static action<T extends InterceptCRUD>(
    this: new (
      action: 'GET' | 'UPDATE' | 'CREATE' | 'DELETE',
      entityId?: number
    ) => T,
    action: 'GET' | 'UPDATE' | 'CREATE' | 'DELETE',
    entityId?: number
  ): T {
    const self = new this(action, entityId);

    switch (action) {
      case 'GET':
        if (entityId) {
          cy.intercept('GET', `${self.endpointUrl}/${entityId}`).as(
            `get${self.alias}ById`
          );
        } else {
          cy.intercept('GET', `${self.endpointUrl}`).as(`get${self.alias}`);
        }
        break;

      case 'UPDATE':
        cy.intercept('PUT', `${self.endpointUrl}/${entityId}`).as(
          `update${self.alias}`
        );
        break;
      case 'CREATE':
        cy.intercept('POST', `${self.endpointUrl}`).as(`create${self.alias}`);
        break;
      case 'DELETE':
        cy.intercept('DELETE', `${self.endpointUrl}/${entityId}`).as(
          `delete${self.alias}`
        );
        break;
    }

    return self;
  }
}
