import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AsiManageCollaboratorsComponent,
  AsiManageCollaboratorsModule,
} from '@asi/collaborators/ui/feature-core';
import {
  AsiContactActionsMenuComponent,
  AsiContactActionsMenuModule,
} from '@asi/contacts/ui/feature-components';
import { dataCySelector } from '@cosmos/testing';
import { HasWriteAccessPipe } from '@esp/auth';
import { ContactsMockDb } from '@esp/contacts/mocks';
import { createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { MockComponents } from 'ng-mocks';
import { of } from 'rxjs';
import { ContactDetailLocalState } from '../../local-states';
import {
  ContactDetailPage,
  ContactDetailPageModule,
} from './contact-detail.page';

const contact = ContactsMockDb.Contacts[0];
const selectors = {
  profilePhoto: '.avatar-image',
  profileInitials: '.avatar-wrapper',
  createdOn: dataCySelector('contact-created-on'),
  managedBy: dataCySelector('contact-managed-by'),
  collaborators: dataCySelector('contact-collaborators'),
};

describe('ContactDetailPage', () => {
  const createComponent = createComponentFactory({
    component: ContactDetailPage,
    imports: [
      RouterTestingModule,
      NgxsModule.forRoot(),
      ContactDetailPageModule,
    ],
    overrideModules: [
      [
        AsiContactActionsMenuModule,
        {
          set: {
            declarations: MockComponents(AsiContactActionsMenuComponent),
            exports: MockComponents(AsiContactActionsMenuComponent),
          },
        },
      ],
      [
        AsiManageCollaboratorsModule,
        {
          set: {
            declarations: MockComponents(AsiManageCollaboratorsComponent),
            exports: MockComponents(AsiManageCollaboratorsComponent),
          },
        },
      ],
    ],
    providers: [
      mockProvider(ActivatedRoute, {
        snapshot: {
          queryParamMap: { getAll: (key: string) => ['contact'] },
        },
        params: of({ id: contact.Id }),
        queryParamMap: of({ getAll: () => ({ type: 'contact' }) }),
      }),
      mockProvider(HasWriteAccessPipe, { transform: () => true }),
    ],
  });

  const testSetup = (options?: {
    ProfilePhotoUrl?: string;
    CreateDate?: Date;
    OwnerName?: string;
  }) => {
    const stateMock = {
      isLoading: false,
      partyIsReady: true,
      party: {
        ...contact,
        IconMediaLink: options?.ProfilePhotoUrl
          ? { FileUrl: options.ProfilePhotoUrl }
          : null,
        CreateDate: options?.CreateDate ?? new Date(2021, 12, 31),
        Owner: options?.OwnerName ? { Name: options.OwnerName } : 'Test Owner',
      },
    };

    const spectator = createComponent({
      providers: [
        mockProvider(ContactDetailLocalState, {
          connect: () => of(stateMock),
          ...stateMock,
        }),
      ],
    });

    spectator.detectComponentChanges();

    return { spectator, component: spectator.component };
  };

  it('should create', () => {
    const { component, spectator } = testSetup();

    expect(spectator).toBeTruthy();
    expect(component).toBeTruthy();
  });

  it('should display avatar profile image assigned to contact', () => {
    const { spectator } = testSetup({ ProfilePhotoUrl: 'http://test.com' });

    expect(spectator.query(selectors.profilePhoto).getAttribute('src')).toEqual(
      'http://test.com'
    );
  });

  it('should show avatar with first/last initials when no profile image provided', () => {
    const { spectator } = testSetup({ ProfilePhotoUrl: null });

    expect(spectator.query(selectors.profilePhoto)).not.toBeVisible();
    expect(spectator.query(selectors.profileInitials)).toBeVisible();
  });

  it('should show creation date of record', () => {
    const { spectator } = testSetup({ CreateDate: new Date(1900, 12, 31) });

    expect(spectator.query(selectors.createdOn)).toHaveText(
      'Created onJanuary 31, 1901'
    );
  });

  it('should show the current owner of record', () => {
    const { spectator } = testSetup({ OwnerName: 'Test Test' });

    expect(spectator.query(selectors.managedBy)).toHaveText(
      'Managed byTest Test'
    );
  });

  it('should display collaborators of record', () => {
    const { spectator } = testSetup();

    expect(spectator.query(selectors.collaborators)).toBeVisible();
  });
});
