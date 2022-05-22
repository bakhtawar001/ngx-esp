import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CosAddressFormModule } from '@cosmos/components/address-form';
import { CosFormFieldModule } from '@cosmos/components/form-field';
import { CosInputModule } from '@cosmos/components/input';
import { FormGroupComponent } from '@cosmos/forms';
import { Address, OrderContact, Phone } from '@esp/models';

@Component({
  selector: 'esp-edit-order-contact-details',
  templateUrl: './edit-order-contact-details.component.html',
  styleUrls: ['./edit-order-contact-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditOrderContactDetailsComponent extends FormGroupComponent<OrderContact> {
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
        Phone: this._fb.group<Phone>({
          Id: this._fb.control<number>(null),
          Number: this._fb.control<string>(null),
          Type: [null],
          PhoneCode: [null],
          Country: [null],
          /*
          Extension?: string;
          IsPrimary?: boolean;
          */
        }),
      }),
    });
  }
}

@NgModule({
  declarations: [EditOrderContactDetailsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CosFormFieldModule,
    CosInputModule,
    CosAddressFormModule,
  ],
  exports: [EditOrderContactDetailsComponent],
})
export class EditOrderContactDetailsComponentModule {}
