import { dataCySelector } from '@cosmos/testing';
import { CompaniesMockDb } from '@esp/__mocks__/companies';
import { HasRolePipe, IsCollaboratorPipe, IsOwnerPipe } from '@esp/auth';
import { AccessLevel, AccessType } from '@esp/models';
import { PARTY_LOCAL_STATE, PartyLocalState } from '@esp/parties';
import { createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { of } from 'rxjs';
import { CollaboratorsDialogService } from '../../services';

import {
  AsiManageCollaboratorsComponent,
  AsiManageCollaboratorsModule,
} from './manage-collaborators.component';

const company = CompaniesMockDb.Companies[0];
const selectors = {
  button: dataCySelector('manage-collaborators-button'),
  everyoneMessage: dataCySelector('everyone-message'),
  ownerMessage: dataCySelector('owner-message'),
};

describe('AsiManageCollaboratorsComponent', () => {
  const createComponent = createComponentFactory({
    component: AsiManageCollaboratorsComponent,
    imports: [AsiManageCollaboratorsModule],
  });

  const testSetup = (options?: {
    canEdit?: boolean;
    isOnlyReadWrite?: boolean;
    accessLevel?: AccessLevel;
    accessType?: AccessType;
  }) => {
    const partyMock = {
      connect: () => of(this),
      party: {
        ...company,
        AccessLevel: options?.accessLevel ?? 'Everyone',
        Access: options?.accessType
          ? [
              {
                AccessType: options.accessType,
              },
            ]
          : [],
      },
      partyIsReady: true,
    };

    const spectator = createComponent({
      props: {
        canEdit: options?.canEdit,
        isOnlyReadWrite: options?.isOnlyReadWrite,
      },
      providers: [
        mockProvider(CollaboratorsDialogService),
        mockProvider(HasRolePipe),
        mockProvider(IsCollaboratorPipe),
        mockProvider(IsOwnerPipe),
        mockProvider(PartyLocalState, partyMock),
        {
          provide: PARTY_LOCAL_STATE,
          useValue: partyMock,
        },
      ],
    });

    spectator.detectChanges();
    spectator.detectComponentChanges();

    return { spectator, component: spectator.component };
  };

  it('should create', () => {
    const { component } = testSetup();
    expect(component).toBeTruthy();
  });

  describe('Manage button', () => {
    it('should show manage button when user is allowed', () => {
      const { spectator } = testSetup({ canEdit: true });

      expect(spectator.query(selectors.button)).toExist();
      expect(spectator.query(selectors.button).textContent.trim()).toEqual(
        'Manage'
      );
    });

    it('should not show manage button when user is not allowed', () => {
      const { spectator } = testSetup({ canEdit: false });

      expect(spectator.query(selectors.button)).not.toExist();
    });
  });

  describe('Manage info message', () => {
    describe('Access Level Everyone', () => {
      it('should show message when it is only readwrite', () => {
        const { spectator } = testSetup({ isOnlyReadWrite: true });

        expect(
          spectator.query(selectors.everyoneMessage).textContent.trim()
        ).toEqual('Anyone within your company can edit');
      });

      it('should show message when it is not only readwrite and it has access type readwrite', () => {
        const { spectator } = testSetup({
          isOnlyReadWrite: false,
          accessLevel: 'Everyone',
          accessType: 'ReadWrite',
        });

        expect(
          spectator.query(selectors.everyoneMessage).textContent.trim()
        ).toEqual('Anyone within your company can edit');
      });

      it('should show message when it is not only readwrite and it has access type read', () => {
        const { spectator } = testSetup({
          isOnlyReadWrite: false,
          accessLevel: 'Everyone',
          accessType: 'Read',
        });

        expect(
          spectator.query(selectors.everyoneMessage).textContent.trim()
        ).toEqual('Anyone within your company can view');
      });
    });

    describe('Access Level Owner', () => {
      it('should show message', () => {
        const { spectator } = testSetup({ accessLevel: 'Owner' });

        expect(
          spectator.query(selectors.ownerMessage).textContent.trim()
        ).toEqual('Only the owner and admins can edit or view');
      });
    });
  });
});
