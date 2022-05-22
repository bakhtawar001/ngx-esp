import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  NgModule,
  Optional,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { CardsSelectionDialogComponentModule } from '@asi/ui/cards-selection-dialog';
import {
  AsiUiDetailsCardComponentModule,
  AsiDetailsCardLoaderComponentModule,
} from '@asi/ui/details-card';
import { CosButtonModule } from '@cosmos/components/button';
import { CosDialogModule } from '@cosmos/components/dialog';
import { CosFormFieldModule } from '@cosmos/components/form-field';
import { CosInputModule } from '@cosmos/components/input';
import { trackItem } from '@cosmos/core';
import { Customer, SearchCriteria } from '@esp/models';
import { AsiCompanyAvatarModule } from '@asi/company/ui/feature-components';
import { CustomerSearchLocalState } from '../../../customers/local-states';
import { CustomerAddressPipe } from './customer-address.pipe';
import { SelectCustomerDialogData, SelectCustomerDialogResult } from './models';

@Component({
  selector: 'esp-select-customer-dialog',
  templateUrl: './select-customer.dialog.html',
  styleUrls: ['./select-customer.dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CustomerSearchLocalState],
})
export class SelectCustomerDialog {
  readonly trackById = trackItem<Customer>(['Id']);
  private _currentSearchTerm = '';

  constructor(
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    public readonly data: SelectCustomerDialogData,
    private readonly dialogRef: MatDialogRef<
      SelectCustomerDialog,
      SelectCustomerDialogResult
    >,
    public readonly state: CustomerSearchLocalState
  ) {
    this.state.connect(this);
  }

  onCreateCustomer(): void {
    this.dialogRef.close({
      data: {
        // @TODO: clarify if needed.
        searchTerm: this._currentSearchTerm,
        createNew: true,
      },
      action: 'next',
    });
  }

  onCustomerSearch(searchValue: string): void {
    this._currentSearchTerm = searchValue;
    this.state.search({
      term: searchValue,
      size: CustomerSearchLocalState.maxCustomersCount,
      sortBy: CustomerSearchLocalState.sortCustomersBy,
      status: CustomerSearchLocalState.status,
    } as SearchCriteria);
  }

  onPreviousStep(): void {
    this.dialogRef.close({
      data: {
        searchTerm: this._currentSearchTerm,
        createNew: false,
      },
      action: 'previous',
    });
  }

  onSelectCustomer(customer: Customer): void {
    this.dialogRef.close({
      data: {
        searchTerm: this._currentSearchTerm,
        selectedCustomerId: customer.Id,
        createNew: false,
      },
      action: 'next',
    });
  }
}

@NgModule({
  declarations: [SelectCustomerDialog, CustomerAddressPipe],
  exports: [SelectCustomerDialog],
  imports: [
    CommonModule,
    CosButtonModule,
    CosDialogModule,
    CosFormFieldModule,
    CosInputModule,
    MatDialogModule,
    ReactiveFormsModule,
    CardsSelectionDialogComponentModule,
    AsiUiDetailsCardComponentModule,
    AsiCompanyAvatarModule,
    AsiDetailsCardLoaderComponentModule,
  ],
})
export class SelectCustomerDialogModule {}
