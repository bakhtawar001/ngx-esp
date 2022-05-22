import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  Inject,
  NgModule,
} from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { AsiPanelEditableRowModule } from '@asi/ui/feature-core';
import { ValidateWhitespace } from '@cosmos/common';
import { CosAddressFormModule } from '@cosmos/components/address-form';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCheckboxModule } from '@cosmos/components/checkbox';
import { CosSegmentedPanelModule } from '@cosmos/components/segmented-panel';
import { AbstractControl, FormArrayComponent, FormGroup } from '@cosmos/forms';
import { Address, PartyBase } from '@esp/models';
import { PARTY_LOCAL_STATE, PartyLocalState } from '@esp/parties';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { isEqual } from 'lodash-es';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { AddressDisplayComponentModule } from '../../../directory/components/address-display';

@UntilDestroy()
@Component({
  selector: 'esp-address-list-panel-form',
  templateUrl: './address-list-panel.form.html',
  styleUrls: ['./address-list-panel.form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressListPanelForm
  extends FormArrayComponent<Address>
  implements AfterContentInit
{
  activeRow: number | null = null;
  isAddressExisting = false;

  constructor(
    @Inject(PARTY_LOCAL_STATE) public readonly state: PartyLocalState
  ) {
    super();
  }

  ngAfterContentInit(): void {
    this.state
      .connect(this)
      .pipe(
        map((x) => x.party),
        distinctUntilChanged(isEqual),
        filter(Boolean),
        map(({ Addresses }) => Addresses),
        untilDestroyed(this)
      )
      .subscribe((addresses: Address[]) => {
        this.isAddressExisting =
          !!addresses.length &&
          addresses.every((address) => this.checkIsAddressExisting(address));
        this.resetForm();
      });
  }

  override addItem(): void {
    if (this.form.valid) {
      super.addItem();
    }

    this.activeRow = this.groups.length - 1;
  }

  cancelEdit(): void {
    this.resetForm();
  }

  override removeItem(address: AbstractControl<Address>): void {
    super.removeItem(address);

    if (this.form.value.length === 0) {
      this.form.reset([{ IsPrimary: true }]);
    }

    this.resetActiveRow();

    // If the user removes the address that is not linked to contact yet (e.g. the user clicks `Add`
    // and then clicks `Remove`), we shouldn't call `save()` since this will make an unnecessary HTTP request.
    if (address.value.Id === null) {
      return;
    }

    this.save();
  }

  save(address?: Address, index?: number): void {
    if (address?.Type === 'BLNG') {
      this.resetBillingType(index);
    }

    if (address?.IsPrimary) {
      this.resetPrimary(index);
    }

    this.removeEmptyControls();

    this.resetActiveRow();
    this.state.save({ Addresses: this.form.value });
  }

  setAddressType(address: FormGroup<Address>, Type: 'BLNG' | 'GNRL'): void {
    address.markAsDirty();
    address.patchValue({ Type });
    address.updateValueAndValidity({ emitEvent: true });
  }

  protected createArrayControl(): FormGroup<Address> {
    return this._fb.group<Address>({
      Id: 0,
      Name: ['', [Validators.required, ValidateWhitespace]],
      Line1: ['', [Validators.required, ValidateWhitespace]],
      Line2: [''],
      City: [''],
      County: [''],
      State: [''],
      PostalCode: [''],
      CountryType: [''],
      IsPrimary: [false],
      Type: ['GNRL'],
    });
  }

  private checkIsAddressExisting(address: Address): boolean {
    return address.Id !== undefined;
  }

  private removeEmptyControls(): void {
    const formArray = this.form;

    for (let i = formArray.length - 1; i >= 0; i--) {
      if (!this.groups[i].value.Name) {
        formArray.removeAt(i);
      }
    }

    if (!formArray.value.some((item) => item.IsPrimary)) {
      this.groups[0]?.patchValue({ IsPrimary: true });
    }
  }

  private resetForm(): void {
    const items = Object.assign(
      [],
      (this.state.party as PartyBase)?.Addresses ?? []
    );

    if (items.length === 0) {
      items.push({ IsPrimary: true });
    }

    this.form.reset(items);
    this.resetActiveRow();
  }

  private resetPrimary(index: number): void {
    for (let i = 0; i < this.groups.length; i++) {
      if (i === index) continue;

      const value = this.groups[i].value;

      if (value.IsPrimary) {
        this.groups[i].patchValue({ IsPrimary: false });
      }
    }
  }

  private resetBillingType(index: number): void {
    for (let i = 0; i < this.groups.length; i++) {
      if (i === index) continue;

      const value = this.groups[i].value;

      if (value.Type === 'BLNG') {
        this.groups[i].patchValue({ Type: 'GNRL' });
      }
    }
  }

  private resetActiveRow(): void {
    this.activeRow = null;
  }
}

@NgModule({
  declarations: [AddressListPanelForm],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    CosAddressFormModule,
    CosButtonModule,
    CosCheckboxModule,
    CosSegmentedPanelModule,
    AddressDisplayComponentModule,
    AsiPanelEditableRowModule,
  ],
  exports: [AddressListPanelForm],
})
export class AddressListPanelFormModule {}
