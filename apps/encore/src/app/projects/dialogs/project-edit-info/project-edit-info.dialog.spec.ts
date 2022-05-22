import { fakeAsync } from '@angular/core/testing';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialogService } from '@asi/ui/feature-core';
import { dataCySelector } from '@cosmos/testing';
import { Project } from '@esp/models';
import { ProjectActions } from '@esp/projects';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { NgxsModule, Store } from '@ngxs/store';
import { MockProvider } from 'ng-mocks';
import { EMPTY, of } from 'rxjs';
import {
  ProjectEditInfoDialog,
  ProjectEditInfoDialogModule,
} from './project-edit-info.dialog';

let spectator: Spectator<ProjectEditInfoDialog>;
let component: ProjectEditInfoDialog;

const header = dataCySelector('dialog-header');
const actionButtons = {
  back: dataCySelector('back-button'),
  submit: dataCySelector('submit-button'),
};

const createComponent = createComponentFactory({
  component: ProjectEditInfoDialog,
  imports: [
    ProjectEditInfoDialogModule,
    MatNativeDateModule,
    NgxsModule.forRoot(),
  ],
  providers: [
    MockProvider(MatDialogRef, {
      backdropClick: () => EMPTY,
    }),
  ],
});

const testSetup = (options?: {
  project?: Partial<Project>;
  confirmResult?: boolean;
  formDirty?: boolean;
  formValid?: boolean;
}) => {
  spectator = createComponent({
    providers: [
      {
        provide: MAT_DIALOG_DATA,
        useValue:
          options?.project !== undefined ? options.project : ({} as any),
      },
      MockProvider(ConfirmDialogService, {
        confirmDiscardChanges: () =>
          of(
            options?.confirmResult !== undefined ? options.confirmResult : false
          ),
      }),
    ],
  });
  component = spectator.component;

  if (options?.formDirty !== undefined) {
    component.formStatus = {
      ...component.formStatus,
      dirty: options.formDirty,
    };
  }

  if (options?.formValid !== undefined) {
    component.formStatus = {
      ...component.formStatus,
      valid: options.formValid,
    };
  }

  spectator.detectComponentChanges();

  return { component, spectator };
};

describe('ProjectEditInfoDialog', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    // Arrange
    const { spectator } = testSetup();

    // Assert
    expect(spectator).toBeTruthy();
  });

  describe('Header', () => {
    it('should contain text', () => {
      // Arrange
      const { spectator } = testSetup();

      // Assert
      expect(spectator.query(header).textContent.trim()).toEqual(
        'Edit Project Information'
      );
    });
  });

  describe('Back button', () => {
    it('should close dialog if not dirty', () => {
      // Arrange
      const { spectator } = testSetup({ formDirty: false });
      const dialogRef = spectator.inject(MatDialogRef, true);
      jest.spyOn(dialogRef, 'close');
      const confirmService = spectator.inject(ConfirmDialogService, true);
      jest.spyOn(confirmService, 'confirmDiscardChanges');

      // Act
      spectator.click(actionButtons.back);

      // Assert
      expect(dialogRef.close).toHaveBeenCalled();
      expect(confirmService.confirmDiscardChanges).not.toHaveBeenCalled();
    });

    it('should open confirm dialog if dirty', () => {
      // Arrange
      const { spectator } = testSetup({ formDirty: true });
      const dialogRef = spectator.inject(MatDialogRef, true);
      jest.spyOn(dialogRef, 'close');
      const confirmService = spectator.inject(ConfirmDialogService, true);
      jest.spyOn(confirmService, 'confirmDiscardChanges');

      // Act
      spectator.click(actionButtons.back);

      // Assert
      expect(dialogRef.close).not.toHaveBeenCalled();
      expect(confirmService.confirmDiscardChanges).toHaveBeenCalled();
    });

    it('should close dialog after confirm when dirty', fakeAsync(() => {
      // Arrange
      const { spectator } = testSetup({ confirmResult: true, formDirty: true });
      const dialogRef = spectator.inject(MatDialogRef, true);
      jest.spyOn(dialogRef, 'close');

      // Act
      spectator.click(actionButtons.back);
      spectator.tick();

      // Assert
      expect(dialogRef.close).toHaveBeenCalled();
    }));

    it('should not close dialog after not confirm when dirty', fakeAsync(() => {
      // Arrange
      const { spectator } = testSetup({
        confirmResult: false,
        formDirty: true,
      });
      const dialogRef = spectator.inject(MatDialogRef, true);
      jest.spyOn(dialogRef, 'close');

      // Act
      spectator.click(actionButtons.back);
      spectator.tick();

      // Assert
      expect(dialogRef.close).not.toHaveBeenCalled();
    }));
  });

  describe('Submit button', () => {
    it('should be disabled if form invalid', () => {
      // Arrange
      const { spectator } = testSetup({ formValid: false });

      // Assert
      expect(spectator.query(actionButtons.submit)).toHaveProperty(
        'disabled',
        true
      );
    });

    it('should be disabled if form not dirty', () => {
      // Arrange
      const { spectator } = testSetup({ formDirty: false });

      // Assert
      expect(spectator.query(actionButtons.submit)).toHaveProperty(
        'disabled',
        true
      );
    });

    it('should be enabled if form valid and dirty', () => {
      // Arrange
      const { spectator } = testSetup({ formDirty: true, formValid: true });

      // Assert
      expect(spectator.query(actionButtons.submit)).toHaveProperty(
        'disabled',
        false
      );
    });

    it('should update the project', () => {
      // Arrange
      const { spectator } = testSetup({ formValid: true });
      const store = spectator.inject(Store, true);
      jest.spyOn(store, 'dispatch').mockImplementation();

      // Act
      spectator.click(actionButtons.submit);

      // Assert
      expect(store.dispatch).toHaveBeenCalledWith(
        new ProjectActions.Update({
          Budget: null,
          CreateDate: undefined,
          Customer: undefined,
          EventDate: null,
          EventType: null,
          Id: undefined,
          InHandsDate: null,
          Name: null,
          NumberOfAssignees: null,
          IsInHandsDateFlexible: null,
        })
      );
    });

    it('should close dialog', () => {
      // Arrange
      const { spectator } = testSetup({ formValid: true });
      const dialogRef = spectator.inject(MatDialogRef, true);
      jest.spyOn(dialogRef, 'close');

      // Act
      spectator.click(actionButtons.submit);

      // Assert
      expect(dialogRef.close).toHaveBeenCalled();
    });
  });
});
