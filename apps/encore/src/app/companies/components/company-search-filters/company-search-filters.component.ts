import { CommonModule } from '@angular/common';
import {
  Component,
  NgModule,
  ChangeDetectionStrategy,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { FilterByPipeModule, InitialsPipeModule } from '@cosmos/common';
import { CosAvatarModule } from '@cosmos/components/avatar';
import { CosButtonModule } from '@cosmos/components/button';
import { CosFiltersModule } from '@cosmos/components/filters';
import { CosInputModule } from '@cosmos/components/input';
import { CompanySearchFilters, OwnerAggregation } from '@esp/companies';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { isEqual } from 'lodash-es';
import { animationFrameScheduler } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
} from 'rxjs/operators';
import { CompanyTabs } from '../../configs';
import { CompanySearchLocalState } from '../../local-states';
import {
  CompanySearchFiltersPresenter,
  FiltersFormControlName,
} from './company-search-filters.presenter';

@UntilDestroy()
@Component({
  selector: 'esp-company-search-filters',
  templateUrl: './company-search-filters.component.html',
  styleUrls: ['./company-search-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CompanySearchFiltersPresenter],
})
export class CompanySearchFiltersComponent implements OnInit {
  public readonly ownersFilterProps: (keyof OwnerAggregation)[] = [
    'Id',
    'Name',
    'Email',
  ];
  private readonly state$ = this.state.connect(this);
  disableOwnersFilter = false;

  constructor(
    public readonly state: CompanySearchLocalState,
    public readonly presenter: CompanySearchFiltersPresenter
  ) {}

  applyFilter(searchControlName?: FiltersFormControlName): void {
    this.setSearchCriteriaFilters();
    this.presenter.resetFilterForm(searchControlName);
  }

  clickOut(
    controlName: FiltersFormControlName,
    searchControlName?: FiltersFormControlName
  ): void {
    this.presenter.resetFilterForm(
      controlName,
      this.state.filters[controlName]?.terms.length
        ? this.state.filters[controlName]
        : undefined
    );
    this.presenter.resetFilterForm(searchControlName);
  }

  ngOnInit(): void {
    this.presenter.initForm(this.presenter.formDefaultValue);
    this.initStateListeners();
  }

  resetFilters(): void {
    this.presenter.resetFiltersForm();
    this.applyFilter();
  }

  resetFilter(
    controlName?: FiltersFormControlName,
    searchTermControlName?: FiltersFormControlName
  ): void {
    this.presenter.resetFilterForm(controlName);
    this.applyFilter(searchTermControlName);
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
        map(({ filters }) => filters),
        debounceTime(0, animationFrameScheduler),
        distinctUntilChanged(isEqual),
        untilDestroyed(this)
      )
      .subscribe({
        next: (filters: CompanySearchFilters) => {
          this.presenter.form.patchValue({
            ...this.presenter.formDefaultValue,
            ...filters,
          });
          this.presenter.refreshLabelsWithCounter(filters);
        },
      });

    this.state$
      .pipe(
        filter(({ hasLoaded }) => hasLoaded),
        map(({ tabIndex }) => tabIndex),
        debounceTime(0, animationFrameScheduler),
        distinctUntilChanged(),
        untilDestroyed(this)
      )
      .subscribe({
        next: (tabIndex: number) => {
          this.disableOwnersFilter = tabIndex === CompanyTabs.OwnedByMe;
        },
      });
  }
}

@NgModule({
  declarations: [CompanySearchFiltersComponent],
  exports: [CompanySearchFiltersComponent],
  imports: [
    CommonModule,
    CosAvatarModule,
    CosButtonModule,
    CosFiltersModule,
    CosInputModule,
    FilterByPipeModule,
    InitialsPipeModule,
    MatListModule,
    ReactiveFormsModule,
  ],
})
export class CompanySearchFiltersModule {}
