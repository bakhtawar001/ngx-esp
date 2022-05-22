import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { CosAutocompleteModule } from '@cosmos/components/autocomplete';
import { CosAvatarModule } from '@cosmos/components/avatar';
import { CosButtonModule } from '@cosmos/components/button';
import { CosFormFieldModule } from '@cosmos/components/form-field';
import { CosInputModule } from '@cosmos/components/input';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'esp-project-contact-info-dialog',
  templateUrl: 'project-contact-info.dialog.html',
  styleUrls: ['./project-contact-info.dialog.scss'],
})
export class ProjectContactInfoDialog {
  contacts = [
    {
      avatar: 'https://i.pravatar.cc/32?img=39',
      last_name: 'Park',
      first_name: 'Elizabeth',
      company: '',
      company_role: 'Events Coordinator',
      phone: '800-867-5309',
      email: 'jepark@greenstonefinancial.com',
      address: {
        Line1: '678 Avenue Blvd',
        Line2: '',
        City: 'Pawnee',
        CountryCode: '',
        State: 'Indiana',
        PostalCode: '55423',
      },
    },
    {
      avatar: 'https://i.pravatar.cc/32?img=65',
      first_name: 'Bob',
      last_name: 'Greenway',
      company: '',
      company_role: 'That dude',
      phone: '800-867-5309',
      email: 'bigbob@greenstonefinancial.com',
      address: {
        Line1: '123 Main Street',
        Line2: '',
        City: 'Scranton',
        State: 'Pennsylvania',
        CountryCode: '',
        PostalCode: '18447',
      },
    },

    {
      avatar: 'https://i.pravatar.cc/32?img=66',
      first_name: 'Bill',
      last_name: 'Smitch',
      company: '',
      company_role: 'THE dude',
      phone: '800-867-5309',
      email: 'bsmith@greenstonefinancial.com',
      address: {
        Line1: '123 Main',
        Line2: '',
        City: '',
        CountryCode: '',
        State: '',
        PostalCode: '',
      },
    },
  ];

  orderApproverControl = new FormControl();
  shippingAddressControl = new FormControl();
  billingAddressControl = new FormControl();

  fuzzySearch(
    rawData: any,
    normalizedDatum: any,
    normalizedSearchTerm: string
  ) {
    const { company_role, email, first_name, last_name, phone } = rawData;
    return [first_name, last_name, company_role, email, phone]
      .map((x) => x.toLowerCase())
      .join('')
      .includes(normalizedSearchTerm);
  }

  addressSearch(
    rawData: any,
    normalizedDatum: any,
    normalizedSearchTerm: string
  ) {
    const {
      first_name,
      last_name,
      address: { Line1, Line2, CountryCode, State, PostalCode },
    } = rawData;
    return [first_name, last_name, Line1, Line2, CountryCode, State, PostalCode]
      .map((x) => x.toLowerCase())
      .join('')
      .includes(normalizedSearchTerm);
  }

  get selectedOrderApprover() {
    return this.orderApproverControl.value;
  }
}

@NgModule({
  declarations: [ProjectContactInfoDialog],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    CosAutocompleteModule,
    CosAvatarModule,
    MatDatepickerModule,
    CosButtonModule,
    CosInputModule,
    CosFormFieldModule,
  ],
})
export class ProjectContactInfoDialogModule {}
