/// <reference types="@types/googlemaps" />
import {
  createDirectiveFactory,
  SpectatorDirective,
} from '@ngneat/spectator/jest';
import '__mocks__/googlePlacesMock';
import { CosInputModule } from '@cosmos/components/input';
import { AddressTypeaheadDirective } from './address-typeahead.directive';
import { CosAddressTypeaheadModule } from '../address-typeahead.module';

describe('GooglePlacesAutocompleteDirective', () => {
  let host: SpectatorDirective<AddressTypeaheadDirective>;

  const createDirective = createDirectiveFactory({
    directive: AddressTypeaheadDirective,
    imports: [CosInputModule, CosAddressTypeaheadModule],
    declareDirective: false,
  });

  beforeEach(() => {
    try {
      host = createDirective('<input cos-address-typeahead>');
    } catch (error) {
      console.log('directive creation error', host);
    }
  });

  it('should create an instance', () => {
    expect(host).toBeDefined();
  });
});
