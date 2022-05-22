import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { Validators } from '@angular/forms';
import { Store } from '@ngxs/store';

import { Address } from '@esp/models';
import { FormGroupComponent } from '@cosmos/forms';
import { LookupTypeQueries } from '@esp/lookup-types';

import { StatesMap } from './states-map';

@Component({
  selector: 'cos-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // eslint-disable-next-line @angular-eslint/use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None,
})
export class CosAddressFormComponent extends FormGroupComponent<Address> {
  // @TODO: clarify if we can reuse it or should create new one
  @Input()
  showAllFields = true;
  @Input()
  showFirstLineLabel = true;

  public countries$ = this.store.select(LookupTypeQueries.lookups.Countries);

  constructor(private readonly store: Store) {
    super();
  }

  get states() {
    return StatesMap[
      <keyof typeof StatesMap>this.form.get('CountryType')?.value
    ];
  }

  setAddress(address: Address) {
    this.form.markAsDirty();
    this.form.markAllAsTouched();

    this.form.patchValue(address);
  }

  protected override createForm() {
    return this._fb.group<Address>({
      Id: 0,
      Name: ['', Validators.required],
      Line1: [''],
      Line2: [''],
      City: [''],
      County: [''],
      State: [''],
      PostalCode: [''],
      CountryType: [''],
      IsPrimary: [true],
    });
  }
}
