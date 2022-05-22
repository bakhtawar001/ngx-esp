import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CosInputModule } from '@cosmos/components/input';
import markdown from './address-typeahead.md';
import { CosAddressTypeaheadModule } from '../address-typeahead.module';

@Component({
  selector: 'cos-address-typeahead-component',
  template: `
    <input
      cos-input
      cos-address-typeahead
      [options]="options"
      (addressChanged)="onSelect($event)"
    />
    <pre>{{ address | json }}</pre>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class AddressTypeaheadComponent {
  address;
  onSelect(address) {
    this.address = address;
  }
}

export default {
  title: 'Controls & Inputs/AddressTypeahead',
  parameters: {
    notes: markdown,
  },
};

export const Default = () => ({
  moduleMetadata: {
    imports: [CosAddressTypeaheadModule, CosInputModule],
    declarations: [AddressTypeaheadComponent],
  },
  component: AddressTypeaheadComponent,
  // props: {
  //   disabled: boolean('Disabled', false),
  //   placeholder: text(
  //     'Placeholder text',
  //     'Search for address/place or building'
  //   ),
  // },
});
