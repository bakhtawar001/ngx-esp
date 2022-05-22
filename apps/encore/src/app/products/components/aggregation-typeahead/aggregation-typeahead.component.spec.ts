import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import {
  AggregationTypeAheadComponent,
  AggregationTypeaheadComponentModule,
} from './aggregation-typeahead.component';
import { SEARCH_FILTER_LOCAL_STATE, SearchFilterLocalState } from '@esp/search';
import { EMPTY } from 'rxjs';

describe('AggregationComponent', () => {
  let spectator: Spectator<AggregationTypeAheadComponent>;
  let component: AggregationTypeAheadComponent;

  const createComponent = createComponentFactory({
    component: AggregationTypeAheadComponent,
    imports: [
      AggregationTypeaheadComponentModule,
      NgxsModule.forRoot(),
      HttpClientTestingModule,
    ],
    providers: [
      {
        provide: SEARCH_FILTER_LOCAL_STATE,
        useValue: {
          connect: () => EMPTY,
          facets: {
            name: '',
          },
        },
      },
      mockProvider(SearchFilterLocalState, {
        facets: () => EMPTY,
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
