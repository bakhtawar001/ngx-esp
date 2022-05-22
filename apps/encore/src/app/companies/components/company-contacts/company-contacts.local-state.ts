import { Injectable } from '@angular/core';
import { asDispatch, fromSelector, LocalState } from '@cosmos/state';
import { CompaniesActions, CompaniesQueries } from '@esp/companies';
import { Company, LinkRelationship } from '@esp/models';
import { ContactsSearchActions } from '@esp/contacts';

@Injectable()
export class CompanyContactsLocalState extends LocalState<CompanyContactsLocalState> {
  company = fromSelector(CompaniesQueries.getCompany);
  links = fromSelector(CompaniesQueries.getLinks);
  private readonly _patchCompany = asDispatch(CompaniesActions.Patch);
  readonly _patchLink = asDispatch(CompaniesActions.PatchLink);
  readonly _createLink = asDispatch(CompaniesActions.CreateLink);
  readonly _removeLink = asDispatch(CompaniesActions.RemoveLink);
  readonly createContact = asDispatch(CompaniesActions.CreateContact);

  private _getCompanyLinks = asDispatch(CompaniesActions.GetLinks);

  save(party: Partial<Company>): void {
    this._patchCompany(party);
  }

  createLink(link: LinkRelationship): void {
    this._createLink({ link, companyId: this.company.Id });
  }

  patchLink(link: LinkRelationship): void {
    this._patchLink({ link, companyId: this.company.Id, linkId: link.Id });
  }

  removeLink(linkId: number): void {
    this._removeLink({ companyId: this.company.Id, linkId });
  }

  getCompanyLinks(id: number) {
    this._getCompanyLinks(id);
  }
}
