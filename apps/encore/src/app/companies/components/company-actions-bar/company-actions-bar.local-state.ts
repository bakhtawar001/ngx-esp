import { Injectable } from '@angular/core';
import { asDispatch, fromSelector, LocalState, routeData } from '@cosmos/state';
import { CompaniesSearchActions, CompaniesSearchQueries } from '@esp/companies';

@Injectable()
export class CompanyActionsBarLocalState extends LocalState<CompanyActionsBarLocalState> {
  search = asDispatch(CompaniesSearchActions.Search);
  criteria = fromSelector(CompaniesSearchQueries.getCriteria);

  searchType =
    // See `directory-routing.module.ts`.
    routeData<{ value: string; title: string; type: string }>('searchType');
}
