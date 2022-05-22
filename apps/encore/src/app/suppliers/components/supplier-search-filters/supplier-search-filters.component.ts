/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { AsiFilterPillsModule } from '@asi/ui/feature-filters';
import {
  DigitsOnlyDirectiveModule,
  IncludesPipeModule,
  OrderByPipeModule,
} from '@cosmos/common';
import { CosButtonModule } from '@cosmos/components/button';
import {
  CosCheckboxChange,
  CosCheckboxModule,
} from '@cosmos/components/checkbox';
import { CosFiltersModule } from '@cosmos/components/filters';
import { CosFormFieldModule } from '@cosmos/components/form-field';
import { CosInputModule } from '@cosmos/components/input';
import { CosPillModule } from '@cosmos/components/pill';
import { FormBuilder, FormGroup } from '@cosmos/forms';
import { SEARCH_FILTER_LOCAL_STATE } from '@esp/search';
import {
  FiltersForm,
  mapFiltersToSearchCriteria,
  mapUrlFiltersToFiltersForm,
  SUPPLIER_FILTERS_DEFAULT,
} from '@esp/suppliers';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { isEqual } from 'lodash-es';
import { animationFrameScheduler } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { SupplierSearchLocalState } from '../../local-states';

const DESKTOP_MIN_WIDTH = 1024;

// type searchTermControl = keyOf Pick<FiltersForm, >

@UntilDestroy()
@Component({
  templateUrl: './supplier-search-filters.component.html',
  styleUrls: ['./supplier-search-filters.component.scss'],
  selector: 'esp-supplier-search-filters',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: SEARCH_FILTER_LOCAL_STATE,
      useExisting: SupplierSearchLocalState,
    },
  ],
})
export class SupplierSearchFiltersComponent implements OnInit {
  //------------------------------------------------------------------------------------------------------------------------------
  // @PRIVATE ACCESSORIES
  //-------------------------------------------------------------------------------------------------------------------------------
  private readonly state$ = this.state.connect(this);

  //-------------------------------------------------------------------------------------------------------------------------------
  // @PUBLIC ACCESSORIES
  //---------------------------------------------------------------------------------------------------------------------------------
  supplierFiltersForm = this.createFilterForm();
  isDesktop: boolean;
  appliedFilterPills = {};

  //--------------------------------------------------------------------------------------------------------------------------------
  // @CONSTRUCTOR
  //---------------------------------------------------------------------------------------------------------------------------------
  constructor(
    public readonly state: SupplierSearchLocalState,
    private readonly _fb: FormBuilder,
    private readonly _breakpointObserver: BreakpointObserver
  ) {
    this._breakpointObserver
      .observe([`(min-width: ${DESKTOP_MIN_WIDTH}px)`])
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (result) => {
          this.isDesktop = result.matches;
        },
      });
  }

  //----------------------------------------------------------------------------------------------------------------------------
  // @LIFE CYCLE Hooks
  //------------------------------------------------------------------------------------------------------------------------------
  ngOnInit(): void {
    this.initStateListeners();
  }

  //---------------------------------------------------------------------------------------------------------------------------------
  //  @PUBLIC METHODS
  //-----------------------------------------------------------------------------------------------------------------------------------
  applyFilters(controlName?: string): void {}

  resetAllFilters(): void {}

  onChange($event: CosCheckboxChange): void {
    this.setSearchCriteria();
  }

  //----------------------------------------------------------------------------------------------------------------------------------
  // @PRIVATE METHODS
  //------------------------------------------------------------------------------------------------------------------------------------
  private createFilterForm(): FormGroup<FiltersForm> {
    const filterForm = this._fb.group<FiltersForm>({
      MinorityOwned: [false],
    });

    return filterForm;
  }

  private setSearchCriteria(): void {
    this.state.search({
      ...this.state.criteria,
      from: 1,
      ...mapFiltersToSearchCriteria(this.supplierFiltersForm.value),
    });
  }

  private initStateListeners() {
    this.state$
      .pipe(
        map(({ filters }) => filters),
        debounceTime(0, animationFrameScheduler),
        distinctUntilChanged(isEqual),
        map((filters) => mapUrlFiltersToFiltersForm(filters)),
        untilDestroyed(this)
      )
      .subscribe({
        next: (filters) => {
          this.supplierFiltersForm.reset({
            ...SUPPLIER_FILTERS_DEFAULT,
            ...filters,
          });
        },
      });
  }
}

// ------------------------------------------------------------------------------------------------------------------------------
// @NgModule
//--------------------------------------------------------------------------------------------------------------------------------
@NgModule({
  declarations: [SupplierSearchFiltersComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CosButtonModule,
    CosCheckboxModule,
    CosFiltersModule,
    CosFormFieldModule,
    CosInputModule,
    CosPillModule,
    DigitsOnlyDirectiveModule,
    OrderByPipeModule,
    MatListModule,
    IncludesPipeModule,
    AsiFilterPillsModule,
  ],
  exports: [SupplierSearchFiltersComponent],
})
export class SupplierSearchFiltersComponentModule {}

