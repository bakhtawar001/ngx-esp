import { HttpClientTestingModule } from '@angular/common/http/testing';
import { dataCySelector } from '@cosmos/testing';
import { Email } from '@esp/models';
import { createComponentFactory } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import {
  EmailListForm,
  EmailListFormModule,
  EmailType,
} from './email-list.form';

const selectors = {
  makeAsPrimaryCheckbox: dataCySelector('make-primary'),
  isPrimaryLabel: dataCySelector('is-primary'),
  addEmail: {
    button: dataCySelector('add-email-button'),
    icon: dataCySelector('add-email-button') + ' i',
  },
  row: dataCySelector('input-row'),
};

describe('EmailListForm', () => {
  const createComponent = createComponentFactory({
    component: EmailListForm,
    imports: [
      HttpClientTestingModule,
      NgxsModule.forRoot(),
      EmailListFormModule,
    ],
  });

  const testSetup = (options?: { emails?: Partial<Email>[] }) => {
    const spectator = createComponent();
    const component = spectator.component;

    if (options?.emails?.length) {
      options.emails.forEach((email) => component.addItem(email as any));
    }

    spectator.detectComponentChanges();

    return { component, spectator };
  };

  it('should create', () => {
    // Arrange
    const { component } = testSetup();

    // Assert
    expect(component).toBeTruthy();
  });

  it('should display remove icon and input fields button if more than one emails', () => {
    const { spectator } = testSetup({
      emails: [
        {
          IsPrimary: false,
          Type: EmailType.Work,
          Address: '',
        },
      ],
    });

    spectator.click(spectator.query(selectors.addEmail.button));

    const trashBtns = spectator.queryAll(
      'button.cos-button.cos-warn > i.fa.fa-trash'
    );
    const emails = spectator.queryAll('input[formControlName="Address"]');

    expect(emails).toHaveLength(2);
    expect(trashBtns).toHaveLength(2);
    expect(trashBtns[0].parentElement.parentElement).not.toHaveClass(
      'btn-hidden'
    );
    expect(trashBtns[1].parentElement.parentElement).not.toHaveClass(
      'btn-hidden'
    );
  });

  it('should have remove feilds and not display remove icon if have one field after clicking on remove Icon ', () => {
    const { component, spectator } = testSetup({
      emails: [
        {
          IsPrimary: false,
          Type: EmailType.Work,
          Address: '',
        },
      ],
    });

    spectator.click(spectator.query(selectors.addEmail.button));

    const trashBtns = spectator.queryAll(
      'button.cos-button.cos-warn > i.fa.fa-trash'
    );

    expect(trashBtns).toHaveLength(2);
    expect(component.form.controls).toHaveLength(2);

    spectator.click(trashBtns[0]);
    spectator.detectChanges();

    const modifiedTrashsBtns = spectator.queryAll(
      'button.cos-button.cos-warn > i.fa.fa-trash'
    );

    expect(component.form.controls).toHaveLength(1);
    expect(modifiedTrashsBtns).toHaveLength(1);
    expect(modifiedTrashsBtns[0].parentElement.parentElement).toHaveClass(
      'btn-hidden'
    );
  });

  it('should set default type as Work', () => {
    const { component } = testSetup({ emails: [{}] });

    expect(component.form.value[0].Type).toEqual(EmailType.Work);
  });

  it('should email field have maxlength 100', () => {
    const { spectator } = testSetup({
      emails: [
        {
          IsPrimary: false,
          Type: EmailType.Work,
          Address: '',
        },
      ],
    });

    const emails = spectator.queryAll('input[formControlName="Address"]');

    emails.forEach((e) => {
      expect(e).toHaveAttribute('maxlength', '100');
    });
  });

  it('should set email to blank on init', () => {
    const { component } = testSetup({ emails: [{}] });

    expect(component.form.controls[0].value.Address).toEqual('');
  });

  it('should set email type to work on init', () => {
    const { component } = testSetup({ emails: [{}] });

    expect(component.form.controls[0].value.Type).toEqual('Work');
  });

  describe('Primary checkbox', () => {
    it('should display "Make Primary" checkbox when is not primary', () => {
      const { spectator } = testSetup({ emails: [{ IsPrimary: false }] });

      expect(spectator.query(selectors.isPrimaryLabel)).toBeFalsy();
      expect(spectator.query(selectors.makeAsPrimaryCheckbox)).toBeTruthy();
      expect(
        spectator.query(selectors.makeAsPrimaryCheckbox).textContent.trim()
      ).toEqual('Make Primary');
    });

    it('should display "This is my primary email address" when is primary', () => {
      const { spectator } = testSetup({ emails: [{ IsPrimary: true }] });

      expect(spectator.query(selectors.makeAsPrimaryCheckbox)).toBeFalsy();
      expect(spectator.query(selectors.isPrimaryLabel)).toBeTruthy();
      expect(
        spectator.query(selectors.isPrimaryLabel).textContent.trim()
      ).toEqual('This is my primary email address');
    });
  });

  describe('Add email button', () => {
    it('should contain label', () => {
      const { spectator } = testSetup();

      expect(
        spectator.query(selectors.addEmail.button).textContent.trim()
      ).toEqual('Add Email');
    });

    it('should contain icon', () => {
      const { spectator } = testSetup();

      expect(spectator.query(selectors.addEmail.icon).classList).toContain(
        'fa-plus'
      );
    });

    it('should add a new row', () => {
      const { spectator } = testSetup({ emails: [{}] });

      expect(spectator.queryAll(selectors.row).length).toEqual(1);

      spectator.click(selectors.addEmail.button);
      spectator.detectComponentChanges();

      expect(spectator.queryAll(selectors.row).length).toEqual(2);
    });
  });
});
