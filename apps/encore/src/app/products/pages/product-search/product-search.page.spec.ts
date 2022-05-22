import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { fakeAsync } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { CosAnalyticsService, TrackEvent } from '@cosmos/analytics';
import { CosToastService } from '@cosmos/components/notification';
import {
  CosPaginationComponent,
  CosPaginationModule,
} from '@cosmos/components/pagination';
import {
  AD_TYPES_FOR_AD_LABEL,
  CosProductCardComponent,
  CosProductCardModule,
} from '@cosmos/components/product-card';
import {
  CosSupplierComponent,
  CosSupplierFooterComponent,
  CosSupplierModule,
} from '@cosmos/components/supplier';
import { productToCollectionProduct } from '@esp/collections';
import {
  Product,
  ProductSearchCriteria,
  ProductTrackEvent,
  ProductViewEvent,
  SearchResult,
} from '@esp/products';
import { RouterFacade } from '@esp/router';
import { createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { ProductSearchResultItem } from '@smartlink/models';
import { ProductsMockDb } from '@smartlink/products/mocks';
import { isUndefined } from 'lodash-es';
import { MockComponents } from 'ng-mocks';
import { of } from 'rxjs';
import { CollectionsDialogService } from '../../../collections/services';
import { PresentationsDialogService } from '../../../presentations/services';
import { AddToPresentationFlow } from '../../../projects/flows';
import {
  ProductSearchFiltersComponent,
  ProductSearchFiltersComponentModule,
} from '../../components/product-search-filters';
import { ProductSearchLocalState } from '../../local-states';
import { ProductsDialogService } from '../../services';
import { mapProduct, productToProductEvent } from '../../utils';
import {
  ProductSearchPage,
  ProductSearchPageModule,
} from './product-search.page';

const product = ProductsMockDb.products[0];
const mockProducts = ProductsMockDb.products;

const getMapFromArray = (key: string) => (arr) => {
  const newMap = new Map();
  arr.forEach((item) => {
    if (!isUndefined(item[key])) {
      newMap.set(item[key], item);
    }
  });
  return newMap;
};
const getMap = getMapFromArray('Id');

// dummy component
/* eslint-disable @angular-eslint/use-component-selector */
/* eslint-disable @angular-eslint/prefer-on-push-component-change-detection */
@Component({
  template: '',
})
class DummyComponent {}

describe('ProductSearchPage', () => {
  const createComponent = createComponentFactory({
    component: ProductSearchPage,
    declarations: [ProductSearchPage],
    imports: [
      HttpClientTestingModule,
      RouterTestingModule.withRoutes([
        { path: 'products/:id', component: DummyComponent },
      ]),

      NgxsModule.forRoot(),

      ProductSearchPageModule,
    ],
    providers: [
      mockProvider(ProductSearchLocalState, {
        connect() {
          return of(this);
        },
        search: () => of(),
      }),
      mockProvider(RouterFacade, {
        queryParams$: of({ q: 'mugs' }),
      }),
      mockProvider(MatDialog),
      mockProvider(CollectionsDialogService),
      mockProvider(PresentationsDialogService),
      mockProvider(ProductsDialogService),
      mockProvider(CosToastService),
      mockProvider(AddToPresentationFlow),
      mockProvider(CosAnalyticsService),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    overrideModules: [
      [
        ProductSearchFiltersComponentModule,
        {
          set: {
            declarations: MockComponents(ProductSearchFiltersComponent),
            exports: MockComponents(ProductSearchFiltersComponent),
          },
        },
      ],
      [
        CosSupplierModule,
        {
          set: {
            declarations: MockComponents(
              CosSupplierComponent,
              CosSupplierFooterComponent
            ),
            exports: MockComponents(
              CosSupplierComponent,
              CosSupplierFooterComponent
            ),
          },
        },
      ],
      [
        CosProductCardModule,
        {
          set: {
            declarations: MockComponents(CosProductCardComponent),
            exports: MockComponents(CosProductCardComponent),
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
    products?: ProductSearchResultItem[];
    setSpies?: boolean;
    results?: SearchResult<ProductSearchResultItem>;
    pageSize?: number;
    from?: number;
    term?: string;
  }) => {
    const products = options?.products || mockProducts;
    const results = options?.results
      ? { ...options.results, products }
      : { products };
    const spectator = createComponent({
      providers: [
        mockProvider(ProductSearchLocalState, <
          Partial<ProductSearchLocalState>
        >{
          connect() {
            return of(this);
          },
          isLoading: false,
          hasLoaded: true,
          products: results?.products,
          pageSize: options?.pageSize || 48,
          results,
          search: jest.fn(() => of()),
          criteria: <ProductSearchCriteria>(<unknown>{
            term: options?.term || '',
            excludeTerm: ['', []],
            from: options?.from || 1,
            aggregationsOnly: [false],
            sortBy: ['DFLT'],
            size: options?.pageSize || 48,
            organicSize: 1,
            filters: {},
            priceFilter: {},
            numericFilters: [[]],
          }),
          from: options?.from || 1,
          term: options?.term || '',
        }),
      ],
    });
    const location = spectator.inject(Location);
    if (options?.setSpies) {
      const modalService = spectator.inject(CollectionsDialogService, true);
      const spyFn = jest.spyOn(modalService, 'addToCollection').mockReturnValue(
        of({
          Collection: { Name: 'some result' },
          ProductsDuplicated: [],
          ProductsTruncated: [],
        })
      );
      const toastService = spectator.inject(CosToastService, true);
      const errorSpy = jest.spyOn(toastService, 'error').mockImplementation();
      const analyticService = spectator.inject(CosAnalyticsService, true);
      const spyTrackFn = jest.spyOn(analyticService, 'track');
      return {
        spectator,
        component: spectator.component,
        spies: { spyFn: spyFn, errorSpy: errorSpy, spyTrackFn: spyTrackFn },
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

  describe('Product search Stats', () => {
    const results: SearchResult<ProductSearchResultItem> = {
      Results: [...mockProducts],
      ResultsTotal: mockProducts.length,
      SuppliersTotal: 10,
      ResultsTotalIsExhaustive: true,
    };

    const setupOptions = {
      results: results,
      pageSize: 48,
      term: 'mugs',
    };

    it('should trigger the product-list-view event', fakeAsync(() => {
      const {
        spectator,
        component,
        spies: { spyTrackFn },
      } = testSetup({ ...setupOptions, setSpies: true });
      const pfpMode: string = component.state.results?.PfpDiagnostics?.PfpMode;
      const products: Product[] = mockProducts.map((product, index) =>
        productToProductEvent(product, index + 1, pfpMode)
      );
      const productViewTrackEvent: TrackEvent<ProductViewEvent> = {
        action: 'Product List Viewed',
        properties: {
          products: products,
          marketSegmentCode: 'ALL',
          pageNumber: component.state.pageIndex + 1,
          index: component.state.index,
        },
      };
      spectator.component.state.term = 'mugs';
      spectator.detectChanges();
      spectator.tick(400);

      expect(spyTrackFn).toBeCalledWith(productViewTrackEvent);
    }));
  });
  it('should check product', () => {
    const { component } = testSetup();

    component.toggleChecked(product);
    expect(component.checkedProducts.size).toBeGreaterThan(0);
  });

  it('should select all products', fakeAsync(() => {
    const { spectator, component } = testSetup();

    component.selectAll({ checked: true });
    spectator.tick();
    expect(component.checkedProducts.size).toBeGreaterThan(0);
  }));

  // it('should apply filter', () => {
  //   component.filtersForm.patchValue({
  //     CategoryGroup: 'mugs',
  //     PriceFiltes: {
  //       Quantity: 10,
  //       From: 0,
  //       To: 20,
  //     },
  //     CategorySearchTerm: 'mugs',
  //   });
  //   component.applyFilter();
  //   expect(component.searchCriteriaForm.get('Terms').value).toContain('mugs');
  // });

  it('should get selected text based on selected products', () => {
    const { component } = testSetup();

    expect(component.selectedText).toEqual('Product Selected');
    component.checkedProducts = getMap(mockProducts.slice(0, 5));
    expect(component.selectedText).toEqual('Products Selected');
  });

  it('should set criteria', () => {
    const { component } = testSetup({ term: 'mugs', from: 2 });
    expect(component.state.criteria.term).toEqual('mugs');
    expect(component.state.criteria.from).toEqual(2);
  });

  it("should have 'Relevance' selected as default sort, when page loads", () => {
    const { component } = testSetup();
    expect(component.sort).toEqual('Relevance');
  });

  it('should show colors variants with proper plural notation.', () => {
    //Arrange
    const products = mockProducts.slice(0, 5).map((product, index) => ({
      ...product,
      ColorCount: index < 1 ? 1 : index + 1,
    }));

    const { spectator, component } = testSetup({ products });

    spectator.detectChanges();
    spectator.detectComponentChanges();
    component.state.products.map(mapProduct).map((product, index) => {
      //Assert
      expect(product.VariantTag).toEqual(
        `${products[index].ColorCount} Color${
          products[index].ColorCount > 1 ? 's' : ''
        }`
      );
    });
  });

  describe('Toolbar', () => {
    it('Tool bar should be displayed when user selects one or more products from search results page.', () => {
      const { spectator, component } = testSetup({
        products: mockProducts.slice(0, 10),
      });
      component.checkedProducts = getMap(mockProducts.slice(0, 5));

      spectator.detectChanges();
      spectator.detectComponentChanges();
      const toolbar = spectator.query('cos-action-bar');
      expect(toolbar).toExist();
    });

    it("Tool bar should be displayed with 'select all' checkbox, text as n Products selected, 'Add to collection', 'Share' and 'Add to presentation' buttons", () => {
      const { spectator, component } = testSetup();
      component.checkedProducts = getMap(mockProducts.slice(0, 5));

      spectator.detectChanges();
      spectator.detectComponentChanges();
      const toolbar = spectator.query('cos-action-bar');
      expect(toolbar).toExist();
      const checkboxLabel = spectator.query(
        'cos-checkbox.checkbox-products > label > span.cos-checkbox-label'
      );

      expect(checkboxLabel).toExist();
      expect(component.checkedProducts.size).toEqual(5);
      expect(checkboxLabel).toHaveText(
        `${component.checkedProducts.size} Products Selected`
      );

      const optionsBtn = spectator.query(
        '.cos-action-bar > .cos-action-bar-container > .card-actions > .cos-action-bar-controls'
      ).children[0].children[0].children[0];
      expect(optionsBtn).toExist();
      spectator.click(optionsBtn);
      const actionbar = spectator.queryAll(
        '.cos-action-bar-menu-container > .cos-action-bar-menu > div > button'
      );
      expect(actionbar[0]).toHaveText('Share');
      expect(actionbar[1]).toHaveText('Add to Collection');
      expect(actionbar[2]).toHaveText('Add to Presentation');
    });

    it("Text should be updated correctly on tool bar when user selects single product as '1 Product selected'", () => {
      const { spectator, component } = testSetup();
      component.checkedProducts = getMap(mockProducts.slice(0, 1));

      spectator.detectChanges();
      spectator.detectComponentChanges();
      const toolbar = spectator.query('cos-action-bar');
      expect(toolbar).toExist();
      const checkboxLabel = spectator.query(
        'cos-checkbox.checkbox-products > label > span.cos-checkbox-label'
      );

      expect(checkboxLabel).toExist();
      expect(component.checkedProducts.size).toEqual(1);
      expect(checkboxLabel).toHaveText(
        `${component.checkedProducts.size} Product Selected`
      );
    });
    it('Count of selected products should be updated correctly when user selects products individually across different pages', () => {
      const { spectator, component } = testSetup();
      component.checkedProducts = getMap(mockProducts.slice(0, 5));

      spectator.detectChanges();
      spectator.detectComponentChanges();

      expect(component.checkedProducts.size).toEqual(5);

      component.toggleChecked(mockProducts[5]);
      spectator.detectChanges();
      spectator.detectComponentChanges();

      const toolbar = spectator.query('cos-action-bar');
      expect(toolbar).toExist();
      const checkboxLabel = spectator.query(
        'cos-checkbox.checkbox-products > label > span.cos-checkbox-label'
      );

      expect(checkboxLabel).toExist();
      expect(component.checkedProducts.size).toEqual(6);
      expect(checkboxLabel).toHaveText(
        `${component.checkedProducts.size} Products Selected`
      );

      component.toggleChecked(mockProducts[6]);
      spectator.detectChanges();
      spectator.detectComponentChanges();
      expect(checkboxLabel).toExist();
      expect(component.checkedProducts.size).toEqual(7);
      expect(checkboxLabel).toHaveText(
        `${component.checkedProducts.size} Products Selected`
      );
    });

    it('Count of the products should be updated correctly when user unselects one or more products individually from one or more pages', () => {
      const { spectator, component } = testSetup();
      component.checkedProducts = getMap(mockProducts.slice(0, 5));

      spectator.detectChanges();
      spectator.detectComponentChanges();

      expect(component.checkedProducts.size).toEqual(5);

      component.toggleChecked(mockProducts[0]);
      spectator.detectChanges();
      spectator.detectComponentChanges();

      const toolbar = spectator.query('cos-action-bar');
      expect(toolbar).toExist();
      const checkboxLabel = spectator.query(
        'cos-checkbox.checkbox-products > label > span.cos-checkbox-label'
      );

      expect(checkboxLabel).toExist();
      expect(component.checkedProducts.size).toEqual(4);
      expect(checkboxLabel).toHaveText(
        `${component.checkedProducts.size} Products Selected`
      );

      component.toggleChecked(mockProducts[1]);
      spectator.detectChanges();
      spectator.detectComponentChanges();
      expect(checkboxLabel).toExist();
      expect(component.checkedProducts.size).toEqual(3);
      expect(checkboxLabel).toHaveText(
        `${component.checkedProducts.size} Products Selected`
      );
    });

    it('Count of the selected products on tool bar should be updated correctly when user selects all visible products using the checkbox on the tool bar', () => {
      const { spectator, component } = testSetup({
        pageSize: 10,
        products: mockProducts.slice(0, 10),
      });
      component.checkedProducts = getMap([]);

      spectator.detectChanges();
      spectator.detectComponentChanges();

      expect(component.checkedProducts.size).toEqual(0);

      component.selectAll({ checked: true });
      spectator.detectChanges();
      spectator.detectComponentChanges();

      const toolbar = spectator.query('cos-action-bar');
      expect(toolbar).toExist();
      const checkboxLabel = spectator.query(
        'cos-checkbox.checkbox-products > label > span.cos-checkbox-label'
      );

      expect(checkboxLabel).toExist();
      expect(component.checkedProducts.size).toEqual(10);
      expect(checkboxLabel).toHaveText(
        `${component.checkedProducts.size} Products Selected`
      );
    });

    it('Checkbox on tool bar should be selected when all visible products are selected.', () => {
      const { spectator, component } = testSetup({
        pageSize: 10,
        products: mockProducts.slice(0, 10),
      });
      component.checkedProducts = getMap(component.state.products.slice(0, 9));
      spectator.detectChanges();
      spectator.detectComponentChanges();
      component.toggleChecked(mockProducts[9]);
      spectator.detectChanges();
      spectator.detectComponentChanges();

      const toolbar = spectator.query('cos-action-bar');
      expect(toolbar).toExist();
      const checkbox = spectator.query('.cos-checkbox.checkbox-products');
      expect(checkbox).toExist();
      expect(component.allChecked).toBeTruthy();
      expect(checkbox).toHaveClass('cos-checkbox cos-checkbox-checked');
    });

    it("Checkbox on tool bar should be displayed as '-' when some of the visible products are selected", () => {
      const { spectator, component } = testSetup();
      component.checkedProducts = getMap(mockProducts.slice(0, 5));
      spectator.detectChanges();
      spectator.detectComponentChanges();

      const toolbar = spectator.query('cos-action-bar');
      expect(toolbar).toExist();
      const checkbox = spectator.query('.cos-checkbox.checkbox-products');
      expect(checkbox).toExist();
      expect(checkbox).toHaveClass(
        'cos-checkbox cos-checkbox-indeterminate cos-checkbox-checked'
      );
    });

    it('Selecting checkbox from tool bar should select all visible products', () => {
      const { spectator, component } = testSetup();
      component.checkedProducts = getMap([]);

      spectator.detectChanges();

      spectator.detectComponentChanges();

      component.selectAll({ checked: true });
      spectator.detectChanges();
      spectator.detectComponentChanges();

      const toolbar = spectator.query('cos-action-bar');
      expect(toolbar).toExist();

      expect(component.checkedProducts.size).toEqual(
        component.state.products.length
      );
    });
    it('Tool bar should be hidden when user unselects all products using unselect checkbox from tool bar', () => {
      const { spectator, component } = testSetup();
      component.checkedProducts = getMap([]);
      spectator.detectChanges();

      spectator.detectComponentChanges();

      component.selectAll({ checked: false });
      spectator.detectChanges();
      spectator.detectComponentChanges();
      expect(component.checkedProducts.size).toEqual(0);

      const toolbar = spectator.query('cos-action-bar');
      expect(toolbar).not.toExist();
    });
  });

  describe('Add to collection', () => {
    it('should add product to collection', () => {
      const {
        spectator,
        component,
        spies: { spyFn },
      } = testSetup({ setSpies: true });
      component.addToCollection(product);

      spectator.detectChanges();
      expect(spyFn).toHaveBeenCalled();
    });

    it('should add bulk products to collection', () => {
      const {
        spectator,
        component,
        spies: { spyFn },
      } = testSetup({ setSpies: true });

      component.addToCollection(product);
      spectator.detectChanges();
      expect(spyFn).toHaveBeenCalled();
    });

    it('User should be redirected back to the search results when product is not added to a collection(e.g. Duplicate product)', () => {
      const {
        spectator,
        component,
        spies: { spyFn },
      } = testSetup({ setSpies: true });

      component.addToCollection(product);
      spectator.detectChanges();
      expect(spyFn).toHaveBeenCalled();
      expect(component.state.from).toEqual(component.state.criteria.from);
    });

    it('User should be redirected back to the page in search results from where user selected and adds a product successfully. (e.g. If product added from page 2 should be brought back to page 2)', () => {
      const {
        spectator,
        component,
        spies: { spyFn },
      } = testSetup({ setSpies: true });

      component.pageChange({ pageIndex: 1 });
      spectator.detectChanges();
      component.addToCollection(product);
      spectator.detectChanges();
      expect(spyFn).toHaveBeenCalled();
      expect(component.state.from).toEqual(2);
    });

    it('Sort should be retained when user successfully adds a product and redirected back to the search results page', () => {
      const {
        spectator,
        component,
        spies: { spyFn },
      } = testSetup({ setSpies: true });
      component.addToCollection(product);
      spectator.detectChanges();
      expect(spyFn).toHaveBeenCalled();
      expect(component.sort).toEqual(
        component.sortMenuOptions[component.state.criteria.sortBy.toString()]
      );
    });
    it('Product should not be added when the target collection already has 250 products', () => {
      const {
        spectator,
        component,
        spies: { errorSpy },
      } = testSetup({ setSpies: true });
      component.checkedProducts = ProductsMockDb.checkedProducts(251);
      spectator.detectChanges();
      component.addToCollection(product);
      expect(errorSpy).toHaveBeenCalled();
    });

    it('User should be able to add a product when the target collection has less than 250 products', () => {
      const {
        spectator,
        component,
        spies: { spyFn },
      } = testSetup({ setSpies: true });
      component.checkedProducts = ProductsMockDb.checkedProducts(249);

      spectator.detectChanges();
      component.addToCollection(product);
      expect(spyFn).toHaveBeenCalled();
    });

    it('All selected products should be added successfully when user select multiple products across different pages and adds them to a collection', () => {
      const {
        spectator,
        component,
        spies: { spyFn },
      } = testSetup({ setSpies: true });

      component.checkedProducts = getMap(mockProducts.slice(0, 3));
      spectator.detectChanges();
      component.pageChange({ pageIndex: 1 });
      component.checkedProducts = getMap([
        ...component.checkedProducts,
        ...mockProducts.slice(
          component.state.criteria.size,
          component.state.criteria.size
        ),
      ]);
      spectator.detectChanges();
      component.addToCollection();
      spectator.detectChanges();
      expect(component.state.from).toBe(2);
      expect(spyFn).toHaveBeenCalled();
      expect(spyFn).toHaveBeenCalledWith(
        Array.from(component.checkedProducts.values()).map(
          productToCollectionProduct
        )
      );
    });

    it('User should be redirected back to the search results page when user selects multiple products and add all products to a collection successfully from Add Collection Modal', () => {
      const {
        spectator,
        component,
        spies: { spyFn },
      } = testSetup({ setSpies: true });

      component.checkedProducts = getMap(mockProducts.slice(0, 3));
      spectator.detectChanges();
      component.addToCollection();
      spectator.detectChanges();
      expect(spyFn).toHaveBeenCalled();
      expect(component.state.from).toEqual(component.state.criteria.from);
      expect(spyFn).toHaveBeenCalledWith(
        Array.from(component.checkedProducts.values()).map(
          productToCollectionProduct
        )
      );
    });

    it('User should be redirected back to the search results when some products are added and some are not after user selects multiple products and add them to a collection from Add Collection Modal', () => {
      const {
        spectator,
        component,
        spies: { spyFn },
      } = testSetup({ setSpies: true });

      component.checkedProducts = getMap(mockProducts.slice(0, 5));
      spectator.detectChanges();
      component.addToCollection();
      spectator.detectChanges();
      expect(spyFn).toHaveBeenCalled();
      expect(component.state.from).toEqual(component.state.criteria.from);
      expect(spyFn).toHaveBeenCalledWith(
        Array.from(component.checkedProducts.values()).map(
          productToCollectionProduct
        )
      );
    });

    it('User should be redirected back to the search results when none of the products are added after user selects multiple products and add them to a collection from Add Collection Modal', () => {
      const {
        spectator,
        component,
        spies: { spyFn },
      } = testSetup({ setSpies: true });

      component.checkedProducts = getMap(mockProducts.slice(0, 5));
      spectator.detectChanges();
      component.addToCollection();
      spectator.detectChanges();
      expect(spyFn).toHaveBeenCalled();
      expect(component.state.from).toEqual(component.state.criteria.from);
      expect(spyFn).toHaveBeenCalledWith(
        Array.from(component.checkedProducts.values()).map(
          productToCollectionProduct
        )
      );
    });

    it('User should be redirected back to the correct page in search results where user selects products from single page other than page 1. (e.g. if user added product from page 2 should be brought back to page 2)', () => {
      const {
        spectator,
        component,
        spies: { spyFn },
      } = testSetup({ setSpies: true });

      component.checkedProducts = getMap(mockProducts.slice(0, 5));
      spectator.detectChanges();

      component.pageChange({ pageIndex: 1 });
      spectator.detectChanges();

      component.addToCollection();
      spectator.detectChanges();
      expect(spyFn).toHaveBeenCalled();
      // expect(component.state.from).toEqual(component.state.criteria.From);
      expect(spyFn).toHaveBeenCalledWith(
        Array.from(component.checkedProducts.values()).map(
          productToCollectionProduct
        )
      );
    });

    it('User should be redirected back to the correct page in search results where user selects products from multiple pages(i.e. last page user was on) and adds to a collection', () => {
      const {
        spectator,
        component,
        spies: { spyFn },
      } = testSetup({ setSpies: true });

      component.checkedProducts = getMap(mockProducts.slice(0, 3));
      spectator.detectChanges();
      component.pageChange({ pageIndex: 1 });
      component.checkedProducts = getMap([
        ...component.checkedProducts,
        ...mockProducts.slice(
          component.state.criteria.size,
          component.state.criteria.size
        ),
      ]);
      spectator.detectChanges();
      component.addToCollection();
      spectator.detectChanges();
      expect(spyFn).toHaveBeenCalled();
      expect(component.state.from).toEqual(2);
      expect(spyFn).toHaveBeenCalledWith(
        Array.from(component.checkedProducts.values()).map(
          productToCollectionProduct
        )
      );
    });

    it('Product selections should not be retained and toolbar should not be visible, when user selects and adds multiple products to a collection successfully and redirected back to the search results page', () => {
      const {
        spectator,
        component,
        spies: { spyFn },
      } = testSetup({ setSpies: true });

      component.checkedProducts = getMap(mockProducts.slice(0, 5));
      spectator.detectChanges();
      component.addToCollection();
      spectator.detectChanges();
      expect(spyFn).toHaveBeenCalled();
      expect(spyFn).toHaveBeenCalledWith(
        Array.from(component.checkedProducts.values()).map(
          productToCollectionProduct
        )
      );
      component.checkedProducts.clear();
      spectator.detectChanges();
      const toolbar = spectator.query('cos-action-bar');
      expect(toolbar).not.toBeVisible();
      expect(component.checkedProducts.size).toEqual(0);
    });

    it('Sort selection should be retained after changing default sort order when user successfully adds a product and redirected back to the search results page', () => {
      const {
        spectator,
        component,
        spies: { spyFn },
      } = testSetup({ setSpies: true });

      component.checkedProducts = getMap(mockProducts.slice(0, 4));
      spectator.detectChanges();
      component.setSortValue(component.sortMenuOptions[1]);
      component.addToCollection();
      spectator.detectChanges();
      expect(spyFn).toHaveBeenCalled();
      expect(spyFn).toHaveBeenCalledWith(
        Array.from(component.checkedProducts.values()).map(
          productToCollectionProduct
        )
      );
      expect(component.sort).toEqual(
        component.sortMenuOptions[component.state.criteria.sortBy.toString()]
      );
    });

    it('All selected products should be added to a collection when user selects some products, add or remove a filter and then add products to a collection', () => {
      const {
        spectator,
        component,
        spies: { spyFn },
      } = testSetup({ setSpies: true });

      component.checkedProducts = getMap(mockProducts.slice(0, 4));
      spectator.detectChanges();
      component.state.criteria.filters = {
        ...component.state.criteria.filters,
      };
      spectator.detectChanges();
      component.addToCollection();
      spectator.detectChanges();
      expect(spyFn).toHaveBeenCalled();
      expect(spyFn).toHaveBeenCalledWith(
        Array.from(component.checkedProducts.values()).map(
          productToCollectionProduct
        )
      );
    });

    it('User should be redirected back to the search results page with product and filter selections retained when user cancels the Add Products modal without adding products', fakeAsync(() => {
      const {
        spectator,
        component,
        spies: { spyFn },
      } = testSetup({ setSpies: true });
      component.checkedProducts = getMap(mockProducts.slice(0, 5));
      spectator.detectChanges();
      component.addToCollection();
      expect(spyFn).toHaveBeenCalled();
      expect(spyFn).toHaveBeenCalledWith(
        Array.from(component.checkedProducts.values()).map(
          productToCollectionProduct
        )
      );
      expect(component.checkedProducts.size).toEqual(5);
    }));

    it('Max limit error toast should be displayed when user tries to add more than 250 products to a collection from search results page.', () => {
      const {
        component,
        spies: { errorSpy },
      } = testSetup({ setSpies: true });

      const maxProductsLength = 250;
      component.checkedProducts = ProductsMockDb.checkedProducts(
        maxProductsLength + 2
      );
      component.addToCollection();
      expect(errorSpy).toHaveBeenCalledWith(
        'Error: Too Many Products!',
        `${component.checkedProducts.size} product(s) were unable to be added. ${maxProductsLength} product per collection limit reached.`
      );
    });
  });

  describe('Page navigation', () => {
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

  describe('Product and supplier count message', () => {
    const results: SearchResult<ProductSearchResultItem> = {
      Results: [...mockProducts],
      ResultsTotal: mockProducts.length,
      SuppliersTotal: 10,
      ResultsTotalIsExhaustive: true,
    };

    it('should set first page message', () => {
      const { component } = testSetup({ results, pageSize: 50 });
      const msg = `(1-50 of <b>${component.state.results.ResultsTotal} products</b> from ${component.state.results.SuppliersTotal} suppliers)`;
      expect(component.resultMessage).toBe(msg);
    });

    it('should set actual count message', () => {
      const { spectator, component } = testSetup({
        results: { ...results, ResultsTotalIsExhaustive: false },
        pageSize: 50,
      });
      component.maxResultLength = component.state.results.ResultsTotal;
      spectator.detectChanges();
      const msg = `(1-50 of <b>${component.state.results.ResultsTotal}+ products</b> from ${component.state.results.SuppliersTotal}+ suppliers)`;
      expect(component.resultMessage).toBe(msg);
    });

    it('should set maxLength+ count message', () => {
      const { spectator, component } = testSetup({
        results: { ...results, ResultsTotalIsExhaustive: false },
        pageSize: 50,
      });
      component.maxResultLength = 49;
      spectator.detectChanges();
      const msg = `(1-50 of <b>${component.maxResultLength}+ products</b> from ${component.state.results.SuppliersTotal}+ suppliers)`;
      expect(component.resultMessage).toBe(msg);
    });

    it('should set second page message', () => {
      const { component } = testSetup({
        results,
        pageSize: 50,
        from: 2,
      });

      const toCount = Math.min(component.state.results.ResultsTotal, 100);
      const msg = `(51-${toCount} of <b>${component.state.results.ResultsTotal} products</b> from ${component.state.results.SuppliersTotal} suppliers)`;
      expect(component.resultMessage).toBe(msg);
    });

    it('should set 0 products message', () => {
      const { spectator, component } = testSetup({
        results: { Results: [], ResultsTotal: 0 },
        pageSize: 50,
      });
      spectator.detectChanges();
      const msg = `(0 of <b>0 products</b> from 0 suppliers)`;
      expect(component.resultMessage).toBe(msg);
    });
  });

  describe('Product and supplier count message after applying filters', () => {
    const setupOptions = {
      results: {
        Results: [],
        ResultsTotal: 0,
      },
      pageSize: 48,
      term: 'mugs',
    };

    it('should contain 0 of 0 products from 0 supplier message when applied filters returned 0 results', fakeAsync(() => {
      // Arrange
      const { spectator, component } = testSetup(setupOptions);

      const msg = `"${
        component.state.term
      }"(${0} of ${0} products from ${0} suppliers)`;
      spectator.detectChanges();
      spectator.tick(400);
      const resultMessage = spectator
        .query('.product-results-util-bar > div')
        .textContent.replace(/\s+(?=[^(]*\()/gi, '');

      //Assert
      expect(resultMessage).toEqual(msg);
    }));

    it('should contain no products matching message if the results set is null or 0', fakeAsync(() => {
      // Arrange
      const { spectator } = testSetup(setupOptions);
      const msg = `There are no products matching the selected criteria. Please clear your filters or start a new search.`;

      spectator.detectChanges();
      spectator.tick(400);
      const resultMessage = spectator.query('.no-results-msg > h4').textContent;

      //Assert
      expect(resultMessage.trim()).toEqual(msg);
    }));

    it('Sort By should be in disabled state if the results set is null or 0', fakeAsync(() => {
      // Arrange
      const { spectator } = testSetup(setupOptions);

      spectator.detectChanges();
      spectator.tick(400);
      const anchorTag = spectator.query('.product-results-util-bar > div > a');

      // Assert
      expect(anchorTag).toHaveClass('is-disabled');
    }));
  });

  describe('Product search Stats', () => {
    const results: SearchResult<ProductSearchResultItem> = {
      Results: [...mockProducts],
      ResultsTotal: mockProducts.length,
      SuppliersTotal: 10,
      ResultsTotalIsExhaustive: true,
    };

    const setupOptions = {
      results: results,
      pageSize: 48,
      term: 'mugs',
    };

    it('should trigger the product-list-view event', fakeAsync(() => {
      const {
        spectator,
        component,
        spies: { spyTrackFn },
      } = testSetup({ ...setupOptions, setSpies: true });
      const pfpMode: string = component.state.results?.PfpDiagnostics?.PfpMode;
      const products: Product[] = mockProducts.map((product, index) =>
        productToProductEvent(product, index + 1, pfpMode)
      );
      const productViewTrackEvent: TrackEvent<ProductViewEvent> = {
        action: 'Product List Viewed',
        properties: {
          products: products,
          marketSegmentCode: 'ALL',
          pageNumber: component.state.pageIndex + 1,
          index: component.state.index,
        },
      };
      spectator.component.state.term = 'mugs';
      spectator.detectChanges();
      spectator.tick(400);

      expect(spyTrackFn).toBeCalledWith(productViewTrackEvent);
    }));

    it('should trigger product clicked event', fakeAsync(() => {
      const { spectator, component, spies } = testSetup({
        ...setupOptions,
        setSpies: true,
      });

      spectator.tick();
      const productTag = spectator.query(
        '.product-results > a > cos-product-card'
      );
      expect(productTag).not.toBeNull();
      expect(productTag).not.toBeUndefined();

      spectator.click(productTag);
      spectator.tick();
      const ad = product.Ad?.Id
        ? {
            id: product.Ad?.Id,
            index: product.Ad?.Index,
            levelId: product.Ad?.LevelId,
            serveTypeCode:
              product.Ad?.Type === 'PFP'
                ? component.state.results?.PfpDiagnostics?.PfpMode
                : undefined,
          }
        : undefined;
      const productTrack: TrackEvent<ProductTrackEvent> = {
        action: 'Product Clicked',
        properties: {
          id: product.Id,
          ad,
          pageNumber: component.state.pageIndex + 1,
          productIndex: 1,
          marketSegmentCode: 'ALL',
          currencyCode: product?.Price?.CurrencyCode,
          objectID: product.ObjectId,
          index: component.state.index,
          queryID: component.state.queryId,
          organicIndex: !AD_TYPES_FOR_AD_LABEL.includes(product.Ad?.Type)
            ? product.OrganicIndex
            : undefined,
        },
      };
      spectator.detectChanges();
      spectator.tick(400);

      expect(spies.spyTrackFn).toBeCalledWith(productTrack);
    }));
  });
  describe('Product search navigation', () => {
    const results: SearchResult<ProductSearchResultItem> = {
      Results: [...mockProducts],
      ResultsTotal: mockProducts.length,
      SuppliersTotal: 10,
      ResultsTotalIsExhaustive: true,
    };

    const setupOptions = {
      results: results,
      pageSize: 48,
      term: 'mugs',
    };

    it('should verify the availablity of the anchor tage & should be able to navigate', fakeAsync(() => {
      const { spectator, location } = testSetup(setupOptions);
      spectator.detectChanges();
      spectator.tick(400);
      const productTag = spectator.query('.product-results > a');
      expect(productTag).not.toBeNull();
      expect(productTag).not.toBeUndefined();

      spectator.click(productTag);
      spectator.tick();
      expect(location.path()).toEqual('/products/0?keywords=mugs');
    }));

    it('should start create presentation flow with checked products', () => {
      const { spectator, component } = testSetup(setupOptions);
      const flow = spectator.inject(AddToPresentationFlow, true);
      const flowSpy = jest.spyOn(flow, 'start');

      component.addToPresentation();
      expect(flowSpy).toHaveBeenCalledWith({
        checkedProducts: component.checkedProducts,
      });
    });
  });
});
