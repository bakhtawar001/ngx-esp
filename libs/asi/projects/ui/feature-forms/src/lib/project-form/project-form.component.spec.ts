import { fakeAsync } from '@angular/core/testing';
import { MatNativeDateModule } from '@angular/material/core';
import { dataCySelector } from '@cosmos/testing';
import { ProjectDetailsForm } from '@esp/projects';
import { SpectatorElement } from '@ngneat/spectator';
import { createComponentFactory } from '@ngneat/spectator/jest';
import {
  AsiProjectFormComponent,
  AsiProjectFormModule,
} from './project-form.component';
import { AsiProjectFormPresenter } from './project-form.presenter';

const fields = {
  title: dataCySelector('title'),
  titleError: dataCySelector('title-error'),
  eventType: dataCySelector('event-type') + ' input',
  eventTypeOption: '.project-form__event-type-option',
  eventTypeError: dataCySelector('event-type-error'),
  inHandsDate: dataCySelector('in-hands-date'),
  eventDate: dataCySelector('event-date'),
  budget: dataCySelector('budget'),
  budgetError: dataCySelector('budget-error'),
  assignees: dataCySelector('assignees'),
  assigneesError: dataCySelector('assignees-error'),
  dollarSign: dataCySelector('dollar-sign'),
  flexibleCheckbox:
    dataCySelector('flexible-checkbox') + ' .cos-checkbox-input',
  firmCheckbox: dataCySelector('firm-checkbox') + ' .cos-checkbox-input',
};

const fieldLabels = {
  inHandsDate: dataCySelector('in-hands-date-label'),
  eventDate: dataCySelector('event-date-label'),
};

const createComponent = createComponentFactory({
  component: AsiProjectFormComponent,
  imports: [AsiProjectFormModule, MatNativeDateModule],
});

const mockedOptions = {
  IsInHandsDateFlexible: true,
};

const testSetup = (options?: Partial<ProjectDetailsForm>) => {
  const spectator = createComponent({
    props: {
      data: options || mockedOptions,
    },
  });

  return { spectator, component: spectator.component };
};

