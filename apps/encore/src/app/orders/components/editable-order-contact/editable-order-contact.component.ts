import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { AsiPartyAutocompleteComponentModule } from '@asi/ui/feature-core';
import { CosAddressFormModule } from '@cosmos/components/address-form';
import { CosFormFieldModule } from '@cosmos/components/form-field';
import { CosInputModule } from '@cosmos/components/input';
import { DialogService } from '@cosmos/core';
import { FormControl, FormGroupComponent } from '@cosmos/forms';
import { AutocompleteParams } from '@esp/autocomplete';
import { Address, OrderContact, PartyBase, PartyView } from '@esp/models';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { editOrderContactDialogDef } from '../../dialogs/edit-order-contact';
import { OrderCustomerAddressComponentModule } from '../order-customer-address';

@UntilDestroy()
@Component({
  selector: 'esp-editable-order-contact',
  templateUrl: './editable-order-contact.component.html',
  styleUrls: ['./editable-order-contact.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditableOrderContactComponent extends FormGroupComponent<OrderContact> {
  @Input() label: string;
  @Input() placeholder: string;
  @Input() companyId: string = null;
  @Input() type = 'orderContact';

  selectedPartyControl = new FormControl<PartyBase>(null);

  constructor(private dialogs: DialogService) {
    super();
  }

  public get filters(): AutocompleteParams['filters'] {
    const hasCompanyId = this.companyId && Number.isInteger(this.companyId);
    return hasCompanyId
      ? {
          CompanyBoost: {
            Terms: [+this.companyId],
            Behavior: 'Any',
          },
        }
      : {};
  }

  public onEdit() {
    const orderContact = this.form.value;
    this.dialogs
      .open(editOrderContactDialogDef, {
        orderContact,
        orderType: 'order',
        title: this.label,
      })
      .pipe(untilDestroyed(this))
      .subscribe();
  }

  protected override createForm() {
    return this._fb.group<OrderContact>({
      Id: this._fb.control<number>(null),
      Name: [''],
      CompanyName: [''],
      EmailAddress: [''],
      Address: this._fb.group<Address>({
        Id: this._fb.control<number>(null),
        Line1: [''],
        Line2: [''],
        City: [''],
        State: [''],
        PostalCode: [''],
        CountryType: [''],
      }),
      Party: this._fb.control<PartyView>(null),
    });
  }
}

@NgModule({
  declarations: [EditableOrderContactComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    OrderCustomerAddressComponentModule,
    AsiPartyAutocompleteComponentModule,
    CosFormFieldModule,
    CosInputModule,
    CosAddressFormModule,
    MatDialogModule,
  ],
  exports: [EditableOrderContactComponent],
})
export class EditableOrderContactComponentModule {}
