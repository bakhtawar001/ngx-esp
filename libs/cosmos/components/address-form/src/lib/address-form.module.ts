import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { OrderByPipeModule } from '@cosmos/common';
import { CosAddressTypeaheadModule } from '@cosmos/components/address-typeahead';
import { ControlRequiredPipeModule } from '@cosmos/forms';
import { CosInputModule } from '@cosmos/components/input';
import { CosAddressFormComponent } from './address-form.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,

    CosInputModule,

    CosAddressTypeaheadModule,

    ControlRequiredPipeModule,
    OrderByPipeModule,
  ],
  declarations: [CosAddressFormComponent],
  exports: [CosAddressFormComponent],
})
export class CosAddressFormModule {}
