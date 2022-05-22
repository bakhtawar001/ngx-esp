import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { NumberStringPipe } from '@cosmos/common';
import { CosActionBarModule } from '@cosmos/components/action-bar';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCheckboxModule } from '@cosmos/components/checkbox';
import { CosPaginationModule } from '@cosmos/components/pagination';
import { CosSupplierModule } from '@cosmos/components/supplier';
import { CosSupplierCardModule } from '@cosmos/components/supplier-card';
import { trackItem } from '@cosmos/core';
import { FeatureFlagsModule } from '@cosmos/feature-flags';
import {
  mapFiltersToSearchCriteria,
  mapUrlFiltersToFiltersForm,
} from '@esp/suppliers';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SelectedPipeModule } from '@smartlink/products';
import { SupplierSearchResultItem } from '@smartlink/suppliers';
import { isEqual } from 'lodash-es';
import { animationFrameScheduler, combineLatest } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
} from 'rxjs/operators';
import { SupplierSearchFiltersComponentModule } from '../../components/supplier-search-filters';
import { SupplierSearchLocalState } from '../../local-states';
import { mapSupplier } from '../../utils';
import { SupplierSearchLoaderComponentModule } from './supplier-search.loader';

@UntilDestroy()
@Component({
  selector: 'esp-supplier-search-page',
  templateUrl: './supplier-search.page.html',
  styleUrls: ['./supplier-search.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SupplierSearchLocalState],
})
export class SupplierSearchPage {
  mapSupplier = mapSupplier;
  private readonly state$ = this.state.connect(this);
  maxResultLength = 1000;
  sortMenuOptions = this.getSortMenuOptions();
  trackSupplier = trackItem<SupplierSearchResultItem>(['Id']);
  originalOrder = () => 0;

  constructor(
    public readonly state: SupplierSearchLocalState,
    private readonly _router: Router
  ) {
    const from$ = this.state$.pipe(
      map(({ from }) => from),
      distinctUntilChanged()
    );

    const term$ = this.state$.pipe(
      map(({ term = '' }) => term),
      distinctUntilChanged()
    );

    const sort$ = this.state$.pipe(
      map(({ sort = '' }) => sort),
      distinctUntilChanged()
    );

    combineLatest([term$, from$, sort$])
      .pipe(
        debounceTime(0, animationFrameScheduler),
        map(([term, page, sort]) => {
          const criteria = mapFiltersToSearchCriteria(
            mapUrlFiltersToFiltersForm(this.state.filters)
          );
          return {
            ...criteria,
            term: term,
            from: page,
            sortBy: sort,
            size: this.state.pageSize,
          };
        }),
        untilDestroyed(this)
      )
      .subscribe({
        next: (criteria) => this.state.search(criteria),
      });

    this.state$.pipe(
      debounceTime(1, animationFrameScheduler),
      map(({ suppliers }) => suppliers),
      filter(Boolean),
      distinctUntilChanged(isEqual),
      untilDestroyed(this)
    );

    this._router.events.pipe(untilDestroyed(this)).subscribe({
      next: (event) =>
        event instanceof NavigationEnd ? this.scrollTop() : null,
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------
  get maxPageNumbers() {
    if (!this.state.results?.MaxPage) {
      return 0;
    }

    return this.state.results?.MaxPage > 6 ? 6 : this.state.results?.MaxPage;
  }

  get resultLength() {
    if (!this.state.results?.MaxPage) {
      return 0;
    }

    return this.state.results?.MaxPage * this.state.pageSize;
  }

  get sort() {
    return this.sortMenuOptions[
      this.state.criteria.sortBy
        ? this.state.criteria.sortBy.toString()
        : 'DFLT'
    ];
  }

  get resultsIndexFrom(): number | '' {
    if (!this.state.results) {
      return '';
    }

    if (this.state.results?.Results) {
      const index = this.state.criteria.from - 1;
      if (index === 0) {
        return this.state.results.Results?.length ? 1 : 0;
      } else if (index === 1) {
        return this.state.pageSize + index;
      } else {
        return index * this.state.pageSize + 1;
      }
    }
  }

  get resultsIndexTo(): number | '' {
    if (!this.state.results) {
      return '';
    }

    const page = this.state.criteria.from;

    if (this.state.results?.Results) {
      const toMax = Math.max(page * this.state.pageSize);
      const toMin = Math.min(page * this.state.pageSize, this.maxResultLength);
      if (toMax > this.maxResultLength) {
        return toMax;
      } else {
        return toMin > this.state.results.ResultsTotal
          ? this.state.results.ResultsTotal
          : toMin;
      }
    } else {
      return '';
    }
  }

  get resultMessage(): string {
    const numberPipe = new NumberStringPipe();
    const from = numberPipe.transform(this.resultsIndexFrom ?? 0);
    const to = numberPipe.transform(this.resultsIndexTo ?? 0);

    const supplierTotal = numberPipe.transform(
      this.state.results?.ResultsTotal ?? 0
    );
    let message = `(0 of <b>0 suppliers</b>)`;

    if (this.state.results?.Results?.length > 0) {
      message = `(${from}-${to} of <b>${supplierTotal} suppliers</b>)`;
    }

    return message;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------
  gotoProduts(supplier: SupplierSearchResultItem): void {
    const supplierFilter = encodeURIComponent(
      JSON.stringify({
        supplier: [supplier.Name + ` (asi/${supplier.AsiNumber})`],
      })
    );

    this._router.navigate(['products'], {
      queryParams: { filters: supplierFilter },
    });
  }

  setSortValue(value: string): void {
    this.state.sort = value;
  }

  pageChange($event): void {
    const page = $event.pageIndex + 1;

    this.state.from = page;

    this.scrollTop();
  }

  // -----------------------------------------------------------------
  // @Async Methods
  // -------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  private getSortMenuOptions() {
    return {
      DFLT: 'Relevance',
      SPRT: 'Supplier Rating',
    };
  }

  private scrollTop(): void {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }
}

@NgModule({
  declarations: [SupplierSearchPage],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FeatureFlagsModule,
    MatDialogModule,
    MatMenuModule,
    CosActionBarModule,
    CosButtonModule,
    CosCheckboxModule,
    CosPaginationModule,
    CosSupplierModule,
    SupplierSearchLoaderComponentModule,
    SelectedPipeModule,
    CosSupplierCardModule,
    SupplierSearchFiltersComponentModule,
  ],
})
export class SupplierSearchPageModule {}
