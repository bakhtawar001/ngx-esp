import { Injectable } from '@angular/core';
import { User } from '@asi/auth';
import {
  FinancialDetailsLocalState,
  FinancialDetailsLookups,
} from '@asi/ui/feature-financial-details';
import { asDispatch, fromSelector } from '@cosmos/state';
import { AuthFacade } from '@esp/auth';
import {
  CompaniesActions,
  CompaniesDetailQueries,
  CompaniesQueries,
} from '@esp/companies';
import { LookupTypeQueries } from '@esp/lookup-types';
import { Company } from '@esp/models';
import { PartyLocalState } from '@esp/parties';

@Injectable()
export class CompanyDetailLocalState
  extends PartyLocalState<CompanyDetailLocalState>
  implements FinancialDetailsLocalState<CompanyDetailLocalState>
{
  readonly transferOwnership = asDispatch(CompaniesActions.TransferOwnership);
  readonly deleteCompany = asDispatch(CompaniesActions.Delete);
  readonly toggleStatus = asDispatch(CompaniesActions.ToggleStatus);
  private _getCompanyById = asDispatch(CompaniesActions.Get);
  private _patchCompany = asDispatch(CompaniesActions.Patch);

  readonly companyLoading = fromSelector(CompaniesQueries.isLoading);
  readonly hasLoaded = fromSelector(CompaniesQueries.hasLoaded);
  readonly company = fromSelector(CompaniesDetailQueries.getCompany);

  private readonly creditTerms = fromSelector(
    LookupTypeQueries.lookups.CreditTerms
  );

  get party(): Company {
    return this.company;
  }

  get partyLookups(): FinancialDetailsLookups {
    return {
      CreditTerms: this.creditTerms,
    };
  }

  get isLoading(): boolean {
    return this.companyLoading;
  }

  get user(): User {
    return this.authFacade.user;
  }

  constructor(private readonly authFacade: AuthFacade) {
    super();
  }

  getPartyById(id: number) {
    this._getCompanyById(id);
  }

  save(party: Partial<Company>) {
    this._patchCompany(party);
  }

  get partyIsReady(): boolean {
    return !this.companyLoading && this.hasLoaded;
  }
}
