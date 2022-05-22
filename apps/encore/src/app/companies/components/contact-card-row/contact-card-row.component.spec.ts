import { RouterTestingModule } from '@angular/router/testing';
import { ContactsMockDb } from '@esp/contacts/mocks';
import { Contact, LinkRelationship, PhoneTypeEnum } from '@esp/models';
import { createComponentFactory } from '@ngneat/spectator/jest';
import {
  ContactCardRowComponent,
  ContactCardRowModule,
} from './contact-card-row.component';

const mockContact: Contact = {
  ...ContactsMockDb.Contacts[0],
  Phones: [
    {
      IsPrimary: true,
      Number: '123456789',
      Country: '',
      PhoneCode: '',
      Type: PhoneTypeEnum.Mobile,
    },
  ],
  Emails: [
    {
      Address: 'email@company.com',
      Id: 506908828,
      IsPrimary: true,
      Type: 'Work',
    },
  ],
};

const mockLink: LinkRelationship = {
  Id: 123456,
  Comment: '',
  IsEditable: true,
  Title: 'CEO',
  Type: null,
  To: {},
  From: {},
};

function buildLink(options?: { explicit: Partial<LinkRelationship> }) {
  const link: LinkRelationship = {
    ...mockLink,
    ...(options?.explicit || {}),
  };

  return link;
}

describe('ContactCardRowComponent', () => {
  const createComponent = createComponentFactory({
    component: ContactCardRowComponent,
    imports: [ContactCardRowModule, RouterTestingModule],
    declarations: [ContactCardRowComponent],
    providers: [],
  });

  const testSetup = (options?: {
    hidePhones?: boolean;
    hideEmails?: boolean;
    hideTitle?: boolean;
  }) => {
    const link = buildLink({
      explicit: {
        Title: options?.hideTitle ? '' : mockLink.Title,
        To: {
          ...mockContact,
          Phones: options?.hidePhones ? [] : mockContact.Phones,
          Emails: options?.hideEmails ? [] : mockContact.Emails,
        },
      },
    });

    const spectator = createComponent({
      props: {
        link,
        contactType: 'Shipping',
      },
    });

    return { spectator, component: spectator.component };
  };

  it('should create', () => {
    const { component } = testSetup();
    expect(component).toBeTruthy();
  });

  it('Should display Phone and the primary phone number', () => {
    const { spectator } = testSetup();
    const label = spectator.query('.contact-info-list-item__label');
    const value = spectator.query('.contact-info-list-item__value');
    expect(label).toBeVisible();
    expect(label.textContent).toBe('Phone:');
    expect(value.textContent).toBe('123456789');
  });

  it('Should display Phone and "-" when there is no value', () => {
    const { spectator } = testSetup({ hidePhones: true });
    spectator.detectComponentChanges();
    const label = spectator.query('.contact-info-list-item__label');
    const value = spectator.query('.contact-info-list-item__value');
    expect(label).toBeVisible();
    expect(label.textContent).toBe('Phone:');
    expect(value.textContent).toBe('-');
  });

  it('Should display ‘Email’ and the primary email address', () => {
    const { spectator } = testSetup();
    const listItem = spectator.queryAll('.contact-info-list-item')[1];
    const label = listItem.querySelector('.contact-info-list-item__label');
    const value = listItem.querySelector('.contact-info-list-item__value');
    expect(label).toBeVisible();
    expect(label.textContent).toBe('Email:');
    expect(value.textContent).toBe('email@company.com');
  });

  it('Should display Email and "-" when there is no value', () => {
    const { spectator } = testSetup({ hideEmails: true });
    spectator.detectComponentChanges();
    const listItem = spectator.queryAll('.contact-info-list-item')[1];
    const label = listItem.querySelector('.contact-info-list-item__label');
    const value = listItem.querySelector('.contact-info-list-item__value');
    expect(label).toBeVisible();
    expect(label.textContent).toBe('Email:');
    expect(value.textContent).toBe('-');
  });

  it('Should display ‘Title’ and customer title value', () => {
    const { spectator } = testSetup();
    const listItem = spectator.queryAll('.contact-info-list-item')[2];
    const label = listItem.querySelector('.contact-info-list-item__label');
    const value = listItem.querySelector('.contact-info-list-item__value');
    expect(label).toBeVisible();
    expect(label.textContent).toBe('Title:');
    expect(value.textContent).toBe(mockLink.Title);
  });

  it('Should display Title and "-" when there is no value', () => {
    const { spectator } = testSetup({ hideTitle: true });
    spectator.detectComponentChanges();
    const listItem = spectator.queryAll('.contact-info-list-item')[2];
    const label = listItem.querySelector('.contact-info-list-item__label');
    const value = listItem.querySelector('.contact-info-list-item__value');
    expect(label).toBeVisible();
    expect(label.textContent).toBe('Title:');
    expect(value.textContent).toBe('-');
  });
});
