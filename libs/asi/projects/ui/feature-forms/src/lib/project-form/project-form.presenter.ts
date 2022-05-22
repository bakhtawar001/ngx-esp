import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormBuilder, FormControl, FormGroup } from '@cosmos/forms';
import { ProjectDetailsForm } from '@esp/projects';

@Injectable()
export class AsiProjectFormPresenter {
  static readonly validation = {
    numberOfAssignees: {
      minLength: 0,
      maxLength: 10, // max is 99,999,999
    },
    budget: {
      minLength: 0,
      maxLength: 13, // max '99,999,999.99'
    },
    eventType: {
      maxLength: 50,
    },
    name: {
      maxLength: 50,
    },
  };

  static readonly formErrors = {
    budgetMaxValue: 'You must enter less than 99,999,999.99',
    assigneesMaxValue: 'You must enter less than 99,999,999',
  };

  readonly eventTypes = [
    'Advertising',
    'Award',
    'Celebration',
    'Charity',
    'Client Appreciation',
    'Company Branding',
    'Conference',
    'Education',
    'Employee Appreciation',
    'Event Promotion',
    'Gifts',
    'Golfing',
    'Government',
    'Festival',
    'Fitness',
    'Fundraiser',
    'Mailer',
    'Military',
    'Product Launch',
    'Retreat',
    'Seminar',
    'Sports',
    'Team Building',
    'Trade Show',
    'Union',
    'VIP',
    'Veterans',
  ];

  form!: FormGroup<ProjectDetailsForm>;

  constructor(private readonly formBuilder: FormBuilder) {}

  initForm(data?: Partial<ProjectDetailsForm>): void {
    this.form = this.createForm(data);
  }

  private createForm(data?: Partial<ProjectDetailsForm>): FormGroup {
    const formGroup = this.formBuilder.group({
      Name: new FormControl(data?.Name ?? '', [
        Validators.required,
        Validators.maxLength(AsiProjectFormPresenter.validation.name.maxLength),
      ]),
      EventType: new FormControl(data?.EventType ?? '', [
        Validators.required,
        Validators.maxLength(
          AsiProjectFormPresenter.validation.eventType.maxLength
        ),
      ]),
      InHandsDate: new FormControl(data?.InHandsDate ?? ''),
      EventDate: new FormControl(data?.EventDate ?? ''),
      Budget: new FormControl(data?.Budget, [
        Validators.minLength(
          AsiProjectFormPresenter.validation.budget.minLength
        ),
        Validators.maxLength(
          AsiProjectFormPresenter.validation.budget.maxLength
        ),
      ]),
      NumberOfAssignees: new FormControl(data?.NumberOfAssignees, [
        Validators.minLength(
          AsiProjectFormPresenter.validation.numberOfAssignees.minLength
        ),
        Validators.maxLength(
          AsiProjectFormPresenter.validation.numberOfAssignees.maxLength
        ),
      ]),
      IsInHandsDateFlexible: new FormControl(data?.IsInHandsDateFlexible),
    });

    // @TODO: It's always true because form is initialize with default value.
    // Validate if that default values is required when it has same values as we set in from in case of lack props within data
    if (data && Object.keys(data).length) {
      formGroup.markAsDirty();
    }

    return formGroup;
  }
}
