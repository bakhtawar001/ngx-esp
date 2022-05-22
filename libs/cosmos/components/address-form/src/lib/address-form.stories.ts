/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { EspLookupTypesModule } from '@esp/lookup-types';
import { NgxsModule } from '@ngxs/store';
import { CosAddressFormComponent } from './address-form.component';
import markdown from './address-form.md';
import { CosAddressFormModule } from './address-form.module';

export default {
  title: 'Controls & Inputs/AddressForm',
  parameters: {
    notes: markdown,
  },
};

export const Default = () => {
  return {
    moduleMetadata: {
      imports: [
        HttpClientModule,
        ReactiveFormsModule,

        NgxsModule.forRoot(),
        EspLookupTypesModule,

        CosAddressFormModule,
      ],
    },
    component: CosAddressFormComponent,
    props: {
      // output: text('Output', ''),
      // input: boolean('Pass address input', false),
      // validateFields: boolean('Validate fields', false),
    },
  };
};
