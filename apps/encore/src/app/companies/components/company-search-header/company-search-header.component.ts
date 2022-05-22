import { Component, NgModule, ChangeDetectionStrategy } from '@angular/core';
import {
  AsiFilterPillsModule,
  RemoveFilterPayload,
} from '@asi/ui/feature-filters';
import { EspSearchBoxModule, EspSearchSortModule } from '@esp/search';
import { COMPANIES_SORT_OPTIONS } from '../../configs';
import { CompanySearchLocalState } from '../../local-states';
import { removeFilter } from '../../utils';
import { CompanySearchFiltersModule } from '../company-search-filters';

@Component({
  selector: 'esp-company-search-header',
  templateUrl: './company-search-header.component.html',
  styleUrls: ['./company-search-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanySearchHeaderComponent {
  searchPlaceholder: string;
  readonly sortMenuOptions = COMPANIES_SORT_OPTIONS;

  constructor(public readonly state: CompanySearchLocalState) {
    this.searchPlaceholder = `Search ${
      !this.state.searchType ? 'All Companies' : this.state.searchType.title
    }`;
  }

  onRemoveFilter(payload: RemoveFilterPayload): void {
    this.state.setFilters({
      ...this.state.criteria,
      filters: removeFilter(payload, this.state.criteria.filters),
    });
  }
}

@NgModule({
  declarations: [CompanySearchHeaderComponent],
  exports: [CompanySearchHeaderComponent],
  imports: [
    AsiFilterPillsModule,
    CompanySearchFiltersModule,
    EspSearchBoxModule,
    EspSearchSortModule,
  ],
})
export class CompanySearchHeaderModule {}
