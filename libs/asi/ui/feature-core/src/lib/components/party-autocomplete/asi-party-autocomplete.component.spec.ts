import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AutocompleteService, EspAutocompleteModule } from '@esp/autocomplete';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { AsiUserTeamAutocompleteComponentModule } from '@asi/ui/feature-core';
import {
  AsiPartyAutocompleteComponent,
  AsiPartyAutocompleteComponentModule,
} from './asi-party-autocomplete.component';

describe('UserTeamAutoCompleteComponent', () => {
  let spectator: Spectator<AsiPartyAutocompleteComponent>;

  const createComponent = createComponentFactory({
    component: AsiPartyAutocompleteComponent,
    imports: [
      HttpClientTestingModule,
      NgxsModule.forRoot(),
      AsiPartyAutocompleteComponentModule,

      EspAutocompleteModule,
      AsiUserTeamAutocompleteComponentModule,
    ],
    providers: [mockProvider(AutocompleteService)],
    detectChanges: false,
  });

  beforeEach(() => {
    try {
      spectator = createComponent({
        props: {
          excludeList: ['baby', 'pampers', 'fashion', 'luxury'],
        },
      });
    } catch (error) {
      console.log('Host creation failed', error);
    }
  });

  it('should create', () => {
    expect(spectator).toBeTruthy();
  });
});
