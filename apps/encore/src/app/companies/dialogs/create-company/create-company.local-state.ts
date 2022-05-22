import { Injectable } from '@angular/core';
import { asDispatch, LocalState } from '@cosmos/state';
import { CompaniesActions } from '@esp/companies';

@Injectable()
export class CreateCompanyDialogLocalState extends LocalState<CreateCompanyDialogLocalState> {
  create = asDispatch(CompaniesActions.Create);
}
