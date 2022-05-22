import { Injectable } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import {
  asDispatch,
  fromSelector,
  routeData,
  stringQueryParamConverter,
  urlQueryParameter,
} from '@cosmos/state';
import { AuthFacade } from '@esp/auth';
import {
  CompaniesSearchActions,
  CompaniesSearchQueries,
  CompanySearchFilters,
} from '@esp/companies';
import { SearchFilter } from '@esp/models';
import { SearchCriteria } from '@esp/companies';
import { SearchPageLocalState } from '@esp/search';
import { syncDirectorySetting } from '../../directory/utils';
import {
  COMPANIES_SORT_OPTIONS,
  COMPANIES_TABS,
  CompanyTabs,
} from '../configs';

@Injectable()
export class CompanySearchLocalState extends SearchPageLocalState<CompanySearchLocalState> {
  search = asDispatch(CompaniesSearchActions.Search);

  readonly deleteCompany = asDispatch(CompaniesSearchActions.Delete);
  readonly toggleStatus = asDispatch(CompaniesSearchActions.ToggleStatus);
  readonly criteria = fromSelector(CompaniesSearchQueries.getCriteria);
  readonly companiesLoading = fromSelector(CompaniesSearchQueries.isLoading);
  readonly companies = fromSelector(CompaniesSearchQueries.getHits);
  readonly filterPills = fromSelector(CompaniesSearchQueries.getFilterPills);
  readonly ownerFacets = fromSelector(CompaniesSearchQueries.getOwnerFacets);
  readonly hasLoaded = fromSelector(CompaniesSearchQueries.hasLoaded);
  override filters = urlQueryParameter<CompanySearchFilters>('filters', {
    defaultValue: {},
    debounceTime: 100,
    converter: {
      fromQuery: (queryParameterValues: string[], defaultValue) => {
        return queryParameterValues.length > 0
          ? JSON.parse(decodeURIComponent(queryParameterValues[0]))
          : defaultValue;
      },
      toQuery: (value) => {
        const values = value
          ? Object.entries(value).filter(([_, v]) => v != null)
          : [];

        return values?.length
          ? [encodeURIComponent(JSON.stringify(Object.fromEntries(values)))]
          : [];
      },
    },
  });

  total = fromSelector(CompaniesSearchQueries.getTotal);
  searchType =
    // See `directory-routing.module.ts`.
    routeData<{ value: string; title: string; type: string }>('searchType');

  status = urlQueryParameter<string>('status', {
    defaultValue: '',
    debounceTime: 0,
    converter: stringQueryParamConverter,
  });

  override sort = syncDirectorySetting(
    'directorySort',
    COMPANIES_SORT_OPTIONS[0]
  );

  override tabIndex = syncDirectorySetting('searchTabIndex', 0) || 0;

  constructor(private readonly _authFacade: AuthFacade) {
    super();
  }

  override get tab() {
    if (this.tabIndex == null) return;

    const tab = { ...COMPANIES_TABS[this.tabIndex] };

    const filters: Record<string, SearchFilter> = {
      IncludeOwnerDetails: { terms: ['true'] },
      ...tab?.criteria.filters,
      CompanyType:
        this.searchType.value === 'company'
          ? null
          : {
              terms: [this.searchType.value],
              behavior: 'Any',
            },
    };

    if (filters?.Owners && !filters?.Owners.terms?.length) {
      filters.Owners.terms = [`${this._authFacade.user?.Id}`];
    }

    tab.criteria.filters = filters;

    return tab;
  }

  override setTab(event: MatTabChangeEvent): void {
    this.tabIndex = event.index;
    this.from = 1;
  }

  setFilters(criteria: SearchCriteria): void {
    this.filters = {
      ...(criteria.filters?.Owners && { Owners: criteria.filters?.Owners }),
    };
    this.from = 1;
  }

  protected override _searchStateMapper(state: CompanySearchLocalState) {
    const ownersFilters = this.getTabOwnersFilters(state);

    return {
      ...super._searchStateMapper(state),
      filters: {
        ...state.filters,
        ...state.tab?.criteria.filters,
        ...(ownersFilters && { Owners: ownersFilters }),
      },
    };
  }

  protected getTabOwnersFilters(
    state: CompanySearchLocalState
  ): SearchFilter | null {
    switch (this.tabIndex) {
      case CompanyTabs.OwnedByMe:
        return state.tab?.criteria.filters?.Owners;
      case CompanyTabs.SharedWithMe: {
        const myId = this._authFacade.user?.Id;
        // exclude current user
        const owners =
          (state.filters.Owners?.terms as number[])?.filter(
            (id) => id != myId
          ) ?? [];

        return owners.length
          ? {
              // if there are owners selected, use their ids
              terms: [...owners],
              behavior: 'Any',
            }
          : state.tab?.criteria.filters?.Owners; // otherwise use tab filters (excluding current user)
      }
      default:
        return null;
    }
  }
}
