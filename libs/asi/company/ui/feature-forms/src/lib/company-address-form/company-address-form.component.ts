import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CosAddressFormModule } from '@cosmos/components/address-form';
import { FormGroupComponent } from '@cosmos/forms';
import { Address } from '@esp/models';

@Component({
  selector: 'asi-company-address-form',
  templateUrl: './company-address-form.component.html',
  styleUrls: ['./company-address-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsiCompanyAddressFormComponent extends FormGroupComponent<Address> {}

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, CosAddressFormModule],
  declarations: [AsiCompanyAddressFormComponent],
  exports: [AsiCompanyAddressFormComponent],
})
export class AsiCompanyAddressFormComponentModule {}
