import { NgModule } from '@angular/core';
import { AddressTypeaheadDirective } from './address-typeahead/address-typeahead.directive';

@NgModule({
  declarations: [AddressTypeaheadDirective],
  exports: [AddressTypeaheadDirective],
})
export class CosAddressTypeaheadModule {}
