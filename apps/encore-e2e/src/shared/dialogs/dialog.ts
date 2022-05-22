type PageElementSpec = Record<
  string,
  (options?: any) => Cypress.Chainable<unknown>
>;

export abstract class Dialog<T extends PageElementSpec> {
  //abstract component: string;

  constructor(private PAGE_OBJECTS?: T) {}

  get(element: keyof T, options?: any) {
    return this.PAGE_OBJECTS[element]();
  }

  getVal(element: keyof T, options?: any) {
    return this.PAGE_OBJECTS[element]().invoke('val');
  }

  static close() {
    cy.get('button.cos-modal-close').click();
  }
}