/* eslint-disable @typescript-eslint/no-non-null-assertion */
describe('AsiProjectFormComponent', () => {
  it('should create', () => {
    const { component } = testSetup();
    expect(component).toBeTruthy();
  });

  describe('Fields validation', () => {
    describe('Project title', () => {
      it('should check if maxlength attribute is set', () => {
        assertMaxLengthAttribute(
          fields.title,
          AsiProjectFormPresenter.validation.name.maxLength
        );
      });

      it('should show "required" error', () => {
        assertFieldRequired('Name', fields.title, fields.titleError);
      });
    });

    describe('Event type', () => {
      it('should check if maxlength attribute is set', () => {
        assertMaxLengthAttribute(
          fields.eventType,
          AsiProjectFormPresenter.validation.name.maxLength
        );
      });

      it('should show "required" error', () => {
        assertFieldRequired(
          'EventType',
          fields.eventType,
          fields.eventTypeError
        );
      });
    });

    describe('In-hands date', () => {
      it('should not show "required" error', () => {
        assertFieldNotRequired('InHandsDate', fields.inHandsDate);
      });

      it('should have `Select a date` placeholder', () => {
        const { spectator } = testSetup();

        expect(
          spectator.query(fields.inHandsDate)?.getAttribute('placeholder')
        ).toEqual('Select a date');
      });

      describe('Firm and Flexible checkboxes', () => {
        it('Should have not checked checkboxes by default', () => {
          const { spectator } = testSetup({
            ...mockedOptions,
            IsInHandsDateFlexible: undefined,
          });

          expect(spectator.query(fields.flexibleCheckbox)).toHaveProperty(
            'checked',
            false
          );

          expect(spectator.query(fields.firmCheckbox)).toHaveProperty(
            'checked',
            false
          );
        });

        it('Should allow only one checkbox checked at once', () => {
          const { spectator } = testSetup({
            ...mockedOptions,
            IsInHandsDateFlexible: true,
          });

          expect(spectator.query(fields.flexibleCheckbox)).toHaveProperty(
            'checked',
            true
          );

          expect(spectator.query(fields.firmCheckbox)).toHaveProperty(
            'checked',
            false
          );

          spectator.click(fields.firmCheckbox);

          expect(spectator.query(fields.flexibleCheckbox)).toHaveProperty(
            'checked',
            false
          );

          expect(spectator.query(fields.firmCheckbox)).toHaveProperty(
            'checked',
            true
          );
        });
      });

      it('Should allow to unselect both checkboxes', () => {
        const { spectator } = testSetup({
          ...mockedOptions,
          IsInHandsDateFlexible: true,
        });

        expect(spectator.query(fields.flexibleCheckbox)).toHaveProperty(
          'checked',
          true
        );

        expect(spectator.query(fields.firmCheckbox)).toHaveProperty(
          'checked',
          false
        );

        spectator.click(fields.flexibleCheckbox);

        expect(spectator.query(fields.flexibleCheckbox)).toHaveProperty(
          'checked',
          false
        );

        expect(spectator.query(fields.firmCheckbox)).toHaveProperty(
          'checked',
          false
        );
      });
    });

    describe('Event date', () => {
      it('should not show "required" error', () => {
        assertFieldNotRequired('EventDate', fields.eventDate);
      });

      it('should have `Select a date` placeholder', () => {
        const { spectator } = testSetup();

        expect(
          spectator.query(fields.eventDate)?.getAttribute('placeholder')
        ).toEqual('Select a date');
      });
    });

    describe('Budget', () => {
      it('should not show "required" error', () => {
        assertFieldNotRequired('Budget', fields.budget);
      });

      it('should have maxlength set', () => {
        assertMaxLengthAttribute(
          fields.budget,
          AsiProjectFormPresenter.validation.budget.maxLength
        );
      });

      describe('$ symbol on budget field', () => {
        it('should hide $ symbol when input is focused', () => {
          const { spectator } = testSetup();
          const field = spectator.query(fields.budget) as SpectatorElement;

          spectator.focus(field);

          expect(spectator.query(fields.dollarSign)).toHaveAttribute('hidden');
        });

        it('should show $ symbol when input is not focused', () => {
          const { spectator } = testSetup();
          const field = spectator.query(fields.budget) as SpectatorElement;

          spectator.focus(field);
          spectator.blur(field);

          expect(spectator.query(fields.dollarSign)).not.toHaveAttribute(
            'hidden'
          );
        });
      });

      it('should convert typed `99999999` to `99,999,999.00`', fakeAsync(() => {
        const { spectator, component } = testSetup();
        const field = spectator.query(fields.budget) as SpectatorElement;

        spectator.typeInElement('99999999', field);
        spectator.blur(field);
        spectator.tick(250);

        expect(component.presenter.form.get('Budget')?.value).toEqual(
          '99,999,999.00'
        );
      }));

      it('should allow only two decimals', fakeAsync(() => {
        const { spectator, component } = testSetup();
        const field = spectator.query(fields.budget) as SpectatorElement;

        spectator.typeInElement('99999999.111', field);
        spectator.blur(field);
        spectator.tick(250);

        expect(component.presenter.form.get('Budget')?.value).toEqual(
          '99,999,999.11'
        );
      }));

      it('should not allow minus', fakeAsync(() => {
        const { spectator, component } = testSetup();
        const field = spectator.query(fields.budget) as SpectatorElement;

        spectator.typeInElement('-99999999', field);
        spectator.blur(field);
        spectator.tick(250);

        expect(component.presenter.form.get('Budget')?.value).toEqual(
          '99,999,999.00'
        );
      }));
    });

    describe('Assignees', () => {
      it('should have maxlength set', () => {
        assertMaxLengthAttribute(
          fields.assignees,
          AsiProjectFormPresenter.validation.numberOfAssignees.maxLength
        );
      });

      it('should not show "required" error', () => {
        assertFieldNotRequired('NumberOfAssignees', fields.assignees);
      });

      it('should convert typed `99999999` to `99,999,999`', fakeAsync(() => {
        const { spectator, component } = testSetup();
        const field = spectator.query(fields.assignees) as SpectatorElement;

        spectator.typeInElement('99999999', field);
        spectator.blur(field);
        spectator.tick(250);

        expect(
          component.presenter.form.get('NumberOfAssignees')?.value
        ).toEqual('99,999,999');
      }));

      it('should not allow decimals', fakeAsync(() => {
        const { spectator, component } = testSetup();
        const field = spectator.query(fields.assignees) as SpectatorElement;

        spectator.typeInElement('99999999.11', field);
        spectator.blur(field);
        spectator.tick(250);

        expect(
          component.presenter.form.get('NumberOfAssignees')?.value
        ).toEqual('99,999,999');
      }));

      it('should not allow minus', fakeAsync(() => {
        const { spectator, component } = testSetup();
        const field = spectator.query(fields.assignees);

        spectator.typeInElement('-99999999', field as SpectatorElement);
        spectator.blur(field as SpectatorElement);
        spectator.tick(250);

        expect(
          component.presenter.form.get('NumberOfAssignees')?.value
        ).toEqual('99,999,999');
      }));
    });
  });

  describe('Event Type field input', () => {
    it('should be possible to select one of predefined options', () => {
      const { spectator, component } = testSetup();
      const eventTypeField = spectator.query(fields.eventType);
      const queryOptions = () => spectator.queryAll(fields.eventTypeOption);

      spectator.typeInElement('', eventTypeField as SpectatorElement);

      expect(queryOptions().length).toBeGreaterThan(0);

      const selectedOption = spectator.queryAll(fields.eventTypeOption)[0];

      spectator.click(selectedOption);

      expect(queryOptions().length).toBe(0);

      expect(component.presenter.form.controls.EventType?.value).toBe(
        component.presenter.eventTypes[0]
      );
    });

    it('should be possible to type custom option', () => {
      const { spectator, component } = testSetup();
      component.presenter.form.controls.EventType.setValue('test');
      const eventTypeField = spectator.query(
        fields.eventType
      ) as SpectatorElement;

      spectator.blur(eventTypeField);

      expect(component.presenter.form.controls.EventType.value).toBe('test');
    });
  });

  describe('Form header', () => {
    it('should contain text "Project Details"', () => {
      const { spectator } = testSetup();
      expect(
        (
          spectator.query('.project-form__details-header') as Element
        ).textContent?.trim()
      ).toEqual('Project Details');
    });
  });

  describe('In-Hands Date field', () => {
    it('should contain label', () => {
      assertFieldHasLabel(fieldLabels.inHandsDate);
    });

    it("should have placeholder as 'Select a date'", () => {
      const { spectator } = testSetup();
      const placeholder = spectator
        .query(fields.inHandsDate)
        .getAttribute('placeholder');

      expect(placeholder).toEqual('Select a date');
    });

    it('label should be capitalized', () => {
      assertFieldLabelCapitalized(fieldLabels.inHandsDate, 'In-Hands Date');
    });
  });

  describe('Event Date field', () => {
    it('should contain label', () => {
      assertFieldHasLabel(fieldLabels.eventDate);
    });

    it("should have placeholder as 'Select a date'", () => {
      const { spectator } = testSetup();
      const placeholder = spectator
        .query(fields.eventDate)
        .getAttribute('placeholder');

      expect(placeholder).toEqual('Select a date');
    });

    it('label should be capitalized', () => {
      assertFieldLabelCapitalized(fieldLabels.eventDate, 'Event Date');
    });
  });
});

