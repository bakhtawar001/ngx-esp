import { Injectable } from '@angular/core';
import { DialogService } from '@cosmos/core';
import { Observable } from 'rxjs';
import {
  createContactDialogDef,
  CreateContactData,
  CreateContactResult,
} from '../../dialogs';

@Injectable()
export class ContactDialogService {
  constructor(private readonly dialog: DialogService) {}

  openCreateContactDialog(
    data?: Partial<CreateContactData>
  ): Observable<CreateContactResult | undefined> {
    return this.dialog.open(createContactDialogDef, data);
  }
}
