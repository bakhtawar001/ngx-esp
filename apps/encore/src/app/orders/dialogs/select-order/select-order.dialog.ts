import { CommonModule } from '@angular/common';
import {
  Component,
  NgModule,
  ChangeDetectionStrategy,
  Optional,
  Inject,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { AsiCompanyAvatarModule } from '@asi/company/ui/feature-components';
import { CardsSelectionDialogComponentModule } from '@asi/ui/cards-selection-dialog';
import {
  AsiDetailsCardLoaderComponentModule,
  AsiUiDetailsCardComponentModule,
} from '@asi/ui/details-card';
import { CosButtonModule } from '@cosmos/components/button';
import { CosDialogModule } from '@cosmos/components/dialog';
import { CosFormFieldModule } from '@cosmos/components/form-field';
import { CosInputModule } from '@cosmos/components/input';
import { trackItem } from '@cosmos/core';
import { OrderSearch, SearchCriteria } from '@esp/models';
import { SelectOrderDialogData, SelectOrderDialogResult } from './models';
import { SelectOrderDialogSearchLocalState } from './select-order-dialog.local-state';

@Component({
  selector: 'esp-select-order',
  templateUrl: './select-order.dialog.html',
  styleUrls: ['./select-order.dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SelectOrderDialogSearchLocalState],
})
export class SelectOrderDialog {
  orders: OrderSearch[] = [];

  private _currentSearchTerm = '';

  readonly trackById = trackItem<OrderSearch>(['Id']);

  // @TODO uncomment code when finishing OrderSearch functionality
  constructor(
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    public readonly data: SelectOrderDialogData,
    private readonly dialogRef: MatDialogRef<
      SelectOrderDialog,
      SelectOrderDialogResult
    > // public readonly state: SelectOrderDialogSearchLocalState
  ) {
    // this.state.connect(this);
  }

  onCreateOrder(): void {
    this.dialogRef.close({
      data: { createNew: true },
      action: 'next',
    });
  }

  onOrderSearch(searchValue: string): void {
    this._currentSearchTerm = searchValue;
    // this.state.search({
    //   term: searchValue,
    // } as SearchCriteria);
  }

  onPreviousStep(): void {
    this.dialogRef.close({
      data: { createNew: false },
      action: 'previous',
    });
  }

  onSelectOrder(order: OrderSearch): void {
    this.dialogRef.close({
      data: {
        searchTerm: this._currentSearchTerm,
        selectedOrderId: order.Id,
        createNew: false,
      },
      action: 'next',
    });
  }
}

@NgModule({
  declarations: [SelectOrderDialog],
  exports: [SelectOrderDialog],
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
export class SelectOrderDialogModule {}
