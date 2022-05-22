import { Dialog } from './dialog';

const PAGE_OBJECTS = {
  cancel: () => ConfirmDialog.dialog.find('[mat-dialog-close]'),
  confirm: () => ConfirmDialog.dialog.find('button.cos-primary'),
} as const;

export class ConfirmDialog extends Dialog<typeof PAGE_OBJECTS> {
  static component = 'cos-confirm-dialog';

  constructor() {
    super(PAGE_OBJECTS);
  }

  static get dialog() {
    return cy.get(this.component);
  }

  static cancel() {
    PAGE_OBJECTS.cancel().click();
  }

  static confirm() {
    PAGE_OBJECTS.confirm().click();
  }
}
