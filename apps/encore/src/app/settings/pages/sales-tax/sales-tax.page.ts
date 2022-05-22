import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  OnInit,
} from '@angular/core';
import {
  FormArray as NgFormArray,
  FormGroup as NgFormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AsiPanelEditableRowModule } from '@asi/ui/feature-core';
import { CosAddressFormModule } from '@cosmos/components/address-form';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCheckboxModule } from '@cosmos/components/checkbox';
import { CosInputModule } from '@cosmos/components/input';
import { CosSegmentedPanelModule } from '@cosmos/components/segmented-panel';
import { CosTableModule } from '@cosmos/components/table';
import { CosSlideToggleModule } from '@cosmos/components/toggle';
import { FormArray, FormControl, FormGroup } from '@cosmos/forms';

@Component({
  templateUrl: './sales-tax.page.html',
  styleUrls: ['./sales-tax.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesTaxPage implements OnInit {
  addAddress = false;
  taxRateEdit = false;

  addressForms: FormArray<any> = new NgFormArray([]);
  stateTaxRates: FormArray<any> = new NgFormArray([]);

  newAddress = new NgFormGroup({
    Name: new FormControl(''),
    Line1: new FormControl(''),
    Line2: new FormControl(''),
    City: new FormControl(''),
    State: new FormControl(''),
    PostalCode: new FormControl(''),
    CountryType: new FormControl(''),
  });

  autoCalculation = true;
  isToggleable = true;

  companyDisplayName = new FormControl('Kraftwerk');
  errors = '';

  addressesData = [
    {
      Name: '',
      City: 'Anytown',
      Line1: '123 Anything St',
      Line2: 'Ste 191',
      State: 'NV',
      PostalCode: '12345',
      CountryType: 'US',
    },
    {
      Name: '',
      City: 'Anytown',
      Line1: '123 Anything St',
      Line2: 'Ste 191',
      State: 'NV',
      PostalCode: '12345',
      CountryType: 'US',
    },
    {
      Name: '',
      City: 'Anytown',
      Line1: '123 Anything St',
      Line2: 'Ste 191',
      State: 'NV',
      PostalCode: '12345',
      CountryType: 'US',
    },
  ];

  displayedColumns: string[] = [
    'state',
    'taxName',
    'taxRate',
    'chargeTaxOnShipping',
  ];

  dataSource: any[] = [
    {
      id: 1,
      state: 'NV',
      taxName: 'Sales Tax',
      taxRate: '6%',
      chargeTaxOnShipping: true,
    },
  ];

  ngOnInit(): void {
    this.addressesData.forEach((address) => {
      const group = new NgFormGroup({
        Line1: new FormControl(address.Line1),
        Line2: new FormControl(address.Line2),
        City: new FormControl(address.City),
        State: new FormControl(address.State),
        PostalCode: new FormControl(address.PostalCode),
        CountryType: new FormControl(address.CountryType),
      });

      this.addressForms.push(group);
    });
  }

  getFormGroupAt(i: number) {
    return this.addressForms.at(i) as FormGroup;
  }

  removeAddressAtIndex(i: number) {
    this.addressForms.removeAt(i);
  }

  toggleAddAddress() {
    this.addAddress = !this.addAddress;
  }

  saveNewAddress() {
    this.addressForms.push(this.newAddress);
    this.addAddress = false;
  }

  removeAddress(index: number) {
    this.addressForms.removeAt(index);
  }

  displayAddress(address) {
    if (!address.touched) {
      return 'No address currently set.';
    }

    const {
      controls: { Line1, Line2, City, State, PostalCode, CountryType },
    } = address;
    return `${Line1.value} ${Line2.value} ${City.value}, ${State.value} ${PostalCode.value} ${CountryType.value}`;
  }

  toggleEditTaxRate() {
    this.taxRateEdit = !this.taxRateEdit;
  }

  editAddress(i) {
    console.log(i);
  }

  deleteAddress(i) {
    console.log(i);
  }

  chargeTaxOnShippingChecked(event) {
    console.log(event);
  }

  changeEvent(event) {
    this.autoCalculation = event.checked;
  }

  toggleChangeEvent(event) {
    console.log(event);
  }
}

@NgModule({
  declarations: [SalesTaxPage],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    CosInputModule,
    CosButtonModule,
    CosCheckboxModule,
    CosSegmentedPanelModule,
    CosSlideToggleModule,
    CosTableModule,
    CosAddressFormModule,

    AsiPanelEditableRowModule,
  ],
})
export class SalesTaxPageModule {}
