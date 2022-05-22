import { Injectable } from '@angular/core';
import { ValidatorFn } from '@angular/forms';
import { DateRange } from '@angular/material/datepicker';
import { AbstractControl, FormBuilder, FormGroup } from '@cosmos/forms';
import { ProjectSearchFilters } from '@esp/projects';
import { FiltersForm, SearchTermControl } from '../../types';
import { FilterPill } from '@asi/ui/feature-filters';

@Injectable()
export class ProjectSearchFiltersPresenter {
  readonly labels = {
    owner: 'Record Owner',
    ownerWithCounter: 'Owner',
    stepName: 'Project Phase',
    stepNameWithCounter: 'Phase',
    inHandsDate: 'In-Hand Date',
    eventDate: 'Event Date',
  };
  labelsWithCounter = {
    owner: this.labels.owner,
    stepName: this.labels.stepName,
  };

  form!: FormGroup<FiltersForm>;
  formDefaultValue: FiltersForm = {
    InHandsDate: new DateRange<Date>(null, null),
    EventDate: new DateRange<Date>(null, null),
    OwnersSearchTerm: '',
    Owners: { terms: [] },
    StepNameSearchTerm: '',
    StepName: { terms: [] },
  };
  filterFormControls = {
    OwnersSearchTerm: 'OwnersSearchTerm' as SearchTermControl,
    OwnerTerms: 'Owners.terms',
    StepNameSearchTerm: 'StepNameSearchTerm' as SearchTermControl,
    StepNameTerms: 'StepName.terms',
    InHandsDate: 'InHandsDate',
    EventDate: 'EventDate',
    Owner: 'Owners',
    StepName: 'StepName',
  };

  constructor(private _fb: FormBuilder) {}

  initForm(data?: Partial<FiltersForm>): void {
    this.form = this.createFilterForm(data);
  }

  createFilterForm(data?: FiltersForm): FormGroup {
    const form = this._fb.group({
      InHandsDate: [
        {
          start: data?.InHandsDate.start || '',
          end: data?.InHandsDate.end || '',
        },
        [
          this.comparison('end', (From, To) => {
            return (
              !From?.toString().length ||
              !To?.toString().length ||
              From?.getTime() <= To?.getTime()
            );
          }),
        ],
      ],
      EventDate: [
        {
          start: data?.EventDate.start || '',
          end: data?.EventDate.end || '',
        },
        [
          this.comparison('end', (From, To) => {
            return (
              !From?.toString().length ||
              !To?.toString().length ||
              From?.getTime() <= To?.getTime()
            );
          }),
        ],
      ],
      OwnersSearchTerm: [''],
      Owners: this._fb.group({
        terms: [[...(data.Owners.terms || '')]],
      }),
      StepNameSearchTerm: [''],
      StepName: this._fb.group({
        terms: [[...(data.StepName.terms || '')]],
      }),
    });

    return form;
  }

  resetFilterForm(): void {
    this.form.reset(this.formDefaultValue);
  }

  mapFiltersFormToSearchCriteriaFilters(): ProjectSearchFilters {
    const formValue = this.form.value;
    const filters = {};

    if (formValue) {
      if (formValue.EventDate?.start && formValue.EventDate?.end) {
        Object.assign(filters, {
          EventDate: {
            terms: [
              formValue.EventDate.start.toISOString(),
              formValue.EventDate.end.toISOString(),
            ],
            behavior: 'Any',
          },
        });
      }

      if (formValue.InHandsDate?.start && formValue.InHandsDate?.end) {
        Object.assign(filters, {
          InHandsDate: {
            terms: [
              formValue.InHandsDate.start.toISOString(),
              formValue.InHandsDate.end.toISOString(),
            ],
            behavior: 'Any',
          },
        });
      }

      if (formValue.Owners?.terms?.length) {
        Object.assign(filters, {
          Owners: { ...formValue.Owners, behavior: 'Any' },
        });
      }

      if (formValue.StepName?.terms?.length) {
        Object.assign(filters, {
          StepName: { ...formValue.StepName, behavior: 'Any' },
        });
      }
    }

    return filters;
  }

  mapFiltersToForm(filters: ProjectSearchFilters): FiltersForm {
    if (!filters) {
      return {};
    }

    return {
      ...filters,
      InHandsDate:
        filters.InHandsDate && filters.InHandsDate?.terms.length
          ? new DateRange<Date>(
              new Date(filters.InHandsDate?.terms[0]),
              new Date(filters.InHandsDate?.terms[1])
            )
          : this.formDefaultValue.InHandsDate,
      EventDate:
        filters.EventDate && filters.EventDate?.terms
          ? new DateRange<Date>(
              new Date(filters.EventDate?.terms[0]),
              new Date(filters.EventDate?.terms[1])
            )
          : this.formDefaultValue.InHandsDate,
    };
  }

  refreshLabelsWithCounter(
    filters: ProjectSearchFilters | undefined,
    pills: FilterPill[] | undefined
  ): void {
    const ownerCount = filters?.Owners?.terms
      ? (filters?.Owners?.terms as number[]).filter((term) =>
          pills?.some((pill) => {
            return pill.Value === term;
          })
        ).length
      : 0;
    const stepNameCount = filters?.StepName?.terms
      ? (filters?.StepName?.terms as string[]).filter((term) =>
          pills?.some((pill) => pill.Value === term)
        ).length
      : 0;

    this.labelsWithCounter = {
      owner: ownerCount
        ? `${ownerCount} ${this.labels.ownerWithCounter}${
            ownerCount > 1 ? 's' : ''
          }`
        : this.labels.owner,
      stepName: stepNameCount
        ? `${stepNameCount} ${this.labels.stepNameWithCounter}${
            stepNameCount > 1 ? 's' : ''
          }`
        : this.labels.stepName,
    };
  }

  private comparison(
    field: 'start' | 'end',
    predicate: (fieldVal, fieldToCompareVal) => boolean
  ): ValidatorFn {
    return (control: AbstractControl<unknown>): { [key: string]: any } => {
      const group = control;
      const endField = group['end'];
      const startField = group['start'];
      const valid = predicate(startField, endField);
      return valid ? null : { comparison: { value: control.value } };
    };
  }
}