function assertFieldRequired(
  fieldName: string,
  fieldSelector: string,
  fieldErrorSelector: string
): void {
  const { spectator, component } = testSetup();
  const field = spectator.query(fieldSelector) as SpectatorElement;

  spectator.focus(field);
  spectator.blur(field);

  expect(component.presenter.form.valid).toBeFalsy();
  expect(component.presenter.form.get(fieldName)?.errors).toEqual({
    required: true,
  });
}

function assertFieldNotRequired(
  fieldName: string,
  fieldSelector: string
): void {
  const { spectator, component } = testSetup({
    Name: 'test',
    EventType: 'test',
  });
  const field = spectator.query(fieldSelector) as SpectatorElement;

  spectator.focus(field);
  spectator.blur(field);

  expect(component.presenter.form.valid).toBeTruthy();
  expect(component.presenter.form.get(fieldName)?.errors).toBe(null);
}

function assertMaxLengthAttribute(
  fieldSelector: string,
  maxLength: number
): void {
  const { spectator } = testSetup();
  const field = spectator.query(fieldSelector) as Element;

  expect(Number(field.getAttribute('maxlength'))).toEqual(maxLength);
}

function assertFieldHasLabel(fieldLabelSelector: string): void {
  const { spectator } = testSetup();
  const label = spectator.query(fieldLabelSelector);
  expect(label).toBeTruthy();
}

function assertFieldLabelCapitalized(
  fieldLabelSelector: string,
  labelValue: string
): void {
  const { spectator } = testSetup();
  const label = spectator.query(fieldLabelSelector) as Element;
  expect(label.textContent?.trim()).toEqual(labelValue);
}
