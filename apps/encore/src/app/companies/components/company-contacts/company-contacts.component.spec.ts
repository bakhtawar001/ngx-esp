import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Company, LinkRelationship, PhoneTypeEnum } from '@esp/models';
import { CompaniesMockDb } from '@esp/__mocks__/companies';
import { createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { EMPTY, of } from 'rxjs';
import { CompanyDetailPage } from '../../pages';
import {
  CompanyContactsComponent,
  CompanyContactsComponentModule,
} from './company-contacts.component';
import { CompanyContactsLocalState } from './company-contacts.local-state';
import { ConfirmDialogService } from '@asi/ui/feature-core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ContactCrudService } from '@asi/contacts/ui/feature-core';
import { dataCySelector } from '@cosmos/testing';

const mockCompany: Company = CompaniesMockDb.Companies[0];

const mockLinks: LinkRelationship[] = [
  {
    Id: 1234564789,
    Type: null,
    Comment: '',
    IsEditable: true,
    To: {
      IsCompany: false,
      IsPerson: true,
      Id: 1234564789,
      Name: 'Test Contact',
      Phones: [
        {
          Id: 1234564789,
          Type: PhoneTypeEnum.Mobile,
          PhoneCode: '001',
          Country: 'PK',
          Number: '123456789',
          IsPrimary: true,
          Extension: '',
        },
      ],
      Emails: [
        {
          Id: 1234564789,
          Address: 'email@company.com',
          IsPrimary: true,
          Type: 'Work',
        },
      ],
      OwnerId: 123456,
      AccessLevel: 'Everyone',
      IsVisible: true,
      IsEditable: true,
    },
    Title: 'Engineer',
  },
];

const selectors = {
  headerTitle: dataCySelector('company-contacts-header-title'),
  addContactButton: dataCySelector('company-contacts-add-contact-button'),
  noContactsRow: dataCySelector('company-contacts-no-contacts-row'),
  contactAvatar: dataCySelector('company-contacts-contact-avatar'),
  contactName: dataCySelector('company-contacts-contact-name'),
  contactRole: dataCySelector('company-contacts-contact-role'),
  inactiveContactRow: dataCySelector('company-contacts-contact-inactive-row'),
  viewFullContactButton: dataCySelector(
    'company-contacts-view-full-contact-button'
  ),
  editButton: dataCySelector('company-contacts-edit-contact-button'),
  contactPhoneTitle: dataCySelector('company-contacts-contact-phone-title'),
  contactPhone: dataCySelector('company-contacts-contact-phone'),
  contactEmailTitle: dataCySelector('company-contacts-contact-email-title'),
  contactEmail: dataCySelector('company-contacts-contact-email'),
  contactNameLabel: dataCySelector('company-contacts-contact-name-label'),
  contactAutocomplete: dataCySelector('company-contacts-contact-autocomplete'),
  contactAutocompleteCreateButton: dataCySelector(
    'company-contacts-contact-autocomplete-create-button'
  ),
  linkTitleLabel: dataCySelector('company-contacts-link-title-label'),
  linkTitleInput: dataCySelector('company-contacts-link-title-input'),
  linkRoleLabel: dataCySelector('company-contacts-link-role-label'),
  linkRole: dataCySelector('company-contacts-link-role'),
  removeContactButton: dataCySelector('company-contacts-remove-contact-button'),
};

function buildCompany(options?: { explicit?: Partial<Company> }) {
  const company = {
    ...mockCompany,
    ...(options?.explicit || {}),
    Links: mockLinks,
    IsEditable: true,
  };

  return company;
}

xdescribe('ContactCardRowComponent', () => {
  const createComponent = createComponentFactory({
    component: CompanyContactsComponent,
    imports: [
      HttpClientTestingModule,
      RouterTestingModule.withRoutes([
        {
          path: 'company/:id',
          component: CompanyDetailPage,
        },
      ]),
      NgxsModule.forRoot(),
      CompanyContactsComponentModule,
    ],
    declarations: [CompanyContactsComponent],
    providers: [
      mockProvider(CompanyContactsLocalState, {
        connect() {
          return of(this);
        },
      }),
    ],
  });

  const testSetup = (options?: { hideLinks: boolean }) => {
    const company = buildCompany({
      explicit: {
        Links: options?.hideLinks ? [] : mockLinks,
      },
    });

    const spectator = createComponent({
      providers: [
        mockProvider(CompanyContactsLocalState, {
          connect() {
            return of(this);
          },
          company,
        }),
        mockProvider(ContactCrudService),
        mockProvider(ConfirmDialogService, {
          confirmDiscardChanges: () => EMPTY,
        }),
        {
          provide: MAT_DIALOG_DATA,
          useValue: {},
        },
        mockProvider(MatDialogRef, {
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          close: () => {},
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          backdropClick: () => {},
        }),
      ],
    });

    return { spectator, component: spectator.component };
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    // Arrange
    const { component } = testSetup();

    // Assert
    expect(component).toBeTruthy();
  });

  it('Should display when there are company contacts Label "Company Contacts (##)" where ## is the number of contacts', () => {
    // Arrange
    const { spectator } = testSetup();
    const contactsLabel = spectator.query('cos-segmented-panel-header > h2');

    // Assert
    expect(contactsLabel.textContent.trim()).toBe('Company Contacts (1)');
  });

  it('Should display ‘Company Contacts (0)’ for the empty state header', () => {
    // Arrange
    const { spectator } = testSetup({ hideLinks: true });
    const contactsLabel = spectator.query('cos-segmented-panel-header > h2');

    // Assert
    expect(contactsLabel.textContent.trim()).toBe('Company Contacts (0)');
  });

  it("Should display the 'Add Contact' button", () => {
    // Arrange
    const { spectator } = testSetup();
    const addBtn = spectator.query('cos-segmented-panel-header > button');

    // Assert
    expect(addBtn).toExist();
    expect(addBtn.tagName).toBe('BUTTON');
    expect(addBtn).toHaveText('Add Contact');
  });

  it('Should display for the empty state “No contacts found for this customer” text', () => {
    // Arrange
    const { spectator } = testSetup({ hideLinks: true });
    const panelRow = spectator.query('cos-segmented-panel-row');

    // Assert
    expect(panelRow.textContent.trim()).toBe(
      'No contacts found for this customer'
    );
  });

  it('Should display a contact panel record for each contact in a collapsed state', () => {
    // Arrange
    const { component, spectator } = testSetup();
    const contactPanelRecords = spectator.queryAll('esp-contact-card-row');

    // Assert
    expect(contactPanelRecords.length).toEqual(
      component.state.company.Links.length
    );
  });

  it('Should display first and last name', () => {
    const { spectator } = testSetup();
    spectator.detectComponentChanges();
    const contactName = spectator.query(selectors.contactName);
    expect(contactName.textContent).toBe('Test Contact');
  });

  it('Should show pill for Role', () => {
    const { spectator } = testSetup();
    const rowTitle = spectator.query(selectors.contactRole);
    expect(rowTitle).toBeVisible();
  });

  it('Should display in inactive mode', () => {
    const { spectator } = testSetup();
    const inactiveContactRow = spectator.query(selectors.inactiveContactRow);
    const activeContactRow = spectator.query(
      dataCySelector('company-contacts-contact-active-row')
    );
    expect(inactiveContactRow).toBeVisible();
    expect(activeContactRow).not.toBeVisible();
  });

  it('Should not display in inactive mode', () => {
    const { spectator, component } = testSetup();
    component.activeRow = 0;
    spectator.detectComponentChanges();
    const inactiveContactRow = spectator.query(selectors.inactiveContactRow);
    const activeContactRow = spectator.query(
      dataCySelector('company-contacts-contact-active-row')
    );
    expect(inactiveContactRow).not.toBeVisible();
    expect(activeContactRow).toBeVisible();
  });
});
