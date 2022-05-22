import { dataCySelector } from '@cosmos/testing';
import {
  EspSearchBoxModule,
  EspSearchSortModule,
  SearchBoxComponent,
  SearchSortComponent,
} from '@esp/search';
import { createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { MockComponents } from 'ng-mocks';
import { EMPTY, of } from 'rxjs';
import { CompanySearchLocalState } from '../../local-states';
import {
  CompanySearchHeaderComponent,
  CompanySearchHeaderModule,
} from './company-search-header.component';

const selectors = {
  filterPill: dataCySelector('filter-pill'),
  filterPillLabel: dataCySelector('filter-pill-label'),
};

const state: Partial<CompanySearchLocalState> = {
  filterPills: [
    {
      Value: '1',
      Label: 'Owner1',
      ControlName: 'Owners',
    },
    {
      Value: '2',
      Label: 'Owner2',
      ControlName: 'Owners',
    },
    {
      Value: '3',
      Label: 'Owner3',
      ControlName: 'Owners',
    },
  ],
};

describe('CompanySearchHeaderComponent', () => {
  const createComponent = createComponentFactory({
    component: CompanySearchHeaderComponent,
    imports: [CompanySearchHeaderModule, NgxsModule.forRoot()],
    overrideModules: [
      [
        EspSearchBoxModule,
        {
          set: {
            declarations: MockComponents(SearchBoxComponent),
            exports: MockComponents(SearchBoxComponent),
          },
        },
      ],
      [
        EspSearchSortModule,
        {
          set: {
            declarations: MockComponents(SearchSortComponent),
            exports: MockComponents(SearchSortComponent),
          },
        },
      ],
    ],
  });

  const testSetup = (options?: { state: Partial<CompanySearchLocalState> }) => {
    const mockedState = {
      ...state,
      ...options?.state,
    };
    const spectator = createComponent({
      providers: [
        mockProvider(CompanySearchLocalState, {
          ...mockedState,
          connect: () => of(mockedState),
          setFilters: () => EMPTY,
        }),
      ],
    });

    return { spectator, component: spectator.component };
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    const { spectator } = testSetup();

    expect(spectator).toBeTruthy();
  });

  it('should display record owner pills', () => {
    const { spectator } = testSetup();

    expect(spectator.queryAll(selectors.filterPill).length).toBe(3);
  });

  it('should display put correct labels on owner pills', () => {
    const { spectator } = testSetup();

    expect(spectator.query(selectors.filterPillLabel)).toHaveText('Owner1');
  });

  it('should not display record owner pills when filters are reset', () => {
    const { spectator } = testSetup({
      state: {
        filterPills: [],
      },
    });

    expect(spectator.query(selectors.filterPill)).not.toExist();
  });
});
