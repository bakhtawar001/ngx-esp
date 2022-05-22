import { MatNativeDateModule } from '@angular/material/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  AsiProjectCreateCustomerFormComponent,
  AsiProjectCreateCustomerFormModule,
} from '@asi/projects/ui/feature-forms';
import { dataCySelector } from '@cosmos/testing';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockComponent, MockModule, MockProvider } from 'ng-mocks';
import {
  ProjectCreateWithNewCustomerDialog,
  ProjectCreateWithNewCustomerDialogModule,
} from './project-create-with-new-customer.dialog';

const dialog = {
  title: dataCySelector('dialog-header'),
  subTitle: dataCySelector('dialog-sub-header'),
  formHeader: dataCySelector('create-customer-form-header'),
  backButton: dataCySelector('back-button'),
  nextButton: dataCySelector('next-button'),
  submitButton: dataCySelector('submit-button'),
};
const stepTracker = {
  activeStep: '.cos-tracker-step.completed',
  firstStep: dataCySelector('first-step'),
  firstStepText: dataCySelector('customer-information-label'),
  secondStep: dataCySelector('second-step'),
  secondStepText: dataCySelector('project-details-label'),
};

describe('ProjectCreateCustomerDialog', () => {
  let spectator: Spectator<ProjectCreateWithNewCustomerDialog>;
  let component: ProjectCreateWithNewCustomerDialog;

  const createComponent = createComponentFactory({
    component: ProjectCreateWithNewCustomerDialog,
    imports: [
      ProjectCreateWithNewCustomerDialogModule,
      MatNativeDateModule,
      MockModule(MatDialogModule),
    ],
    providers: [MockProvider(MatDialogRef)],
    overrideModules: [
      [
        AsiProjectCreateCustomerFormModule,
        {
          set: {
            declarations: [
              MockComponent(AsiProjectCreateCustomerFormComponent),
            ],
            exports: [MockComponent(AsiProjectCreateCustomerFormComponent)],
          },
        },
      ],
    ],
  });

  const testSetup = (options?: {
    canGoPrevious?: boolean;
    currentStep?: number;
    formValid?: boolean;
    formDirty?: boolean;
  }) => {
    spectator = createComponent({
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            input: {
              customer: {},
              project: {},
            },
            step: {
              canGoPrevious: () =>
                options?.canGoPrevious !== undefined
                  ? options.canGoPrevious
                  : true,
            },
          },
        },
      ],
    });
    component = spectator.component;

    if (options?.currentStep) {
      component.currentStep = options.currentStep;
    }

    if (options?.formValid) {
      component.customerFormStatus = {
        ...(component.customerFormStatus || {}),
        valid: options.formValid,
      } as any;
    }

    if (options?.formDirty) {
      component.customerFormStatus = {
        ...(component.customerFormStatus || {}),
        dirty: options.formDirty,
      } as any;
    }

    spectator.detectChanges();
    spectator.detectComponentChanges();

    return { component, spectator };
  };

  it('should create', () => {
    const { component } = testSetup();
    expect(component).toBeTruthy();
  });

  describe('Header', () => {
    it('should display title', () => {
      const { spectator } = testSetup();
      const title = spectator.query(dialog.title);

      expect(title).toBeTruthy();
      expect(title.textContent.trim()).toEqual(
        'Create a New Presentation for a New Customer'
      );
    });
  });

  describe('Subheader', () => {
    it('should display subtitle', () => {
      const { spectator } = testSetup();
      const subTitle = spectator.query(dialog.subTitle);

      expect(subTitle).toBeTruthy();
      expect(subTitle.textContent.trim()).toEqual(
        'Enter your presentation details.'
      );
    });
  });

  describe('Step tracker', () => {
    it('should display step 1', () => {
      const { spectator } = testSetup();
      const firstStep = spectator.query(stepTracker.firstStep);
      const firstStepText = spectator.query(stepTracker.firstStepText);

      expect(firstStep).toBeTruthy();
      expect(firstStep.textContent.trim()).toEqual('1');
      expect(firstStepText).toBeTruthy();
      expect(firstStepText.textContent.trim()).toEqual('Customer Information');
    });

    it('should mark step 1 as active when it is active', () => {
      const { spectator, component } = testSetup();
      component.currentStep = 1;
      spectator.detectComponentChanges();

      expect(
        spectator.query(stepTracker.firstStepText).classList
      ).not.toContain('body-style-14-shark');
      expect(spectator.query(stepTracker.secondStepText).classList).toContain(
        'body-style-14-shark'
      );
    });

    it('should mark step 1 as a check, when step 2 is active', () => {
      const { component, spectator } = testSetup();
      component.currentStep = 2;
      spectator.detectComponentChanges();
      const step1 = spectator.query(stepTracker.firstStep);
      const step1Icon = spectator.query(stepTracker.firstStep).children[0];

      expect(step1).toHaveDescendant(step1Icon);
      expect(step1Icon.tagName).toBe('I');
      expect(step1Icon).toHaveClass('fa fa-check cos-text--white');
    });

    it('should display step 2', () => {
      const { spectator } = testSetup();
      const secondStep = spectator.query(stepTracker.secondStep);
      const secondStepText = spectator.query(stepTracker.secondStepText);

      expect(secondStep).toBeTruthy();
      expect(secondStep.textContent.trim()).toEqual('2');
      expect(secondStepText).toBeTruthy();
      expect(secondStepText.textContent.trim()).toEqual('Project Details');
    });

    it('should mark step 2 as active when it is active', () => {
      const { spectator, component } = testSetup();
      component.currentStep = 2;
      spectator.detectComponentChanges();

      expect(spectator.query(stepTracker.firstStepText).classList).toContain(
        'body-style-14-shark'
      );
      expect(
        spectator.query(stepTracker.secondStepText).classList
      ).not.toContain('body-style-14-shark');
    });
  });

  describe('Create Customer Form', () => {
    it('should display header', () => {
      const { spectator } = testSetup();
      expect(spectator.query(dialog.formHeader)).toBeTruthy();
      expect(spectator.query(dialog.formHeader).textContent.trim()).toEqual(
        'This customer and contact will appear in your directory where you can add or update additional details.'
      );
    });
  });

  describe('Back button', () => {
    it('should be hidden if can not go back', () => {
      const { spectator } = testSetup({ canGoPrevious: false });
      expect(spectator.query(dialog.backButton)).toHaveProperty('hidden', true);
    });

    it('should not be hidden if can go back', () => {
      const { spectator } = testSetup({ canGoPrevious: true });
      expect(spectator.query(dialog.backButton)).toHaveProperty(
        'hidden',
        false
      );
    });

    it('should close dialog if current step is first one', () => {
      const { spectator } = testSetup({ currentStep: 1 });
      const dialogRef = spectator.inject(MatDialogRef, true);
      jest.spyOn(dialogRef, 'close');

      spectator.click(dialog.backButton);
      spectator.detectChanges();

      expect(dialogRef.close).toHaveBeenCalled();
    });

    it('should go to previous step if current step is not first one', () => {
      const { spectator, component } = testSetup({ currentStep: 2 });

      spectator.click(dialog.backButton);
      spectator.detectChanges();

      expect(component.currentStep).toBe(1);
    });
  });

  describe('Next button', () => {
    it('should be visible if current step is first one', () => {
      const { spectator } = testSetup({ currentStep: 1 });
      expect(spectator.query(dialog.nextButton)).toBeTruthy();
    });

    it('should be disabled if form is invalid', () => {
      const { spectator } = testSetup({
        currentStep: 1,
        formValid: false,
      });

      expect(spectator.query(dialog.nextButton)).toHaveProperty(
        'disabled',
        true
      );
    });

    it('should be disabled if form is dirty', () => {
      const { spectator } = testSetup({
        currentStep: 1,
        formDirty: false,
      });

      expect(spectator.query(dialog.nextButton)).toHaveProperty(
        'disabled',
        true
      );
    });

    it('should be enabled if form is valid and dirty', () => {
      const { spectator } = testSetup({
        currentStep: 1,
        formValid: true,
        formDirty: true,
      });

      expect(spectator.query(dialog.nextButton)).toHaveProperty(
        'disabled',
        false
      );
    });

    it('should go to next step if current step is first one', () => {
      const { spectator, component } = testSetup({
        currentStep: 1,
        formValid: true,
        formDirty: true,
      });

      spectator.click(dialog.nextButton);
      spectator.detectChanges();

      expect(component.currentStep).toBe(2);
    });

    it('should not be visible if current step is not first one', () => {
      const { spectator } = testSetup({ currentStep: 2 });
      expect(spectator.query(dialog.nextButton)).toBeFalsy();
    });
  });

  describe('Submit button', () => {
    it('should be visible if current step is not first one', () => {
      const { spectator } = testSetup({ currentStep: 2 });
      expect(spectator.query(dialog.submitButton)).toBeTruthy();
    });

    it('should not be visible if current step is first one', () => {
      const { spectator } = testSetup({ currentStep: 1 });
      expect(spectator.query(dialog.submitButton)).toBeFalsy();
    });
  });
});
