import { dataCySelector } from '@cosmos/testing';
import { Website } from '@esp/models';
import { createComponentFactory } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import {
  CompanyWebsiteListForm,
  CompanyWebsiteListFormModule,
} from './company-website-list.form';

const addWebsite = {
  button: dataCySelector('add-website-button'),
  icon: dataCySelector('add-website-button') + ' i',
};
const form = {
  url: {
    label: dataCySelector('website-url-label'),
    field: dataCySelector('website-url-field'),
  },
  isPrimary: {
    row: '.cos-form-row',
    checkbox: dataCySelector('website-primary-checkbox'),
    label: '.form-panel-field__primary-msg',
  },
  trashIcon: '.fa-trash',
};

const createComponent = createComponentFactory({
  component: CompanyWebsiteListForm,
  imports: [CompanyWebsiteListFormModule, NgxsModule.forRoot()],
});

const testSetup = (options?: { websites?: Partial<Website>[] }) => {
  const spectator = createComponent();

  const component = spectator.component;

  options?.websites?.length
    ? options.websites.forEach((website) => component.addItem(website as any))
    : component.addItem();

  spectator.detectComponentChanges();

  return {
    spectator,
    component,
  };
};

describe('CompanyWebsiteListForm', () => {
  it('should create', () => {
    const { component } = testSetup();

    expect(component).toBeTruthy();
  });

  describe('Url field', () => {
    it('should contain label', () => {
      const { spectator } = testSetup();

      expect(spectator.query(form.url.label)).toBeTruthy();
      expect(spectator.query(form.url.label).textContent.trim()).toEqual(
        'Website'
      );
    });

    it('should have max length', () => {
      const { spectator } = testSetup();

      expect(spectator.query(form.url.field)).toBeTruthy();
      expect(spectator.query(form.url.field).getAttribute('maxlength')).toEqual(
        '100'
      );
    });

    it('should display error message when invalid', () => {
      const { spectator, component } = testSetup();

      spectator.typeInElement('afsdfadsf', form.url.field);
      spectator.blur(form.url.field);

      expect(component.form.controls[0].get('Url').errors).toEqual({
        validUrl: true,
      });
    });
  });

  describe('Is primary checkbox', () => {
    it('should show checkbox "Make Primary" when website is not a primary one', () => {
      const { spectator } = testSetup({ websites: [{ IsPrimary: false }] });

      expect(spectator.query(form.isPrimary.label)).toBeFalsy();
      expect(spectator.query(form.isPrimary.checkbox)).toBeTruthy();
      expect(
        spectator.query(form.isPrimary.checkbox).textContent.trim()
      ).toEqual('Make Primary');
    });

    it('should show label "This is my primary website" when website is a primary one', () => {
      const { spectator } = testSetup({ websites: [{ IsPrimary: true }] });

      expect(spectator.query(form.isPrimary.label)).toBeTruthy();
      expect(spectator.query(form.isPrimary.label).textContent.trim()).toEqual(
        'This is my primary website'
      );
      expect(spectator.query(form.isPrimary.checkbox)).toBeFalsy();
    });

    it('should create primary website as default', () => {
      const { spectator, component } = testSetup();

      expect(spectator.query(form.isPrimary.label)).toBeTruthy();
      expect(component.form.controls[0].get('IsPrimary')).toBeTruthy();
    });
  });

  describe('Add website action', () => {
    it('should contain "+ Add website" button', () => {
      const { spectator } = testSetup();

      expect(spectator.query(addWebsite.button)).toBeTruthy();
      expect(spectator.query(addWebsite.button).textContent.trim()).toEqual(
        'Add Website'
      );
      expect(spectator.query(addWebsite.icon).classList).toContain('fa-plus');
    });

    it('should add row with not primary website, when there is already a primary website', () => {
      const { spectator } = testSetup({
        websites: [{ Url: 'google.com', IsPrimary: true }],
      });

      spectator.click(addWebsite.button);
      spectator.detectComponentChanges();

      expect(spectator.queryAll(form.isPrimary.label).length).toBe(1);
      expect(spectator.queryAll(form.isPrimary.checkbox).length).toBe(1);
    });
  });

  it('should allow clearing of the website address when only 1 website exist and save action to delete that website address', () => {
    const { spectator, component } = testSetup({
      websites: [{ Url: 'test.com' }],
    });

    spectator.typeInElement('', form.url.field);
    spectator.detectComponentChanges();

    expect(component.form.valid).toBeTruthy();
  });

  describe('Trash icons', () => {
    it('should be not visible when only 1 website visible', () => {
      const { spectator } = testSetup({ websites: [{ Url: 'test.com' }] });
      const trashIcons = spectator.queryAll(form.trashIcon);
      const row = spectator.query('cos-input-row');

      expect(trashIcons.length).toBe(1);
      expect(row.getAttribute('ng-reflect-allow-remove')).toBe('false');
    });

    it('should be visible when 2 or more websites visible', () => {
      const { spectator } = testSetup({
        websites: [{ Url: 'test.com' }, { Url: 'test2.com' }],
      });
      const trashIcons = spectator.queryAll(form.trashIcon);
      const rows = spectator.queryAll('cos-input-row');

      expect(trashIcons.length).toBe(2);
      rows.forEach((row) => {
        expect(row.getAttribute('ng-reflect-allow-remove')).toBe('true');
      });
    });

    it('should remove a control', () => {
      const { spectator } = testSetup({
        websites: [{ Url: 'test.com' }, { Url: 'test2.com' }],
      });
      let trashIcons = spectator.queryAll(form.trashIcon);

      spectator.click(trashIcons[0]);
      spectator.detectComponentChanges();

      trashIcons = spectator.queryAll(form.trashIcon);
      expect(trashIcons.length).toBe(1);
    });
  });
});
