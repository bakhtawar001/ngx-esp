import { Injectable } from '@angular/core';
import { asDispatch, fromSelector } from '@cosmos/state';
import { CompaniesRecentActions, CompaniesRecentQueries } from '@esp/companies';
import { SearchCriteria } from '@esp/models';
import { SearchLocalState } from '@esp/search';

@Injectable()
export class CustomerSearchLocalState extends SearchLocalState<CustomerSearchLocalState> {
  static readonly maxCustomersCount: number = 11;
  static readonly sortCustomersBy: Record<string, string> = {
    lastActivityDate: 'desc',
  };
  static readonly status: string = 'Active';

  customers = fromSelector(CompaniesRecentQueries.getRecents);
  criteria = fromSelector(CompaniesRecentQueries.getCriteria);
  from = this.criteria?.from;
  total = fromSelector(CompaniesRecentQueries.getTotal);
  loading = fromSelector(CompaniesRecentQueries.isLoading);
  // term = '';

  private _search = asDispatch(CompaniesRecentActions.Search);

  search({
    term,
    size = CustomerSearchLocalState.maxCustomersCount,
    sortBy = CustomerSearchLocalState.sortCustomersBy,
    status = 'Active',
  }: SearchCriteria): void {
    this._search({
      term,
      filters: {
        CompanyType: {
          terms: ['customer'],
        },
      },
      from: 1,
      size,
      sortBy,
      status,
    });
  }
}
