import { MatAutocomplete } from '../mat-autocomplete';
import { Dialog } from './dialog';

const PAGE_OBJECTS = {
  input: () => TransferOwnershipDialog._element().find('input'),
  userList: () => MatAutocomplete.options().find('h4'),
  transferButton: () =>
    TransferOwnershipDialog._element().find('.transfer-ownership-btn'),
  UserNameInputBox: () => TransferOwnershipDialog._element().find('input'),
} as const;

export class TransferOwnershipDialog extends Dialog<typeof PAGE_OBJECTS> {
  constructor() {
    super(PAGE_OBJECTS);
  }

  static save() {
    const button = this._element().find('.transfer-ownership-btn');

    button.click({ force: true });

    return this;
  }

  static setOwner(value: string) {
    intercept();

    const input = this._element().find('input');

    input.clear().type(value);

    cy.wait('@users-autocomplete');

    MatAutocomplete.options().contains(value).click({ force: true });

    return this;
  }

  static _element() {
    return cy.get('asi-transfer-ownership-dialog');
  }
}

function intercept() {
  cy.intercept({
    method: 'GET',
    url: `/babou/api/esp/autocomplete/users?*`,
  }).as('users-autocomplete');
}
