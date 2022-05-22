import { Injectable } from '@angular/core';
import { DialogService } from '@cosmos/core';
import { selectCustomerDialogConfig } from '../../companies/dialogs/select-customer';

@Injectable({
  providedIn: 'root',
})
export class CustomersDialogService {
  constructor(private readonly dialogService: DialogService) {}

  openSelectCustomerDialog() {
    return this.dialogService.open(selectCustomerDialogConfig);
  }
}
