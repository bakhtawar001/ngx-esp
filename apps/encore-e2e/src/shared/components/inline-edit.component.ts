export class InlineEditComponent {
  editControlType = 'text';

  constructor(public parent: string) {
    this._element({ timeout: 1000 })
      .invoke('attr', 'inputType')
      .then(($type) => {
        this.editControlType = $type || 'text';
      });
  }

  cancel() {
    this._element().find('button.cancel').click();
    return this;
  }

  edit() {
    this._element().find('button.cos-edit').click({ force: true });
    return this;
  }

  save() {
    this._element().find('button.save').click();
    return this;
  }

  type(value: string) {
    const controlSelector =
      this.editControlType === 'text' ? '[cos-input]' : 'textarea';
    this._element().find(controlSelector).clear().type(value);
    return this;
  }

  private _element(options?: Partial<Cypress.Timeoutable>) {
    return cy.get(this.parent, options).find('cos-inline-edit');
  }
}
