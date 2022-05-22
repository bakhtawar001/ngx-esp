import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  AsiUserTeamAutocompleteComponent,
  AsiUserTeamAutocompleteComponentModule,
  ConfirmDialogService,
} from '@asi/ui/feature-core';
import { CosConfirmDialog } from '@cosmos/components/confirm-dialog';
import { AuthFacade } from '@esp/auth';
import { Collaborator, Shareable } from '@esp/models';
import { createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { MockComponents } from 'ng-mocks';
import { of, Subject } from 'rxjs';
import {
  AsiTransferOwnershipDialog,
  AsiTransferOwnershipDialogModule,
} from './transfer-ownership.dialog';

const users = [
  {
    UserId: 535278,
    Name: 'testuserr testuserr',
    IsTeam: false,
    Role: 'Owner',
  },
  {
    UserId: 285221,
    Name: 'Adnan Khan',
    Email: 'adnankhan@asicentral.com',
    IsTeam: false,
    Role: 'Administrator',
  },
] as any[];

describe('AsiTransferOwnershipDialog', () => {
  const createComponent = createComponentFactory({
    component: AsiTransferOwnershipDialog,
    imports: [
      HttpClientTestingModule,
      NgxsModule.forRoot(),
      AsiTransferOwnershipDialogModule,
    ],
    overrideModules: [
      [
        AsiUserTeamAutocompleteComponentModule,
        {
          set: {
            declarations: MockComponents(AsiUserTeamAutocompleteComponent),
            exports: MockComponents(AsiUserTeamAutocompleteComponent),
          },
        },
      ],
    ],
    providers: [
      mockProvider(AuthFacade, {
        getUser: () =>
          of({
            Id: users[0].UserId,
          }),
        user: {
          Id: users[0].UserId,
        },
      }),
    ],
  });

  const testSetup = (options?: {
    explicit?: Partial<Shareable>;
    isReadOnly?: boolean;
    newOwner?: any;
  }) => {
    const entity = buildSharableEntity(options);
    const backdropClickSubject = new Subject<void>();

    const spectator = createComponent({
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            entity,
          },
        },
        {
          provide: MatDialogRef,
          useValue: {
            close: jest.fn(),
            backdropClick: () => backdropClickSubject,
          },
        },
      ],
    });

    const component = spectator.component;

    if (options?.newOwner) {
      component.newOwner.setValue(options.newOwner);
      spectator.detectComponentChanges();
    }

    const dialogRef = spectator.inject(MatDialogRef, true);
    const confirmService = spectator.inject(ConfirmDialogService, true);

    return {
      spectator,
      component,
      confirmService,
      dialogRef,
      backdropClickSubject,
    };
  };

  it('should create', () => {
    const { spectator } = testSetup();

    expect(spectator).toBeTruthy();
  });

  it('On clicking N, return the user to the modal', () => {
    const { spectator, component, dialogRef, backdropClickSubject } =
      testSetup();

    const dialog = spectator.inject(MatDialog, true);
    jest.spyOn(dialog, 'open').mockReturnValue(<any>{
      afterClosed: () => of(false),
    });
    component.newOwner.setValue(users[0]);
    spectator.detectComponentChanges();
    backdropClickSubject.next();
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('User should remain on the collection landing page once the ownership is transferred from the Transfer ownership modal', async () => {
    const { spectator, component, dialogRef } = testSetup();

    const dialog = spectator.inject(MatDialog, true);
    const dialogSpy = jest.spyOn(dialog, 'open').mockReturnValue(<any>{
      afterClosed: () => of(true),
    });
    component.newOwner.setValue(users[0]);
    spectator.detectComponentChanges();
    await component.transfer();
    expect(dialogSpy).toHaveBeenCalled();
    expect(dialogRef.close).toHaveBeenCalledWith(component.newOwner.value);
  });

  it('Dismissing the Transfer ownership modal should keep user on the collection landing page and ownership should not be transferred', () => {
    const { spectator, dialogRef } = testSetup();

    const modalCloseBtn = spectator.query('.cos-modal-close');
    expect(modalCloseBtn).toExist();
    expect(modalCloseBtn.tagName).toBe('BUTTON');
    spectator.click(modalCloseBtn);
    expect(dialogRef.close).toHaveBeenCalledWith('');
  });

  it("Transfer ownership modal should be displayed correctly with Header 'Transfer Ownership', followed by Intructional text below as 'Transfer the ownership of [asset name] to someone else in your company'.", () => {
    const { spectator, component } = testSetup();

    const header = spectator.query('.mat-dialog-title');
    expect(header).toExist();
    expect(header).toHaveText('Transfer Ownership');
    const description = spectator.query('header > p');
    expect(description).toExist();
    expect(description).toHaveText(
      `Transfer the ownership of ${component.data.entity.Name} to someone else in your company.`
    );
  });

  it('Owner name should be listed correctly with owner Avatar under the Current Owner header when current user is the current owner', () => {
    const { spectator, component } = testSetup({
      explicit: {
        Owner: {
          Email: 'lpenny@asicentral.com',
          ImageUrl:
            'https://commonmedia.uat-asicentral.com/orders/Artwork/aee19af4206846edbb1a48cb911b035b.png',
          IsTeam: false,
          Name: 'Leigh Penny Jr.',
          Role: 'Owner',
          UserId: 28966,
        },
      },
    });

    const userAvatar = spectator.query('.cos-avatar-image');
    expect(userAvatar).toExist();
    const userName = spectator.query('.account-item > div > h4');
    expect(userName).toExist();
    expect(userName).toHaveText(component.data.entity.Owner.Name);
  });

  it("The text (Me) should appear next to the 'Current Owner' label, when the current user is the current owner", () => {
    const { spectator } = testSetup();

    spectator.detectComponentChanges();
    const ownerLabel = spectator.query('.cos-form-label');
    expect(ownerLabel).toExist();
    expect(ownerLabel).toHaveText('Current Owner (Me)');
  });

  it("The text (Me) should not appear next to the 'Current Owner' label when the logged in user is not the owner", () => {
    const { spectator } = testSetup({ explicit: { OwnerId: users[1].UserId } });

    spectator.detectComponentChanges();
    const ownerLabel = spectator.query('.cos-form-label');
    expect(ownerLabel).toExist();
    expect(ownerLabel).not.toContainText('Current Owner (Me)');
  });

  it("Owner name should be listed correctly with owner Avatar under the 'Current Owner' header when current user is not the current owner", () => {
    const { spectator, component } = testSetup({
      explicit: {
        Owner: {
          Email: 'lpenny@asicentral.com',
          ImageUrl:
            'https://commonmedia.uat-asicentral.com/orders/Artwork/aee19af4206846edbb1a48cb911b035b.png',
          IsTeam: false,
          Name: 'Leigh Penny Jr.',
          Role: 'Owner',
          UserId: 28966,
        },
      },
    });

    const userAvatar = spectator.query('.cos-avatar-image');
    expect(userAvatar).toExist();
    const userName = spectator.query('.account-item > div > h4');
    expect(userName).toExist();
    expect(userName).toHaveText(component.data.entity.Owner.Name);
  });

  it('Select an owner watermark should be displayed in the dropdown', () => {
    const { spectator } = testSetup();

    const autocomplete = spectator.query('asi-user-team-autocomplete');
    expect(autocomplete.getAttribute('placeholder')).toEqual('Select an owner');
  });

  it('Transfer button should be displayed on the modal disabled by default', () => {
    const { spectator } = testSetup();

    const transferBtn = spectator.query('.transfer-ownership-btn');
    expect(transferBtn).toExist();
    expect(transferBtn.getAttribute('disabled')).toBeTruthy();
    expect(transferBtn).toHaveClass('cos-button-disabled');
  });

  it('Transfer button should get enabled when user select a user and tabs out', () => {
    const { spectator, component } = testSetup();

    component.newOwner.setValue(users[0]);
    spectator.detectComponentChanges();
    const transferBtn = spectator.query('.transfer-ownership-btn');
    expect(transferBtn).toExist();
    expect(transferBtn.getAttribute('disabled')).toBeFalsy();
    expect(transferBtn).not.toHaveClass('cos-button-disabled');
  });

  it('Transfer button should get disabled when user removes the selection from search field', () => {
    const { spectator, component } = testSetup();

    component.newOwner.setValue(users[0]);
    spectator.detectComponentChanges();
    let transferBtn = spectator.query('.transfer-ownership-btn');
    expect(transferBtn).toExist();
    expect(transferBtn.getAttribute('disabled')).toBeFalsy();
    expect(transferBtn).not.toHaveClass('cos-button-disabled');
    component.newOwner.setValue(null);
    spectator.detectComponentChanges();
    transferBtn = spectator.query('.transfer-ownership-btn');
    expect(transferBtn.getAttribute('disabled')).toBeTruthy();
    expect(transferBtn).toHaveClass('cos-button-disabled');
  });

  it("Clicking Transfer after selecting user should display warning message as 'Are you sure you want to change ownership? Access level of [current owner] will be impacted.' with options 'Yes, change ownership', 'No, I don't want to change ownership'", () => {
    const { spectator, component } = testSetup();

    const dialog = spectator.inject(MatDialog, true);
    const dialogSpy = jest.spyOn(dialog, 'open').mockReturnValue(<any>{
      afterClosed: () => of(true),
    });
    component.data.entity.Owner = {
      Email: 'lpenny@asicentral.com',
      ImageUrl:
        'https://commonmedia.uat-asicentral.com/orders/Artwork/aee19af4206846edbb1a48cb911b035b.png',
      IsTeam: false,
      Name: 'Leigh Penny Jr.',
      Role: 'Owner',
      UserId: 28966,
    };
    component.owner = component.data.entity.Owner as Collaborator;
    component.newOwner.setValue(users[0]);
    spectator.detectComponentChanges();
    component.transfer();
    expect(dialogSpy).toHaveBeenCalledWith(CosConfirmDialog, {
      minWidth: '600px',
      width: '600px',
      data: {
        message: `Are you sure you want to change ownership? Access level of ${component.data.entity.Owner.Name} will be impacted.`,
        confirm: 'Yes, change ownership',
        cancel: "No, I don't want to change ownership",
      },
    });
  });

  it("Clicking 'No' should close the warning modal and ownership should not be transferred", () => {
    const { spectator, component } = testSetup();

    const dialog = spectator.inject(MatDialog, true);
    const dialogSpy = jest.spyOn(dialog, 'open').mockReturnValue(<any>{
      afterClosed: () => of(false),
    });
    component.newOwner.setValue(users[0]);
    spectator.detectComponentChanges();
    component.transfer();
    expect(dialogSpy).toHaveBeenCalled();
  });

  it("Clicking 'Yes' should close the warning modal, and success message should be displayed as 'Ownership Transferred!', with subtext 'Ownership has been transferred to [User First] [User Last]', where as User First and User Last is the new owner name", async () => {
    const { spectator, component, confirmService, dialogRef } = testSetup({
      newOwner: users[0],
    });
    jest.spyOn(confirmService, 'confirmDiscardChanges');

    const dialog = spectator.inject(MatDialog, true);
    const dialogSpy = jest.spyOn(dialog, 'open').mockReturnValue(<any>{
      afterClosed: () => of(true),
    });

    await component.transfer();

    expect(dialogSpy).toHaveBeenCalled();
    expect(dialogRef.close).toHaveBeenCalledWith(component.newOwner.value);
  });

  it("Warning message should be displayed with text 'Are you sure you do not want to save your changes?' with options 'Yes' &  'No' when user made some changes on the transfer ownership modal and attempts to navigate away.", () => {
    const { confirmService, backdropClickSubject } = testSetup({
      newOwner: users[0],
    });
    jest.spyOn(confirmService, 'confirmDiscardChanges');

    backdropClickSubject.next();

    expect(confirmService.confirmDiscardChanges).toHaveBeenCalled();
  });

  it('Clicking Yes should close the modal without saving changes', () => {
    const { confirmService, dialogRef, backdropClickSubject } = testSetup({
      newOwner: users[0],
    });
    jest
      .spyOn(confirmService, 'confirmDiscardChanges')
      .mockReturnValue(of(true));

    backdropClickSubject.next();

    expect(dialogRef.close).toHaveBeenCalled();
  });
});

const mockEntity = {
  TenantId: 500049971,
  OwnerId: 535278,
  Name: 'Shareable Entity',
} as Shareable;

function buildSharableEntity(options?: {
  explicit?: Partial<Shareable>;
  isReadOnly?: boolean;
}) {
  const entity: Shareable = {
    ...mockEntity,
    ...(options?.explicit || {}),
    IsEditable: !options?.isReadOnly,
  };

  return entity;
}
