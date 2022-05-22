/* eslint-disable @angular-eslint/prefer-on-push-component-change-detection */
/* eslint-disable @angular-eslint/use-component-selector */
import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CosAnalyticsService } from '@cosmos/analytics';
import {
  CosPaginationComponent,
  CosPaginationModule,
} from '@cosmos/components/pagination';
import {
  CosSupplierComponent,
  CosSupplierModule,
} from '@cosmos/components/supplier';
import {
  CosSupplierCardComponent,
  CosSupplierCardModule,
} from '@cosmos/components/supplier-card';
import { RouterFacade } from '@esp/router';
import { SearchResult, SupplierSearchCriteria } from '@esp/suppliers';
import { createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { SupplierSearchResultItem } from '@smartlink/suppliers';
import { SuppliersMockDb } from '@smartlink/suppliers/mocks';
import { MockComponents } from 'ng-mocks';
import { of } from 'rxjs';
import { SupplierSearchLocalState } from '../../local-states';
import {
  SupplierSearchPage,
  SupplierSearchPageModule,
} from './supplier-search.page';

const supplier = SuppliersMockDb.suppliers[0];
const mockSuppliers = SuppliersMockDb.suppliers;
// dummy component
@Component({
  template: '',
})
class DummyComponent {}

describe('SupplierSearchPage', () => {
  const createComponent = createComponentFactory({
    component: SupplierSearchPage,
    declarations: [SupplierSearchPage],
    imports: [
      HttpClientTestingModule,
      RouterTestingModule.withRoutes([
        { path: 'suppliers/:id', component: DummyComponent },
      ]),

      NgxsModule.forRoot(),

      SupplierSearchPageModule,
    ],
    providers: [
      mockProvider(SupplierSearchLocalState, {
        connect() {
          return of(this);
        },
        search: () => of(),
      }),
      mockProvider(RouterFacade, {
        queryParams$: of({ q: '302' }),
      }),

      mockProvider(CosAnalyticsService),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    overrideModules: [
      [
        CosSupplierModule,
        {
          set: {
            declarations: MockComponents(CosSupplierComponent),
            exports: MockComponents(CosSupplierComponent),
          },
        },
      ],
      [
        CosSupplierCardModule,
        {
          set: {
            declarations: MockComponents(CosSupplierCardComponent),
            exports: MockComponents(CosSupplierCardComponent),
          },
        },
      ],
      [
        CosPaginationModule,
        {
          set: {
            declarations: MockComponents(CosPaginationComponent),
            exports: MockComponents(CosPaginationComponent),
          },
        },
      ],
    ],
  });

  const testSetup = (options?: {
    suppliers?: SupplierSearchResultItem[];
    setSpies?: boolean;
    results?: SearchResult<SupplierSearchResultItem>;
    pageSize?: number;
    from?: number;
    term?: string;
  }) => {
    const suppliers = options?.suppliers || mockSuppliers;
    const results = options?.results
      ? { ...options.results, suppliers }
      : { suppliers };
    const spectator = createComponent({
      providers: [
        mockProvider(SupplierSearchLocalState, <
          Partial<SupplierSearchLocalState>
        >{
          connect() {
            return of(this);
          },
          isLoading: false,
          hasLoaded: true,
          suppliers: results?.suppliers,
          pageSize: options?.pageSize || 48,
          results,
          search: jest.fn(() => of()),
          criteria: <SupplierSearchCriteria>(<unknown>{
            term: options?.term || '',
            excludeTerm: '',
            from: options?.from || 1,
            sortBy: 'DFLT',
            size: options?.pageSize || 48,
          }),
          from: options?.from || 1,
          term: options?.term || '',
        }),
      ],
    });

    const router = spectator.inject(Router);
    const spyNavigateFn = jest
      .spyOn(router, 'navigate')
      .mockResolvedValue(true);

    const location = spectator.inject(Location);
    if (options?.setSpies) {
      const analyticService = spectator.inject(CosAnalyticsService, true);
      const spyTrackFn = jest.spyOn(analyticService, 'track');
      return {
        spectator,
        component: spectator.component,
        location,
        spies: { spyTrackFn: spyTrackFn, spyNavigateFn: spyNavigateFn },
      };
    }
    return { spectator, component: spectator.component, location };
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    const { spectator } = testSetup();
    expect(spectator).toBeTruthy();
  });

  it('should set criteria', () => {
    const { component } = testSetup({ term: '302', from: 2 });
    expect(component.state.criteria.term).toEqual('302');
    expect(component.state.criteria.from).toEqual(2);
  });

  it("should have 'Relevance' selected as default sort, when page loads", () => {
    const { component } = testSetup();
    expect(component.sort).toEqual('Relevance');
  });

  describe('Supplier search navigation', () => {
    const results: SearchResult<SupplierSearchResultItem> = {
      Results: [...mockSuppliers],
      ResultsTotal: mockSuppliers.length,
    };

    const setupOptions = {
      results: results,
      pageSize: 48,
      term: 'test',
    };

    it('should verify the availability of the anchor tag & should be able to navigate', () => {
      const { spectator, location } = testSetup(setupOptions);
      spectator.detectChanges();
      const supplierTag = spectator.query('.supplier-results > a');
      expect(supplierTag).not.toBeNull();
      expect(supplierTag).not.toBeUndefined();
      spectator.click(supplierTag);
      expect(location.path()).toEqual(
        `/suppliers/${mockSuppliers[0].Id}?keywords=test`
      );
    });

    it('should navigate to product search on view products', () => {
      const { spectator, component, spies } = testSetup({
        ...setupOptions,
        setSpies: true,
      });
      spectator.detectChanges();
      const filter = {
        supplier: [`${supplier.Name} (asi/${supplier.AsiNumber})`],
      };
      component.gotoProduts(supplier);
      spectator.detectChanges();
      expect(spies.spyNavigateFn).toHaveBeenCalledWith(['products'], {
        queryParams: { filters: encodeURIComponent(JSON.stringify(filter)) },
      });
    });
  });

  describe('empty state', () => {
    const setupOptions = {
      results: {
        Results: [],
        ResultsTotal: 0,
      },
      pageSize: 48,
    };

    it('should contain no suppliers matching message if the results set is null or 0', () => {
      const { spectator } = testSetup(setupOptions);
      const msg = `There are no suppliers matching the selected criteria. Please clear your filters or start a new search.`;

      spectator.detectChanges();
      const resultMessage = spectator.query('.no-results-msg > h4').textContent;
      expect(resultMessage.trim()).toEqual(msg);
    });

    it('Sort By should be in disabled state if the results set is null or 0', () => {
      const { spectator } = testSetup(setupOptions);
      spectator.detectChanges();
      const anchorTag = spectator.query('.supplier-results-util-bar > div > a');
      expect(anchorTag).toHaveClass('is-disabled');
    });
  });
  describe('Pagination', () => {
    it('should set correct page on increase', () => {
      const { spectator, component } = testSetup();

      component.pageChange({ pageIndex: 5 });
      spectator.detectChanges();

      expect(component.state.from).toEqual(6);
    });

    it('should set correct page on decrease', () => {
      const { spectator, component } = testSetup();
      component.pageChange({ pageIndex: 1 });
      spectator.detectChanges();

      expect(component.state.from).toEqual(2);
    });
  });

  describe('supplier count message', () => {
    const results: SearchResult<SupplierSearchResultItem> = {
      Results: [...mockSuppliers],
      ResultsTotal: mockSuppliers.length,
      ResultsTotalIsExhaustive: true,
    };

    it('should set first page message', () => {
      const { spectator, component } = testSetup({
        results,
        pageSize: 50,
      });
      const msg = `(1-50 of <b>${component.state.results.ResultsTotal} suppliers</b>)`;
      spectator.detectChanges();
      expect(component.resultMessage).toBe(msg);
    });

    it('should set second page message', () => {
      const { spectator, component } = testSetup({
        results,
        pageSize: 50,
        from: 2,
      });

      const toCount = Math.min(component.state.results.ResultsTotal, 100);
      const msg = `(51-${toCount} of <b>${component.state.results.ResultsTotal} suppliers</b>)`;
      spectator.detectChanges();
      expect(component.resultMessage).toBe(msg);
    });

    it('should set 0 suppliers message', () => {
      const { spectator, component } = testSetup({
        results: { Results: [], ResultsTotal: 0 },
        pageSize: 50,
      });
      spectator.detectChanges();
      const msg = `(0 of <b>0 suppliers</b>)`;
      expect(component.resultMessage).toBe(msg);
    });
  });
});
