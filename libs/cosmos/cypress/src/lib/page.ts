type PageElementSpec = Record<
  string,
  (options?: any) => Cypress.Chainable<unknown>
>;

export abstract class Page<T extends PageElementSpec> {
  abstract uri: string;

  constructor(private PAGE_OBJECTS?: T) {}

  get(element: keyof T, options?: any) {
    return this.PAGE_OBJECTS[element]();
  }
  click(element: keyof T, options?: any) {
    return this.PAGE_OBJECTS[element]().click();
  }
}
