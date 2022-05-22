import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  NgModule,
  OnInit,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatListModule } from '@angular/material/list';
import { AsiDateRangeSelectModule } from '@asi/ui/feature-core';
import {
  AsiFilterPillsModule,
  FilterPill,
  RemoveFilterPayload,
} from '@asi/ui/feature-filters';
import { InitialsPipeModule } from '@cosmos/common';
import { CosAvatarModule } from '@cosmos/components/avatar';
import { CosButtonModule } from '@cosmos/components/button';
import { CosFiltersModule } from '@cosmos/components/filters';
import { CosFormFieldModule } from '@cosmos/components/form-field';
import { CosInputModule } from '@cosmos/components/input';
import { UniqueIdService } from '@cosmos/core';
import { FormGroup } from '@cosmos/forms';
import { ProjectSearchFilters, SearchCriteria } from '@esp/projects';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { isArray, isEqual } from 'lodash-es';
import { animationFrameScheduler } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
} from 'rxjs/operators';
import { AggregationTypeaheadComponentModule } from '../../../products/components/aggregation-typeahead';
import {
  PROJECT_SEARCH_LOCAL_STATE,
  ProjectSearchLocalState,
} from '../../local-states';
import { SearchTermControl } from '../../types';
import { ProjectSearchFiltersPresenter } from './project-search-filters.presenter';

@UntilDestroy()
@Component({
  selector: 'esp-project-search-filters',
  templateUrl: './project-search-filters.component.html',
  styleUrls: ['./project-search-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProjectSearchFiltersPresenter, UniqueIdService],
})
export class ProjectSearchFiltersComponent implements OnInit {
  readonly title = 'Filtering projects';

  filterPills: FilterPill[] = [];
  hasFilters = false;

  private readonly state$ = this.state.connect(this);

  constructor(
    private readonly cdr: ChangeDetectorRef,
    public readonly presenter: ProjectSearchFiltersPresenter,
    @Inject(PROJECT_SEARCH_LOCAL_STATE)
    public readonly state: ProjectSearchLocalState
  ) {}

  ngOnInit(): void {
    this.presenter.initForm(this.presenter.formDefaultValue);
    this.initStateListeners();
  }

  applyFilter(controlName?: SearchTermControl): void {
    this.setSearchCriteriaFilters();
    this.clearSearchTerm(controlName);
  }

  clickOut(controlName: string, searchTermControl?: SearchTermControl): void {
    this.formControlClickOut(
      controlName,
      this.presenter.form,
      this.state.criteria
    );

    this.clearSearchTerm(searchTermControl);
  }

  formControlClickOut(
    controlName: string,
    _filtersForm: FormGroup,
    criteria: SearchCriteria
  ) {
    criteria.filters[controlName]?.terms.length
      ? _filtersForm.get(controlName).setValue(criteria.filters[controlName])
      : _filtersForm.get(controlName).reset('');
  }

  resetFilterForm(): void {
    this.presenter.resetFilterForm();
  }

  resetFilter(
    controlName?: string,
    searchTermControlName?: SearchTermControl
  ): void {
    if (controlName) {
      this.resetFilterToDefault(controlName);
      this.applyFilter(searchTermControlName);
    }
  }

  removeFilter(params: RemoveFilterPayload = { ClearAll: true }): void {
    if (params.ClearAll) {
      this.resetFilterForm();
    } else {
      if (isArray(this.presenter.form.get(params.ControlName).value)) {
        const val = [...this.presenter.form.get(params.ControlName).value];
        val.splice(val.indexOf(params.Value), 1);
        this.presenter.form.get(params.ControlName).setValue(val);
      } else {
        this.resetFilterToDefault(params.ControlName);
      }
    }

    this.applyFilter();
  }

  private setSearchCriteriaFilters(): void {
    this.state.setFilters({
      ...this.state.criteria,
      filters: { ...this.presenter.mapFiltersFormToSearchCriteriaFilters() },
    });
  }

  private initStateListeners(): void {
    this.state$
      .pipe(
        filter(({ hasLoaded }) => hasLoaded),
        map(({ filters, filterPills }) => ({ filters, filterPills })),
        debounceTime(0, animationFrameScheduler),
        distinctUntilChanged(isEqual),
        untilDestroyed(this)
      )
      .subscribe({
        next: ({ filters, filterPills }) => {
          this.presenter.form.patchValue({
            ...this.presenter.formDefaultValue,
            ...this.presenter.mapFiltersToForm(filters),
          });
          this.presenter.refreshLabelsWithCounter(filters, filterPills);

          this.cdr.markForCheck();
        },
      });
  }

  private clearSearchTerm(controlName: SearchTermControl): void {
    this.presenter.form?.get(controlName)?.setValue('');
  }

  private resetFilterToDefault(filterName: string) {
    this.presenter.form
      ?.get(filterName)
      .reset(this.presenter.formDefaultValue[filterName]);
  }
}

@NgModule({
  imports: [
    CosFiltersModule,
    CosButtonModule,
    CosAvatarModule,
    InitialsPipeModule,
    AggregationTypeaheadComponentModule,
    CommonModule,
    ReactiveFormsModule,
    CosFormFieldModule,
    MatDatepickerModule,
    CosInputModule,
    MatListModule,
    AsiFilterPillsModule,
    AsiDateRangeSelectModule,
  ],
  declarations: [ProjectSearchFiltersComponent],
  exports: [ProjectSearchFiltersComponent],
})
export class ProjectSearchFiltersModule {}
