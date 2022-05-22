import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  AsiProjectFormComponent,
  AsiProjectFormModule,
} from '@asi/projects/ui/feature-forms';
import { dataCySelector } from '@cosmos/testing';
import { ProjectDetailsForm } from '@esp/projects';
import { createComponentFactory } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { MockComponents, MockModule, MockProvider } from 'ng-mocks';
import { EMPTY } from 'rxjs';
import {
  ProjectDetailsCreateDialog,
  ProjectDetailsCreateDialogModule,
} from './project-details-create.dialog';

const buttons = {
  cancel: dataCySelector('cancel-button'),
  submit: dataCySelector('submit-button'),
};

const dialog = {
  header: dataCySelector('dialog-header'),
  subHeader: dataCySelector('dialog-sub-header'),
};

const createComponent = createComponentFactory({
  component: ProjectDetailsCreateDialog,
  imports: [
    ProjectDetailsCreateDialogModule,
    MockModule(MatDialogModule),
    NgxsModule.forRoot(),
  ],
  overrideModules: [
    [
      AsiProjectFormModule,
      {
        set: {
          declarations: MockComponents(AsiProjectFormComponent),
          exports: MockComponents(AsiProjectFormComponent),
        },
      },
    ],
  ],
  providers: [
    MockProvider(MatDialogRef, {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      close: () => {},
      afterOpened: () => EMPTY,
      backdropClick: () => EMPTY,
    }),
  ],
});

const testSetup = (options?: {
  data?: ProjectDetailsForm;
  canGoPrevious?: boolean;
  formValid?: boolean;
  formDirty?: boolean;
}) => {
  const spectator = createComponent({
    providers: [
      {
        provide: MAT_DIALOG_DATA,
        useValue: {
          input: options?.data ? options.data : {},
          step: {
            canGoPrevious: () =>
              options?.canGoPrevious !== undefined
                ? options.canGoPrevious
                : true,
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            markAsDirty: () => {},
          },
        },
      },
    ],
  });

  if (options?.formValid) {
    spectator.component.status = {
      ...spectator.component.status,
      valid: options.formValid,
    };
  }

  if (options?.formDirty) {
    spectator.component.status = {
      ...spectator.component.status,
      dirty: options.formDirty,
    };
  }

  spectator.detectComponentChanges();

  return {
    spectator,
    component: spectator.component,
    dialogRef: spectator.inject(MatDialogRef, true),
  };
};

describe('ProjectDetailsCreateDialog', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    // Arrange
    const { spectator } = testSetup();

    // Assert
    expect(spectator).toBeTruthy();
  });

  it('should show New Presentation title', () => {
    // Arrange
    const { spectator } = testSetup();
    const presentationTitle = spectator.query('.project-creation-heading');

    // Assert
    expect(presentationTitle).toBeVisible();
    expect(presentationTitle).toHaveText('New Presentation');
  });

  it('should show helper text', () => {
    // Arrange
    const { spectator } = testSetup();
    const helperText = spectator.query('.body-style-14');

    // Assert
    expect(helperText).toBeVisible();
    expect(helperText).toHaveText(
      'Presentations live within projects and share the same name. Projects are a way to organize all of the things you share with your customer and your vendors.'
    );
  });

  describe('Dialog header', () => {
    it('should contain a valid title', () => {
      // Arrange
      const { spectator } = testSetup();

      // Assert
      expect(spectator.query(dialog.header).textContent).toEqual(
        'Create a New Presentation'
      );
    });

    it('should contain a valid subtitle', () => {
      // Arrange
      const { spectator } = testSetup();

      // Assert
      expect(spectator.query(dialog.subHeader).textContent.trim()).toEqual(
        'Enter your presentation details.'
      );
    });
  });

  describe('Cancel button', () => {
    it('should not be disabled', () => {
      // Arrange
      const { spectator } = testSetup();

      // Assert
      expect(spectator.query(buttons.cancel)).not.toHaveAttribute('disabled');
    });

    it('should not be hidden if can go previous', () => {
      // Arrange
      const { spectator } = testSetup({ canGoPrevious: true });

      // Assert
      expect(spectator.query(buttons.cancel)).toHaveProperty('hidden', false);
    });

    it('should be hidden if can not go previous', () => {
      // Arrange
      const { spectator } = testSetup({ canGoPrevious: false });

      // Assert
      expect(spectator.query(buttons.cancel)).toHaveProperty('hidden', true);
    });

    it('should close dialog on click', () => {
      // Arrange
      const { spectator, dialogRef } = testSetup();
      jest.spyOn(dialogRef, 'close');

      // Act
      spectator.click(spectator.query(buttons.cancel));

      // Assert
      expect(dialogRef.close).toHaveBeenCalled();
    });

    it('should pass dialog data on close', () => {
      // Arrange
      const data = {} as any;
      const { spectator, dialogRef } = testSetup({ data });
      jest.spyOn(dialogRef, 'close');

      // Act
      spectator.click(spectator.query(buttons.cancel));

      // Assert
      expect(dialogRef.close).toHaveBeenCalledWith({
        data: data,
        action: 'previous',
      });
    });
  });

  describe('Submit button', () => {
    it('should be disabled if form is invalid', () => {
      // Arrange
      const { spectator } = testSetup({ formValid: false });

      // Assert
      expect(spectator.query(buttons.submit)).toHaveProperty('disabled', true);
    });

    it('should be disabled if form is not dirty', () => {
      // Arrange
      const { spectator } = testSetup({ formDirty: false });

      // Assert
      expect(spectator.query(buttons.submit)).toHaveProperty('disabled', true);
    });

    it('should be enabled if form is valid and is dirty', () => {
      // Arrange
      const { spectator } = testSetup({ formValid: true, formDirty: true });

      // Assert
      expect(spectator.query(buttons.submit)).toHaveProperty('disabled', false);
    });

    it('should close dialog on click', () => {
      // Arrange
      const { spectator, dialogRef } = testSetup({
        formValid: true,
        formDirty: true,
      });
      jest.spyOn(dialogRef, 'close');

      // Act
      spectator.click(spectator.query(buttons.submit));

      // Assert
      expect(dialogRef.close).toHaveBeenCalled();
    });

    it('should pass dialog data on close', () => {
      // Arrange
      const data = {} as any;
      const { spectator, dialogRef } = testSetup({
        data,
        formValid: true,
        formDirty: true,
      });
      jest.spyOn(dialogRef, 'close');

      // Act
      spectator.click(spectator.query(buttons.submit));

      // Assert
      expect(dialogRef.close).toHaveBeenCalledWith({
        data: data,
        action: 'next',
      });
    });
  });
});
