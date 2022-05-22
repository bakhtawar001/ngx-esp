import { InteractivityChecker } from '@angular/cdk/a11y';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  AsiUserTeamAutocompleteComponentModule,
  ConfirmDialogService,
} from '@asi/ui/feature-core';
import { AutocompleteService, EspAutocompleteModule } from '@esp/autocomplete';
import { AccessLevel, Collaborator, Shareable } from '@esp/models';
import { createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { EMPTY, of, Subject } from 'rxjs';
import {
  AsiManageCollaboratorsDialog,
  AsiManageCollaboratorsDialogModule,
} from './manage-collaborators.dialog';

const mockEntity = {
  TenantId: 500049971,
  OwnerId: 535278,
  AccessLevel: 'Custom',
  Access: [{ AccessLevel: 'User', EntityId: 285221, AccessType: 'Read' }],
  Collaborators: [
    {
      UserId: 535278,
      Name: 'Testuserr Testuserr',
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
  ],
} as Shareable;

function buildSharableEntity(options?: {
  explicit?: Partial<Shareable>;
  accessLevel?: AccessLevel;
  isReadOnly?: boolean;
}) {
  const entity: Shareable = {
    ...mockEntity,
    ...(options?.explicit || {}),
    IsEditable: !options?.isReadOnly,
  };

  if (options?.accessLevel) {
    Object.assign(entity, {
      AccessLevel: options.accessLevel,
    });
  }

  if (options?.accessLevel === 'Everyone') {
    Object.assign(entity, {
      Access: [
        { AccessType: options?.isReadOnly ? 'Read' : 'ReadWrite', EntityId: 0 },
      ],
    });
  }

  return entity;
}

describe('AsiManageCollaboratorsDialog', () => {
  const createComponent = createComponentFactory({
    component: AsiManageCollaboratorsDialog,
    imports: [
      HttpClientTestingModule,
      NgxsModule.forRoot(),
      EspAutocompleteModule,
      AsiManageCollaboratorsDialogModule,
      AsiUserTeamAutocompleteComponentModule,
    ],
    providers: [
      mockProvider(AutocompleteService),
      mockProvider(InteractivityChecker, {
        isFocusable: () => true, // This checks focus trap, set it to true to avoid the warning
      }),
    ],
  });

  const testSetup = (options?: {
    accessLevel?: AccessLevel;
    isReadOnly?: boolean;
    isCollaboratorFormDirty?: boolean;
  }) => {
    const entity = buildSharableEntity(options);
    const backdropClickSubject = new Subject<void>();

    const spectator = createComponent({
      providers: [
        mockProvider(ConfirmDialogService, {
          confirmDiscardChanges: () => EMPTY,
        }),
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            entity,
          },
        },
        mockProvider(MatDialogRef, {
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          close: () => {},
          backdropClick: () => backdropClickSubject,
        }),
      ],
    });

    const component = spectator.component;

    if (options?.isCollaboratorFormDirty) {
      component.collaboratorForm.markAsDirty();
    }

    spectator.detectChanges();
    spectator.detectComponentChanges();

    const dialogRef = spectator.inject(MatDialogRef, true);
    const confirmService = spectator.inject(ConfirmDialogService, true);

    return {
      spectator,
      component,
      backdropClickSubject,
      dialogRef,
      confirmService,
    };
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    const { spectator } = testSetup();

    expect(spectator).toBeTruthy();
  });

  it('should return id on trackByFn', () => {
    const { component } = testSetup();
    const val = { UserId: 5, Role: 'Owner' } as Collaborator;

    const res = component.trackByFn(5, val);

    expect(res).toEqual(`${val.UserId}`);
  });

  describe('Confirm Close Dialog', () => {
    it('should launch on backdrop click', () => {
      const { backdropClickSubject, confirmService } = testSetup({
        isCollaboratorFormDirty: true,
      });
      jest.spyOn(confirmService, 'confirmDiscardChanges');

      backdropClickSubject.next();

      expect(confirmService.confirmDiscardChanges).toHaveBeenCalled();
    });

    it('should not display when nothing to save', () => {
      const { dialogRef, backdropClickSubject } = testSetup();
      jest.spyOn(dialogRef, 'close');

      backdropClickSubject.next();

      expect(dialogRef.close).toHaveBeenCalled();
    });

    it("should close without saving when clicking 'Yes'", () => {
      const { backdropClickSubject, confirmService, dialogRef } = testSetup({
        isCollaboratorFormDirty: true,
      });
      jest.spyOn(dialogRef, 'close');
      jest
        .spyOn(confirmService, 'confirmDiscardChanges')
        .mockReturnValue(of(true));

      backdropClickSubject.next();

      expect(dialogRef.close).toHaveBeenCalled();
    });

    it("Clicking 'No' on the message should take user back to the modal when message displayed upon user making some changes on the modal and tries to navigate away", () => {
      const { backdropClickSubject, confirmService, dialogRef } = testSetup({
        isCollaboratorFormDirty: true,
      });
      jest.spyOn(dialogRef, 'close');
      jest
        .spyOn(confirmService, 'confirmDiscardChanges')
        .mockReturnValue(of(null));

      backdropClickSubject.next();

      expect(dialogRef.close).not.toHaveBeenCalled();
    });
  });

  describe('AccessLevel', () => {
    it('should display all options', () => {
      const { spectator } = testSetup();

      // Assert
      const radioOptions = spectator.queryAll(
        '.content-wrapper > div > cos-radio-button'
      );
      expect(radioOptions[0]).toHaveText('Only the Owner');
      expect(radioOptions[1]).toHaveText('Everyone within your company');
      expect(radioOptions[2]).toHaveText('Selected individuals');
    });

    describe("'Owner'", () => {
      it('should display description', () => {
        const { spectator } = testSetup({
          accessLevel: 'Owner',
        });

        const radioDescriptions = spectator.queryAll(
          '.content-wrapper > div.cos-radio-group > .cos-radio > .cos-radio-label > .cos-radio-label-content > div'
        );
        expect(radioDescriptions[0]).toHaveText(
          'Only the owner and admin can edit and view'
        );
      });

      it('should hide access and collaborators sections.', () => {
        testSetup({
          accessLevel: 'Owner',
        });

        expect('.access-settings-section').not.toExist();
        expect('.results-container').not.toExist();
      });

      it('should not display users and teams autocomplete', () => {
        const { spectator } = testSetup({
          accessLevel: 'Owner',
        });

        const searchBox = spectator.query(
          '.content-wrapper > .results-container asi-user-team-autocomplete'
        );

        expect(searchBox).not.toExist();
      });
    });

    describe("'Everyone'", () => {
      it('should display description', () => {
        const { spectator } = testSetup({
          accessLevel: 'Everyone',
        });

        const radioDescriptions = spectator.queryAll(
          '.content-wrapper > div.cos-radio-group > .cos-radio > .cos-radio-label > .cos-radio-label-content > div'
        );
        expect(radioDescriptions[1]).toHaveText(
          'Anyone in your company can edit or view'
        );
      });

      it('should display allow editing checkbox.', () => {
        const { spectator } = testSetup({
          accessLevel: 'Everyone',
        });

        // Assert
        const checkbox = spectator.query(
          '.content-wrapper > div > .cos-checkbox'
        );
        expect(checkbox).toExist();
        expect(checkbox).toHaveText('Allow editing');

        const checkboxInput = spectator.query('.cos-checkbox-input');
        expect(checkboxInput).toExist();
        expect(checkboxInput.getAttribute('type')).toEqual('checkbox');
      });

      it('should not display users and teams autocomplete', () => {
        const { spectator } = testSetup({
          accessLevel: 'Everyone',
        });

        const searchBox = spectator.query(
          '.content-wrapper > .results-container asi-user-team-autocomplete'
        );

        expect(searchBox).not.toExist();
      });

      it('should set allow editing to checked', () => {
        const { component } = testSetup({
          accessLevel: 'Everyone',
        });

        expect(component.allowEditingForm.value).toBeTruthy();
      });

      it('should set allow editing to unchecked', () => {
        const { component } = testSetup({
          accessLevel: 'Everyone',
          isReadOnly: true,
        });

        expect(component.allowEditingForm.value).toBeFalsy();
      });
    });

    describe("'Custom'", () => {
      it('should display collaborators section with asi-user-team-autocomplete.', () => {
        const { spectator, component } = testSetup({
          accessLevel: 'Custom',
        });

        // Act
        component.collaboratorForm.markAsDirty();

        // Assert
        const searchBox = spectator.query(
          '.content-wrapper > .results-container asi-user-team-autocomplete'
        );

        expect(searchBox).toExist();
        expect(spectator.query('.fa.fa-search')).toExist();
        expect(searchBox.getAttribute('placeholder')).toEqual('Add individual');
      });

      it('should display description', () => {
        const { spectator } = testSetup({
          accessLevel: 'Custom',
        });

        // Assert
        const radioDescriptions = spectator.queryAll(
          '.content-wrapper > div.cos-radio-group > .cos-radio > .cos-radio-label > .cos-radio-label-content > div'
        );
        expect(radioDescriptions[2]).toHaveText(
          'Only people who are selected can edit or view'
        );
      });

      it('should display users and teams autocomplete', () => {
        const { spectator } = testSetup({
          accessLevel: 'Custom',
        });

        const searchBox = spectator.query(
          '.content-wrapper > .results-container asi-user-team-autocomplete'
        );

        expect(searchBox).toExist();
      });

      it('should not be able to remove owner', () => {
        const { spectator } = testSetup({
          accessLevel: 'Custom',
        });

        // component.collaboratorForm.markAsDirty();
        // spectator.detectChanges();
        const collaboratorActionsSection = spectator.queryAll(
          '.collaborator-actions'
        );
        expect(collaboratorActionsSection).not.toExist();
      });

      it('should not be able to remove admin', () => {
        const { spectator } = testSetup({
          accessLevel: 'Custom',
        });

        // component.collaboratorForm.markAsDirty();
        // spectator.detectChanges();
        const collaboratorActionsSection = spectator.queryAll(
          '.collaborator-actions'
        );
        expect(collaboratorActionsSection).not.toExist();
      });

      it('should remove collaborator from access and collaborators', () => {
        // Arrange
        const { component } = testSetup({
          accessLevel: 'Custom',
        });

        const collaborator = {
          UserId: 1,
          AccessLevel: 'Read',
          ImageUrl: '',
          Name: 'Test',
          Role: 'User',
        } as Collaborator;

        component.collaboratorForm.patchValue({
          Collaborators: [collaborator],
          Access: [{ ...collaborator, EntityId: collaborator.UserId }],
        });

        // Act
        component.removeCollaborator(collaborator);

        // Assert
        const form = component.collaboratorForm.value;

        expect(form.Collaborators).toEqual([]);
        expect(form.Access).toEqual([]);
      });
    });
  });

  describe('Save', () => {
    it('should be disabled when the form is pristine', () => {
      const { spectator } = testSetup();

      const saveBtn = spectator.query('.cos-flat-button.cos-primary');
      expect(saveBtn).toExist();
      expect(saveBtn).toHaveText('Save changes');
      expect(saveBtn).toHaveClass('cos-button-disabled');
      expect(saveBtn.getAttribute('disabled')).toBeTruthy();
    });

    it('should be enabled as soon as user make some changes on the modal', () => {
      // Arrange
      const { spectator, component } = testSetup();

      // Act
      component.collaboratorForm.markAsDirty();
      spectator.detectComponentChanges();

      // Assert
      const saveBtn = spectator.query('.cos-flat-button.cos-primary');
      expect(saveBtn).toHaveText('Save changes');
      expect(saveBtn).not.toHaveClass('cos-button-disabled');
      expect(saveBtn.getAttribute('disabled')).toBeFalsy();
    });

    it('should be enabled as soon as user makes change to allowEditing', () => {
      // Arrange
      const { spectator, component } = testSetup();

      // Act
      component.allowEditingForm.markAsDirty();
      spectator.detectComponentChanges();

      // Assert
      const saveBtn = spectator.query('.cos-flat-button.cos-primary');
      expect(saveBtn).toHaveText('Save changes');
      expect(saveBtn).not.toHaveClass('cos-button-disabled');
      expect(saveBtn.getAttribute('disabled')).toBeFalsy();
    });
  });

  it("Owner should be listed by default when user selects 'Selected Teams and Individual Option'", () => {
    const { spectator, component } = testSetup({
      accessLevel: 'Custom',
    });

    const userName = spectator.queryAll(
      'div.collaborator-list-item > .account-item > div > h4'
    );
    expect(userName).toHaveLength(component.collaborators.length);
    expect(userName[1]).toHaveText(component.collaborators[1].Name);
    const roles = spectator.queryAll(
      'div.collaborator-list-item  > .collaborator-role > span'
    );
    expect(roles).toHaveLength(component.collaborators.length);
    expect(roles[0]).toHaveText('Owner');
    expect(roles[0]).toHaveText(component.collaborators[0].Role);
  });

  it('Owner Badge should be displayed next to owner', () => {
    const { spectator, component } = testSetup({
      accessLevel: 'Custom',
    });

    component.collaboratorForm.markAsDirty();
    spectator.detectChanges();
    const roles = spectator.queryAll(
      'div.collaborator-list-item  > .collaborator-role > span'
    );
    expect(roles).toHaveLength(component.collaborators.length);
    expect(roles[0]).toHaveText('Owner');
    expect(roles[0]).toHaveText(component.collaborators[0].Role);
  });

  it('Permissions dropdown should be disabled for an owner', () => {
    const { spectator, component } = testSetup({
      accessLevel: 'Custom',
    });

    component.collaboratorForm.markAsDirty();
    spectator.detectChanges();
    const collaboratorActionsSection = spectator.queryAll(
      '.collaborator-actions'
    );
    expect(collaboratorActionsSection).not.toExist();
  });

  it("Owner should be able to view and edit a collection when 'Selected Teams and Individual' option is selected for a collection", () => {
    const { spectator, component, dialogRef } = testSetup({
      accessLevel: 'Custom',
      isCollaboratorFormDirty: true,
    });
    jest.spyOn(dialogRef, 'close');

    const saveBtn = spectator.query('.cos-flat-button.cos-primary');
    expect(saveBtn).toHaveText('Save changes');
    spectator.click(saveBtn);
    expect(dialogRef.close).toHaveBeenCalledWith(
      component.collaboratorForm.value
    );
  });

  it("User should be able to add admin to the list when 'Selected teams and Individual' option is selected", () => {
    const { spectator, component, dialogRef } = testSetup({
      accessLevel: 'Custom',
      isCollaboratorFormDirty: true,
    });
    jest.spyOn(dialogRef, 'close');

    const saveBtn = spectator.query('.cos-flat-button.cos-primary');
    expect(saveBtn).toHaveText('Save changes');
    spectator.click(saveBtn);
    expect(dialogRef.close).toHaveBeenCalledWith(
      component.collaboratorForm.value
    );
  });

  it('Permissions dropdown should be disabled for an owner (not displayed)', () => {
    const { spectator } = testSetup({
      accessLevel: 'Custom',
      isCollaboratorFormDirty: true,
    });

    const collaboratorActionsSection = spectator.queryAll(
      '.collaborator-actions'
    );
    expect(collaboratorActionsSection).not.toExist();
  });

  it("Admin should be able to view and edit a collection when 'Selected Teams and Individual' option is selected for a collection and Admin is added as an individual", () => {
    const { spectator, component, dialogRef } = testSetup({
      accessLevel: 'Custom',
      isCollaboratorFormDirty: true,
    });
    jest.spyOn(dialogRef, 'close');

    const saveBtn = spectator.query('.cos-flat-button.cos-primary');
    expect(saveBtn).toHaveText('Save changes');
    spectator.click(saveBtn);
    expect(dialogRef.close).toHaveBeenCalledWith(
      component.collaboratorForm.value
    );
  });

  it("User should be able to add non admin users using search when 'Selected Teams and Individual' Option is selected", () => {
    const { spectator, component, dialogRef } = testSetup({
      accessLevel: 'Custom',
    });
    jest.spyOn(dialogRef, 'close');
    component.collaboratorForm.get('Collaborators').setValue([
      {
        UserId: 535278,
        Name: 'testuserr testuserr',
        IsTeam: false,
        Role: 'Owner',
      },
      {
        IsTeam: false,
        Name: 'Alex Klein',
        Role: 'User',
        UserId: 431991,
      },
    ]);
    component.collaboratorForm.markAsDirty();
    spectator.detectComponentChanges();

    const saveBtn = spectator.query('.cos-flat-button.cos-primary');
    expect(saveBtn).toHaveText('Save changes');
    spectator.click(saveBtn);
    expect(dialogRef.close).toHaveBeenCalledWith(
      component.collaboratorForm.value
    );
  });

  describe('mapAccessList', () => {
    it('should set AccessType to Read when allowEditing is set to false', () => {
      // Arrange
      const { component } = testSetup({
        accessLevel: 'Everyone',
      });

      // Act
      component.allowEditingForm.setValue(false);

      // Assert
      const access = (component as any)._presenter.mapAccessList(
        component.collaboratorForm.value
      );

      expect(access[0].AccessType).toEqual('Read');
    });

    it('should set access to ReadWrite in form when allowEditing is set to true', () => {
      // Arrange
      const { component } = testSetup({
        accessLevel: 'Everyone',
        isReadOnly: true,
      });

      // Act
      component.allowEditingForm.setValue(true);

      // Assert
      const access = (component as any)._presenter.mapAccessList(
        component.collaboratorForm.value
      );

      expect(access[0].AccessType).toEqual('ReadWrite');
    });
  });
});
