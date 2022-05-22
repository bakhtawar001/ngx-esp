import { Intercept } from '../../integration/collections/utils';
import { Dialog } from './dialog';
const PAGE_OBJECTS = {} as const;

export class ManageCollaboratorsDialog extends Dialog<typeof PAGE_OBJECTS> {
  static component = 'asi-manage-collaborators-dialog';
  static SELECTORS = {
    owner: '[ng-reflect-value="Owner"]',
    everyOne: 'ng-reflect-value="Everyone"',
    custom: '[ng-reflect-value="Custom"]',
  };

  static get dialog() {
    return cy.get(this.component);
  }
  static onlyOwner() {
    this.dialog.find(this.SELECTORS.owner).find('input').check({ force: true });
    return this;
  }
  static everyOneWithinCompany() {
    this.dialog
      .find(this.SELECTORS.everyOne)
      .find('input')
      .check({ force: true });
    return this;
  }

  static custom(
    input: Array<{ name: string; role: 'view' | 'Edit' | 'Remove' }>
  ) {
    Intercept.usersandteams();
    this.dialog
      .find('[ng-reflect-value="Custom"]')
      .find('input')
      .check({ force: true })
      .then(() => {
        cy.wait('@usersandteams');
        if (input) {
          input.forEach((individual) => {
            this.dialog
              .find('asi-user-team-autocomplete')
              .find('input')
              .should('be.visible')
              .clear()
              .click({ force: true })
              .then(() => {
                cy.get('mat-option')
                  .find('h4')
                  .contains(individual.name)
                  .parents('mat-option')
                  .click();
              });
          });
        }
      });
    return this;
  }
  static save() {
    this.dialog.find('button[type="submit"]').invoke('click');
    return this;
  }
}
