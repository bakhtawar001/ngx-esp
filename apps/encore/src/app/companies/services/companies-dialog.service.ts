import { Injectable } from '@angular/core';
import { DialogService } from '@cosmos/core';
import { CreateCompanyDialogData, createCompanyDialogDef } from '../dialogs';

@Injectable({
  providedIn: 'root',
})
export class CompaniesDialogService {
  constructor(private _dialog: DialogService) {}

  createCompany(data: CreateCompanyDialogData) {
    return this._dialog.open(createCompanyDialogDef, data);
  }
}
