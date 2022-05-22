import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@cosmos/forms';
import { CompanySearchFilters } from '@esp/companies';
import { SearchFilter } from '@esp/models';

interface FiltersForm {
  Owners?: SearchFilter;
  OwnersSearchTerm?: string;
}

export type FiltersFormControlName = keyof FiltersForm;

@Injectable()
export class CompanySearchFiltersPresenter {
  readonly labels = {
    owner: 'Record Owner',
    ownerWithCounter: 'Owner',
  };
  filterFormControls = {
    Owners: 'Owners' as FiltersFormControlName,
    OwnersSearchTerm: 'OwnersSearchTerm' as FiltersFormControlName,
  };
  form!: FormGroup<FiltersForm>;
  formDefaultValue: FiltersForm = {
    OwnersSearchTerm: '',
    Owners: { terms: [] },
  };
  labelsWithCounter = {
    owner: this.labels.owner,
  };

  constructor(private _fb: FormBuilder) {}

  createFiltersForm(data?: FiltersForm): FormGroup<FiltersForm> {
    return this._fb.group<FiltersForm>({
      OwnersSearchTerm: [''],
      Owners: this._fb.group({
        terms: [data?.Owners.terms.slice()],
      }),
    });
  }

  initForm(data?: Partial<FiltersForm>): void {
    this.form = this.createFiltersForm(data);
  }

  mapFiltersFormToSearchCriteriaFilters(): CompanySearchFilters {
    const formValue = this.form.value;
    const filters = {};

    if (formValue?.Owners?.terms?.length) {
      Object.assign(filters, {
        Owners: { ...formValue.Owners, behavior: 'Any' },
      });
    }

    return filters;
  }

  refreshLabelsWithCounter(filters: CompanySearchFilters): void {
    const ownerCount = filters?.Owners?.terms.length;

    this.labelsWithCounter = {
      owner: ownerCount
        ? `${ownerCount} ${this.labels.ownerWithCounter}${
            ownerCount > 1 ? 's' : ''
          }`
        : this.labels.owner,
    };
  }

  resetFilterForm<T extends FiltersFormControlName>(
    filterName: T,
    value?: FiltersForm[T]
  ): void {
    this.form
      .get(filterName as string)
      ?.reset(value ?? this.formDefaultValue[filterName]);
  }

  resetFiltersForm(): void {
    this.form.reset(this.formDefaultValue);
  }
}
