import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AsiPanelEditableRowModule } from '@asi/ui/feature-core';
import { CosAddressFormModule } from '@cosmos/components/address-form';
import { CosInputModule } from '@cosmos/components/input';
import { FormGroupComponent } from '@cosmos/forms';
import { HasRolePipeModule } from '@esp/auth';
import { Address } from '@esp/models';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { AddressDisplayComponentModule } from '../../../directory/components/address-display';
import { SettingLocalState } from '../../local-state';

type AddressFormModel = Omit<Address, 'Name' | 'Id'>;

function parseAddress(value: string) {
  if (value) {
    return JSON.parse(value) as AddressFormModel;
  }

  return {};
}

@UntilDestroy()
@Component({
  selector: 'esp-company-address-panel-row-form',
  templateUrl: './company-address-panel-row.form.html',
  styleUrls: ['./company-address-panel-row.form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    SettingLocalState.forComponent({
      settingCode: 'company_profile.address',
    }),
  ],
})
export class CompanyAddressPanelRowForm extends FormGroupComponent<AddressFormModel> {
  constructor(public readonly state: SettingLocalState) {
    super();

    state
      .connect(this)
      .pipe(
        map((x) => x.value),
        distinctUntilChanged(),
        untilDestroyed(this)
      )
      .subscribe((value) => {
        this.form.reset(parseAddress(value));
      });
  }

  save(): void {
    this.state.save(JSON.stringify(this.form.value));
  }
}

@NgModule({
  declarations: [CompanyAddressPanelRowForm],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    HasRolePipeModule,

    CosAddressFormModule,
    CosInputModule,

    AddressDisplayComponentModule,
    AsiPanelEditableRowModule,
  ],
  exports: [CompanyAddressPanelRowForm],
})
export class CompanyAddressPanelRowFormModule {}
