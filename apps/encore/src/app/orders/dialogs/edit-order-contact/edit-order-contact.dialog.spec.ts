import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthFacade } from '@esp/auth';
import { CollectionMockDb } from '@esp/collections/mocks';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { MockComponent } from 'ng-mocks';
import { Subject } from 'rxjs';
import { AsiUserTeamAutocompleteComponent } from '@asi/ui/feature-core';
import {
  EditOrderContactDialog,
  EditOrderContactDialogModule,
} from './edit-order-contact.dialog';

describe('EditOrderContactDialog', () => {
  let spectator: Spectator<EditOrderContactDialog>;
  let component: EditOrderContactDialog;
  let dialogRef: MatDialogRef<any, any>;
  const backdropClickSubject = new Subject<void>();
  const afterOpenedSubject = new Subject<void>();

  const createComponent = createComponentFactory({
    component: EditOrderContactDialog,
    declarations: [MockComponent(AsiUserTeamAutocompleteComponent)], // TODO: doesn't seem to be mocking.
    imports: [
      HttpClientTestingModule,
      NgxsModule.forRoot(),
      EditOrderContactDialogModule,
    ],
    providers: [
      mockProvider(AuthFacade, {
        user: {},
      }),
      {
        provide: MAT_DIALOG_DATA,
        useValue: { entity: CollectionMockDb.Collections[0] },
      },
      mockProvider(MatDialogRef, {
        close: jest.fn(),
        backdropClick: () => backdropClickSubject,
        afterOpened: () => afterOpenedSubject,
      }),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    dialogRef = spectator.inject(MatDialogRef);
  });

  it('should create', () => {
    expect(spectator).toBeTruthy();
  });

  /*
  it('On clicking N, return the user to the modal', () => {
    const dialog = spectator.inject(MatDialog, true);
    jest.spyOn(dialog, 'open').mockReturnValue({
      afterClosed: () => of(false),
    });
    component.newOwner.setValue({});
    spectator.detectComponentChanges();
    backdropClickSubject.next();
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('User should remain on the collection landing page once the ownership is saved from the Transfer ownership modal', () => {
    const dialog = spectator.inject(MatDialog, true);
    const dialogSpy = jest.spyOn(dialog, 'open').mockReturnValue({
      afterClosed: () => of(true),
    });
    component.newOwner.setValue({});
    spectator.detectComponentChanges();
    component.save();
    expect(dialogSpy).toHaveBeenCalled();
    expect(dialogRef.close).toHaveBeenCalledWith(component.newOwner.value);
  });

  it('Dismissing the Transfer ownership modal should keep user on the collection landing page and ownership should not be saved', () => {
    const modalCloseBtn = spectator.query('.cos-modal-close');
    expect(modalCloseBtn).toExist();
    expect(modalCloseBtn.tagName).toBe('BUTTON');
    spectator.click(modalCloseBtn);
    expect(dialogRef.close).toHaveBeenCalledWith('');
  });

  it('Transfer ownership modal should be displayed correctly with Header: Transfer Ownership, followed by Intructional text below as: Transfer the ownership of [asset name] to someone else in your company.', () => {
    const header = spectator.query('.mat-dialog-title');
    expect(header).toExist();
    expect(header).toHaveText('Transfer Ownership');
    const description = spectator.query('header > p');
    expect(description).toExist();
    expect(description).toHaveText(
      `Transfer the ownership of ${component.state.collectionName} to someone else in your company.`
    );
  });

  it('Owner name should be listed correctly with owner Avatar under the Current Owner header when current user is the current owner', () => {
    component.state.owner = {
      Email: 'lpenny@asicentral.com',
      ImageUrl:
        'https://commonmedia.uat-asicentral.com/orders/Artwork/aee19af4206846edbb1a48cb911b035b.png',
      IsTeam: false,
      Name: 'Leigh Penny Jr.',
      Role: 'Owner',
      UserId: 28966,
    };
    component.state.currentUserIsOwner = true;
    spectator.detectComponentChanges();
    const userAvatar = spectator.query('.cos-avatar-image');
    expect(userAvatar).toExist();
    const userName = spectator.query('.account-item > div > h4');
    expect(userName).toExist();
    expect(userName).toHaveText(component.state.owner.Name);
  });

  it('The text (Me) should appear next to the: Current Owner label, when the current user is the current owner', () => {
    spectator.component.state.currentUserIsOwner = true;
    spectator.detectComponentChanges();
    const ownerLabel = spectator.query('.cos-form-label');
    expect(ownerLabel).toExist();
    expect(ownerLabel).toHaveText('Current Owner (Me)');
  });

  it('The text (Me) should NOT appear next to the Current Owner label when the logged in user is not the owner', () => {
    spectator.component.state.currentUserIsOwner = false;
    spectator.detectComponentChanges();
    const ownerLabel = spectator.query('.cos-form-label');
    expect(ownerLabel).toExist();
    expect(ownerLabel).toHaveText('Current Owner');
  });

  it('Owner name should be listed correctly with owner Avatar under the Current Owner header when current user is not the current owner', () => {
    component.state.owner = {
      Email: 'lpenny@asicentral.com',
      ImageUrl:
        'https://commonmedia.uat-asicentral.com/orders/Artwork/aee19af4206846edbb1a48cb911b035b.png',
      IsTeam: false,
      Name: 'Leigh Penny Jr.',
      Role: 'Owner',
      UserId: 28966,
    };
    component.state.currentUserIsOwner = false;
    spectator.detectComponentChanges();
    const userAvatar = spectator.query('.cos-avatar-image');
    expect(userAvatar).toExist();
    const userName = spectator.query('.account-item > div > h4');
    expect(userName).toExist();
    expect(userName).toHaveText(component.state.owner.Name);
  });

  it('Select an owner watermark should be displayed in the dropdown', () => {
    const searchInput = spectator.query('.mat-autocomplete-trigger');
    expect(searchInput).toExist();
    expect(searchInput.tagName).toBe('INPUT');
    expect(searchInput.getAttribute('placeholder')).toEqual('Select an owner');
  });

  it('Transfer button should be displayed on the modal disabled by default', () => {
    const saveBtn = spectator.query('.tranfer-ownership-btn');
    expect(saveBtn).toExist();
    expect(saveBtn.getAttribute('disabled')).toBeTruthy();
    expect(saveBtn).toHaveClass('cos-button-disabled');
  });

  it('Transfer button should get enabled when user select a user and tabs out', () => {
    component.newOwner.setValue({});
    spectator.detectComponentChanges();
    const saveBtn = spectator.query('.tranfer-ownership-btn');
    expect(saveBtn).toExist();
    expect(saveBtn.getAttribute('disabled')).toBeFalsy();
    expect(saveBtn).not.toHaveClass('cos-button-disabled');
  });

  it('Transfer button should get disabled when user removes the selection from search field', () => {
    component.newOwner.setValue({});
    spectator.detectComponentChanges();
    let saveBtn = spectator.query('.tranfer-ownership-btn');
    expect(saveBtn).toExist();
    expect(saveBtn.getAttribute('disabled')).toBeFalsy();
    expect(saveBtn).not.toHaveClass('cos-button-disabled');
    component.newOwner.setValue('');
    spectator.detectComponentChanges();
    saveBtn = spectator.query('.tranfer-ownership-btn');
    expect(saveBtn.getAttribute('disabled')).toBeTruthy();
    expect(saveBtn).toHaveClass('cos-button-disabled');
  });

  it("Clicking Transfer after selecting user should display warning message as: Are you sure you want to change ownership? Access level of [current owner] will be impacted. Yes, change ownership, No, I don't want to change ownership", () => {
    const dialog = spectator.inject(MatDialog, true);
    const dialogSpy = jest.spyOn(dialog, 'open').mockReturnValue({
      afterClosed: () => of(true),
    });
    component.state.owner = {
      Email: 'lpenny@asicentral.com',
      ImageUrl:
        'https://commonmedia.uat-asicentral.com/orders/Artwork/aee19af4206846edbb1a48cb911b035b.png',
      IsTeam: false,
      Name: 'Leigh Penny Jr.',
      Role: 'Owner',
      UserId: 28966,
    };
    component.newOwner.setValue({});
    spectator.detectComponentChanges();
    component.save();
    expect(dialogSpy).toHaveBeenCalledWith(CosConfirmDialogComponent, {
      minWidth: '600px',
      width: '600px',
      data: {
        message: `Are you sure you want to change ownership? Access level of ${component.state.owner.Name} will be impacted.`,
        confirm: 'Yes, change ownership',
        cancel: "No, I don't want to change ownership",
      },
    });
  });

  it('Clicking N should close the warning modal and ownership should not be saved', () => {
    const dialog = spectator.inject(MatDialog, true);
    const dialogSpy = jest.spyOn(dialog, 'open').mockReturnValue({
      afterClosed: () => of(false),
    });
    component.newOwner.setValue({});
    spectator.detectComponentChanges();
    component.save();
    expect(dialogSpy).toHaveBeenCalled();
  });

  it('Clicking Yes should close the warning modal, and success message should be displayed as: Ownership Transferred!, with subtext: Ownership has been saved to [User First] [User Last], where as User First and User Last is the new owner name', () => {
    const dialog = spectator.inject(MatDialog, true);
    const dialogSpy = jest.spyOn(dialog, 'open').mockReturnValue({
      afterClosed: () => of(true),
    });
    component.newOwner.setValue({});
    spectator.detectComponentChanges();
    component.save();
    expect(dialogSpy).toHaveBeenCalled();
    expect(dialogRef.close).toHaveBeenCalledWith(component.newOwner.value);
  });

  it('Warning message should be displayed as below when user made some changes on the save ownership modal and attempts to navigate away: Are you sure you do not want to save your changes? YN', () => {
    const dialog = spectator.inject(MatDialog, true);
    const dialogSpy = jest.spyOn(dialog, 'open').mockReturnValue({
      afterClosed: () => of(true),
    });
    component.newOwner.setValue({});
    spectator.detectComponentChanges();
    backdropClickSubject.next();
    expect(dialogSpy).toHaveBeenCalledWith(CosConfirmDialogComponent, {
      minWidth: '400px',
      width: '400px',
      data: {
        message: `Are you sure you do not want to save your changes?`,
        confirm: 'Yes',
        cancel: 'No',
      },
    });
  });

  it('Clicking Y should close the modal without saving changes', () => {
    const dialog = spectator.inject(MatDialog, true);
    jest.spyOn(dialog, 'open').mockReturnValue({
      afterClosed: () => of(true),
    });
    component.newOwner.setValue({});
    spectator.detectComponentChanges();
    backdropClickSubject.next();
    expect(dialogRef.close).toHaveBeenCalled();
  });
  */
});
