import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Contact } from '@esp/models';
import { createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { of } from 'rxjs';
import {
  ContactLinksPanelForm,
  ContactLinksPanelFormModule,
} from './contact-links-panel.form';
import { ContactsMockDb } from '@esp/contacts/mocks';
import { ContactDetailLocalState } from '../../../contacts/local-states';

const contactMock = ContactsMockDb.Contacts[0];

describe('ContactLinksPanelForm', () => {
  const createComponent = createComponentFactory({
    component: ContactLinksPanelForm,
    imports: [
      HttpClientTestingModule,
      NgxsModule.forRoot(),
      ContactLinksPanelFormModule,
    ],
    providers: [],
    overrideModules: [],
  });

  const testSetup = (options?: {
    contact?: Partial<Contact>;
    isEditable?: boolean;
  }) => {
    const spectator = createComponent({
      providers: [
        mockProvider(ContactDetailLocalState, <
          Partial<ContactDetailLocalState>
        >{
          connect() {
            return of(this);
          },
          contact: options?.contact || contactMock,
        }),
      ],
    });

    spectator.detectComponentChanges();

    return { spectator, component: spectator.component };
  };

  it('should create', () => {
    const { component } = testSetup();

    expect(component).toBeTruthy();
  });
  //  @TODO Domin unit tests;

  // describe('Empty State', () => {
  //   it('Show COMPONENT when there are currently no linked contacts', () => {
  //     const { component } = testSetup();
  //
  //     expect(component).toBeTruthy();
  //   });
  //
  //   it('should create a Contacts linked group with the + Add contact Link CTA disable', () => {
  //
  //   });
  //
  //   it('Should add a new panel with focus on the contact name type ahead control', () => {});
  //
  //   it('Should show the ‘Contacts’ group panel after the companies group panel', () => {});
  // });
  //
  // describe('View Linked contacts', () => {
  //
  //   it('Should show the panel "Contacts" when on the "Contact Detail View"', () => {});
  //
  //   it('Should show a panel for empty state with label "No linked contacts"', () => {});
  //
  //   it('Should, when there are existing contacts already linked, show each contact as a separate panel', () => {});
  //
  //   it('Should show Contact icon when linking a contact to a contact', () => {});
  //
  //   it('Should show contact first and last name with a space separating the first and last name', () => {});
  //
  //   it('Should always show "Edit" when contact link is editable', () => {});
  //
  //   it('Should show ‘View Full Contact’ link in view state', () => {});
  //
  //   it('Should make visible the "+ Add New Contact Link" when is editable', () => {});
  // });
  //
  // describe('Add New Contact Link ', () => {
  //   it('Should show autocomplete - select control with label ‘Contact Name’ ', () => {});
  //
  //   it('Should show Contact Name as a Required field', () => {});
  //
  //   it('Should show relationship as an optional field and is not a required field', () => {});
  //
  //   it('Should default save as disabled until a contact name is selected', () => {});
  // });
  //
  // describe('Relationship AutoComplete Control', () => {
  //   it('should show label Relationship', () => {});
  //
  //   it('Should show autocomplete - select control', () => {});
  // });
  //
  // describe('Edit action', () => {
  //   it('Should show relationship as an optional field', () => {});
  //
  //   it('Should expand row and display in an edit state', () => {});
  //
  //   it('should show contact name as read-only text', () => {});
  //
  //   it('Should default Cancel as enabled always', () => {});
  //
  //   it('Should disable Save until relationship selection is changed', () => {});
  //
  //   it('Should show a Remove action', () => {});
  //
  //   it('should upon selection of Cancel collapse and return to view state', () => {});
  // });
  //
  // describe('Remove action', () => {
  //   it('Should be displayed when User selects Edit contact', () => {});
  //
  //   it('should remove row from view and no longer link to this contact', () => {});
  // });
  //
  // describe('Save (from edit)', () => {
  //   it('Should enable when relationship value is changed', () => {});
  //
  //   it('Should apply optimistic update behavior', () => {});
  //
  //   it('Should apply optimistic update behavior', () => {});
  //
  //   it('Should confirm that the contact and relationship is correctly assigned per table above ', () => {});
  // });
});
