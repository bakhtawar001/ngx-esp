import { MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { CollaboratorsDialogService } from '@asi/collaborators/ui/feature-core';
import {
  AsiEmptyStateInfoComponent,
  AsiEmptyStateInfoModule,
} from '@asi/ui/feature-core';
import { CosToastService } from '@cosmos/components/notification';
import { dataCySelector } from '@cosmos/testing';
import { AuthFacade } from '@esp/auth';
import { ContactsService } from '@esp/contacts';
import { ContactsMockDb } from '@esp/contacts/mocks';
import { Contact } from '@esp/models';
import {
  EspSearchBoxModule,
  EspSearchPaginationModule,
  EspSearchSortModule,
  EspSearchTabsModule,
  SearchBoxComponent,
  SearchPaginationComponent,
  SearchSortComponent,
  SearchTabGroupComponent,
} from '@esp/search';
import { createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { MockComponents } from 'ng-mocks';
import { of } from 'rxjs';
import { DirectoryMenu, DIRECTORY_MENU } from '../../../directory/configs';
import { ContactCardComponentModule } from '../../components/contact-card';
import { ContactCardComponent } from '../../components/contact-card/contact-card.component';
import { ContactSearchLocalState } from '../../local-states';
import {
  ContactSearchPage,
  ContactSearchPageModule,
} from './contact-search.page';

const mockContact = ContactsMockDb.Contacts[0];
const selectors = {
  search: dataCySelector('search'),
  sort: dataCySelector('sort'),
  tabs: dataCySelector('tabs'),
  loader: dataCySelector('loader'),
  noContactsInfo: dataCySelector('no-contacts-info'),
  noSearchResultsInfo: dataCySelector('no-search-results-info'),
  noContactsButton: dataCySelector('no-contacts-info') + ' button',
  contactCard: dataCySelector('contact-card'),
};

describe('ContactSearchPage', () => {
  const createComponent = createComponentFactory({
    component: ContactSearchPage,
    imports: [
      ContactSearchPageModule,
      NgxsModule.forRoot(),
      RouterTestingModule,
    ],
    providers: [
      { provide: DIRECTORY_MENU, useValue: DirectoryMenu },
      mockProvider(AuthFacade),
      mockProvider(ContactsService),
      mockProvider(CosToastService),
      mockProvider(CollaboratorsDialogService),
      mockProvider(MatDialog),
    ],
    overrideModules: [
      [
        EspSearchPaginationModule,
        {
          set: {
            declarations: MockComponents(SearchPaginationComponent),
            exports: MockComponents(SearchPaginationComponent),
          },
        },
      ],
      [
        EspSearchBoxModule,
        {
          set: {
            declarations: MockComponents(SearchBoxComponent),
            exports: MockComponents(SearchBoxComponent),
          },
        },
      ],
      [
        EspSearchSortModule,
        {
          set: {
            declarations: MockComponents(SearchSortComponent),
            exports: MockComponents(SearchSortComponent),
          },
        },
      ],
      [
        EspSearchTabsModule,
        {
          set: {
            declarations: MockComponents(SearchTabGroupComponent),
            exports: MockComponents(SearchTabGroupComponent),
          },
        },
      ],
      [
        ContactCardComponentModule,
        {
          set: {
            declarations: MockComponents(ContactCardComponent),
            exports: MockComponents(ContactCardComponent),
          },
        },
      ],
      [
        AsiEmptyStateInfoModule,
        {
          set: {
            declarations: MockComponents(AsiEmptyStateInfoComponent),
            exports: MockComponents(AsiEmptyStateInfoComponent),
          },
        },
      ],
    ],
  });

  const testSetup = (options?: {
    isLoading?: boolean;
    contacts?: Partial<Contact>[];
    term?: string;
  }) => {
    const spectator = createComponent({
      providers: [
        mockProvider(ContactSearchLocalState, {
          connect: () => of(this),
          contactsLoading: options?.isLoading ?? false,
          contacts: options?.contacts ?? [],
          sort: { name: '' },
          term: options?.term || '',
        }),
      ],
    });

    return { spectator, component: spectator.component };
  };

  it('should create', () => {
    // Arrange
    const { spectator } = testSetup();

    // Assert
    expect(spectator).toBeTruthy();
  });

  it('should contain search', () => {
    // Arrange
    const { spectator } = testSetup();

    // Assert
    expect(spectator.query(selectors.search)).toBeVisible();
  });

  it('should contain sort', () => {
    // Arrange
    const { spectator } = testSetup();

    // Assert
    expect(spectator.query(selectors.sort)).toBeVisible();
  });

  it('should contain tabs', () => {
    // Arrange
    const { spectator } = testSetup();

    // Assert
    expect(spectator.query(selectors.tabs)).toBeVisible();
  });

  describe('Loader', () => {
    it('should show be visible when loading', () => {
      // Arrange
      const { spectator } = testSetup({ isLoading: true });

      // Assert
      expect(spectator.query(selectors.loader)).toBeVisible();
    });

    it('should not be visible when loaded', () => {
      // Arrange
      const { spectator } = testSetup({ isLoading: false });

      // Assert
      expect(spectator.query(selectors.loader)).not.toBeVisible();
    });
  });

  describe('Contact card', () => {
    it('should not be visible when loading', () => {
      // Arrange
      const { spectator } = testSetup({ isLoading: true });

      // Assert
      expect(spectator.queryAll(selectors.contactCard).length).toBe(0);
    });

    it('should not be visible when loaded but no data found', () => {
      // Arrange
      const { spectator } = testSetup({ isLoading: false, contacts: [] });

      // Assert
      expect(spectator.queryAll(selectors.contactCard).length).toBe(0);
    });

    it('should be visible when loaded and data found', () => {
      // Arrange
      const { spectator } = testSetup({
        isLoading: false,
        contacts: [mockContact],
      });

      // Assert
      expect(spectator.queryAll(selectors.contactCard).length).toBe(1);
      expect(spectator.query(selectors.contactCard)).toBeVisible();
    });
  });

  describe('No contacts info', () => {
    it('should be visible when loaded and no data found', () => {
      // Arrange
      const { spectator } = testSetup({ isLoading: false, contacts: [] });

      // Assert
      expect(spectator.query(selectors.noContactsInfo)).toBeVisible();
    });

    it('should not be visible when loading', () => {
      // Arrange
      const { spectator } = testSetup({ isLoading: true });

      // Assert
      expect(spectator.query(selectors.noContactsInfo)).not.toBeVisible();
    });

    it('should not be visible when loaded but data found', () => {
      // Arrange
      const { spectator } = testSetup({
        isLoading: false,
        contacts: [mockContact],
      });

      // Assert
      expect(spectator.query(selectors.noContactsInfo)).not.toBeVisible();
    });

    it('should display hardcoded text when no data is fetched with no search term set', () => {
      // Arrange
      const { spectator } = testSetup({ isLoading: false, contacts: [] });
      const info = spectator.query(selectors.noContactsInfo);

      // Assert
      expect(info.getAttribute('mainText')).toEqual('No Contacts');
      expect(info.getAttribute('secondText')).toEqual(
        'There are no contacts in your directory.'
      );
      expect(info.getAttribute('thirdText')).toEqual(
        'Create a new contact record to begin.'
      );
    });

    it('should display `No contacts found.` text when there are no search results', () => {
      // Arrange
      const { spectator } = testSetup({
        isLoading: false,
        contacts: [],
        term: 'test',
      });
      const info = spectator.query(selectors.noSearchResultsInfo);

      // Assert
      expect(info.textContent.trim()).toBe('No contacts found.');
    });

    it('should display create new contact button', () => {
      // Arrange
      const { spectator } = testSetup({ isLoading: false, contacts: [] });

      // Assert
      expect(
        spectator.query(selectors.noContactsButton).textContent.trim()
      ).toEqual('Create New Contact');
    });

    it('should call state.createContact on click create contact button', () => {
      // Arrange
      const { spectator, component } = testSetup();
      const createContactSpy = jest.spyOn(component, 'createContact');
      const openCreateContactDialogSpy = jest.spyOn(
        component.state,
        'createContact'
      );

      // Act
      spectator.click(selectors.noContactsButton);

      // Assert
      expect(createContactSpy).toHaveBeenCalled();
      expect(openCreateContactDialogSpy).toHaveBeenCalled();
    });
  });
});
