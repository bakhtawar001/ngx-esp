import { Injectable } from '@angular/core';
import { asDispatch, fromSelector, LocalState } from '@cosmos/state';
import {
  CompaniesActions,
  CompaniesQueries,
  CreateLinkPayload,
} from '@esp/companies';
import { Company } from '@esp/models';
import { LookupTypeQueries } from '@esp/lookup-types';

@Injectable()
export class LinkedCompaniesLocalState extends LocalState<LinkedCompaniesLocalState> {
  private _patchCompany = asDispatch(CompaniesActions.Patch);
  private _createLink = asDispatch(CompaniesActions.CreateLink);
  private _getCompanyLinks = asDispatch(CompaniesActions.GetLinks);
  private _getCompanyById = asDispatch(CompaniesActions.Get);

  companyLinks = fromSelector(CompaniesQueries.getLinks);
  company = fromSelector(CompaniesQueries.getCompany);
  relationships = fromSelector(LookupTypeQueries.lookups.Relationships);

  getCompanyLinks(id: number) {
    this._getCompanyLinks(id);
  }

  getPartyById(id: number) {
    this._getCompanyById(id);
  }

  get party(): Company | null {
    return this.company;
  }

  save(party: Partial<Company>) {
    this._patchCompany(party);
  }

  createLink(newlinkPayload: CreateLinkPayload) {
    this._createLink(newlinkPayload);
  }

  get partyIsReady(): boolean {
    return true;
  }
}
