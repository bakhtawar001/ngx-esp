import { BreakpointObserver } from '@angular/cdk/layout';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  FormGroupDirective,
} from '@angular/forms';
import {
  AsiFilterPillsComponent,
  AsiFilterPillsModule,
} from '@asi/ui/feature-filters';
import { Dictionary } from '@cosmos/core';
import { SearchFilter } from '@esp/models';
import {
  CHECK_BOXES,
  FILTERS_FORM_DEFAULT,
  mapFiltersFormToSearchCriteria,
  NumericFilter,
} from '@esp/products';
import { createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { Store } from '@ngxs/store';
import { MockComponents } from 'ng-mocks';
import { of } from 'rxjs';
import { ProductSearchLocalState } from '../../local-states';
import {
  AggregationTypeAheadComponent,
  AggregationTypeaheadComponentModule,
} from '../aggregation-typeahead/aggregation-typeahead.component';
import {
  ProductSearchFiltersComponent,
  ProductSearchFiltersComponentModule,
} from './product-search-filters.component';

describe('ProductSearchFiltersComponent', () => {
  const filters: typeof FILTERS_FORM_DEFAULT = { ...FILTERS_FORM_DEFAULT };

  const CategoryGroup = [
    {
      Value: 'Bags',
      Count: 200,
    },
    {
      Value: 'Books',
      Count: 200,
    },
    {
      Value: 'Awards',
      Count: 400,
    },
  ];
  const subCategories = [
    {
      Value: 'Awards-Crystal',
      Count: 16930,
      Products: 16930,
    },
    {
      Value: 'Awards-General',
      Count: 5979,
      Products: 5979,
    },
    {
      Value: 'Awards-Glass',
      Count: 4764,
      Products: 4764,
    },
    {
      Value: 'Bags-General',
      Count: 18552,
      Products: 18552,
    },
    {
      Value: 'Bags-Fanny/Hip/Waist',
      Count: 3775,
      Products: 3775,
    },
    {
      Value: 'Bags-Lunch',
      Count: 3666,
      Products: 3666,
    },
    {
      Value: 'Bags-Resealable/Reclosable',
      Count: 1883,
      Products: 1883,
    },
  ];
  const filterFormGroup: FormGroup = new FormGroup({
    CategoryGroup: new FormControl(''),
    CategoryValue: new FormControl(''),
    SuppliersSearchTerm: new FormControl(''),
    Supplier: new FormControl(''),
    PriceFilter: new FormGroup({
      Quantity: new FormControl(''),
      To: new FormControl(''),
      From: new FormControl(''),
    }),
    Exclude: new FormControl(''),
    Color: new FormControl(''),
    ColorSearchTerm: new FormControl(''),
    CategorySearchTerm: new FormControl(''),
    IncludeRushTime: new FormControl(''),
    SupplierRating: new FormControl(''),
    TypeAheads: new FormGroup({
      ImprintMethod: new FormControl(''),
      LineName: new FormControl(''),
      Material: new FormControl(''),
      ProductionTime: new FormControl(''),
      Shape: new FormControl(''),
      Size: new FormControl(''),
      Theme: new FormControl(''),
      TradeName: new FormControl(''),
    }),
    CheckBoxes: new FormGroup({
      IsNew: new FormControl(false),
      HasSpecial: new FormControl(false),
      IsUnionAffiliated: new FormControl(false),
      NoHazardMaterials: new FormControl(false),
      MadeInUsa: new FormControl(false),
      HasFullColorProcess: new FormControl(false),
      IsMinorityOwned: new FormControl(false),
      NoChokingHazards: new FormControl(false),
      IsConfirmed: new FormControl(false),
      HasPersonalization: new FormControl(false),
      HasProp65Warnings: new FormControl(false),
      HasProductVideo: new FormControl(false),
      HasRushService: new FormControl(false),
      HasUnimprinted: new FormControl(false),
      NoProp65Warnings: new FormControl(false),
    }),
  });

  const fgd: FormGroupDirective = new FormGroupDirective([], []);
  fgd.form = filterFormGroup;

  const createComponent = createComponentFactory({
    component: ProductSearchFiltersComponent,
    imports: [ProductSearchFiltersComponentModule],
    providers: [
      { provide: ControlContainer, useValue: fgd },
      {
        provide: Store,
        useValue: {
          select: () => ({}),
        },
      },
      {
        provide: BreakpointObserver,
        useValue: {
          observe: () => {
            return of({ matches: true });
          },
        },
      },
      mockProvider(ProductSearchLocalState, {
        connect() {
          return of(this);
        },
        search: () => of(),
      }),
    ],
    overrideModules: [
      [
        AggregationTypeaheadComponentModule,
        {
          set: {
            declarations: MockComponents(AggregationTypeAheadComponent),
            exports: MockComponents(AggregationTypeAheadComponent),
          },
        },
      ],
      [
        AsiFilterPillsModule,
        {
          set: {
            declarations: MockComponents(AsiFilterPillsComponent),
            exports: MockComponents(AsiFilterPillsComponent),
          },
        },
      ],
    ],
  });

  const testSetup = (options?: {
    exclude?: string[];
    categoryGroup?: { Value: string; Count: number }[];
    categoryValue?: { Value: string; Products: number }[];
    filters?: Dictionary<SearchFilter>;
    setSpies?: boolean;
    numericFilters?: Array<NumericFilter>;
  }) => {
    const spectator = createComponent({
      providers: [
        mockProvider(ProductSearchLocalState, <
          Partial<ProductSearchLocalState>
        >{
          connect() {
            return of(this);
          },
          search: jest.fn(() => of()),
          criteria: <unknown>{
            term: '',
            excludeTerm: options?.exclude?.join(',') || null,
            from: [1],
            aggregationsOnly: [false],
            sortBy: ['DFLT'],
            size: 48,
            organicSize: 1,
            filters: options?.filters || {},
            priceFilter: {},
            numericFilters: options?.numericFilters || [[]],
          },
          facets: {
            CategoryGroup: options?.categoryGroup || CategoryGroup,
            CategoryValue: options?.categoryValue || subCategories,
          },
        }),
      ],
    });
    const selections: Dictionary<SearchFilter> = {
      CategoryGroup: { terms: [] },
      Supplier: { terms: [] },
    };
    if (options?.setSpies) {
      const localState = spectator.inject(ProductSearchLocalState, true);
      const searchSpyFn = jest
        .spyOn(localState, 'search')
        .mockReturnValue(null);
      return {
        spectator,
        component: spectator.component,
        spies: { searchSpyFn },
        selections,
      };
    }
    return { spectator, component: spectator.component, selections };
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Cos-Filter-Menu works', () => {
    const { component } = testSetup();
    expect(component).toBeTruthy();
  });

  it('Cos-Filter-Menu should be available when product results consist of only single minor category', () => {
    const { selections, spectator } = testSetup();
    selections.CategoryValue = { terms: ['Awards', 'Awards-General'] };
    spectator.detectChanges();
    const categoryFilter = spectator.query('.cos-filter-category-menu');
    expect(categoryFilter).toBeTruthy();
  });

  it('Cos-Filter-Menu should be available when product results consist of multiple minor and major category', () => {
    const { selections, spectator } = testSetup();

    selections.CategoryValue = {
      terms: ['Awards', 'Awards-General', 'Bags', 'Bags-General', 'Bags-Fun'],
    };
    spectator.detectChanges();
    const categoryFilter = spectator.query('.cos-filter-category-menu');
    expect(categoryFilter).toBeTruthy();
  });

  it('should have default Filter names for visible Filters', () => {
    //Arrange
    const { component, spectator } = testSetup();

    const filterButtons = spectator.queryAll(
      'cos-filter-menu > div.cos-filter-menu-desktop > button.cos-filter-label.cos-filter-btn'
    );
    const filterLabels = [
      'All Categories',
      'Supplier',
      'Quantity',
      'Price Per Unit',
      'All Ratings',
      'Color',
      'Exclude',
    ];
    //Act
    filterButtons.map((button, i) => {
      //Assert
      expect(button).toHaveText(filterLabels[i]);
    });
  });

  it('Category Filter - "All Categories" should be the default value under Category', () => {
    const { spectator } = testSetup();
    const categoryFilterButton = spectator.query(
      '.cos-filter-category-menu > div.cos-filter-menu-desktop > button'
    );
    expect(categoryFilterButton).toHaveText('All Categories');
  });

  it('Category Filter - Value should be displayed at the top of all other values', () => {
    const { spectator } = testSetup();
    const categoryFilterButton = spectator.query(
      '.cos-filter-category-menu > div.cos-filter-menu-desktop > button'
    );
    spectator.click(categoryFilterButton);
    spectator.detectChanges();
    const filterMenuElement = spectator.query('.cos-filter-category-select');
    expect(filterMenuElement.children[0]).toHaveText('All Categories');
  });

  it('Category Filter - Value should be retained after selecting a category', () => {
    const { component, spectator } = testSetup({
      filters: { CategoryGroup: { terms: [CategoryGroup[1].Value] } },
    });

    const selectedValue = CategoryGroup[1].Value;
    component.filtersForm.get('CategoryGroup').patchValue(selectedValue);
    spectator.detectChanges();

    const categoryFilterButton = spectator.query(
      '.cos-filter-category-menu > div.cos-filter-menu-desktop > button'
    );

    spectator.click(categoryFilterButton);
    spectator.detectChanges();

    expect(component.filtersForm.controls.CategoryGroup.value).toEqual(
      selectedValue
    );
  });

  it('Category Filter - Default state of Apply button is greyed out', () => {
    const { spectator } = testSetup();
    const categoryFilterButton = spectator.query(
      '.cos-filter-category-menu > div.cos-filter-menu-desktop > button'
    );
    spectator.click(categoryFilterButton);
    spectator.detectChanges();
    const applyButtonElement = spectator.query('.cos-filter-apply-button');
    expect(applyButtonElement).toHaveProperty('disabled', true);
  });

  it('Category Filter - Default state of Reset button is grayed out', () => {
    const { spectator } = testSetup();
    const categoryFilterButton = spectator.query(
      '.cos-filter-category-menu > div.cos-filter-menu-desktop > button'
    );
    spectator.click(categoryFilterButton);
    spectator.detectChanges();
    const resetButtonElement = spectator.query('.cos-filter-reset-button');
    expect(resetButtonElement).toHaveProperty('disabled', true);
  });

  it('Category Filter - After another value is selected, Apply button should be enabled.', () => {
    const { component, spectator } = testSetup();

    const selectedValue = CategoryGroup[1].Value;
    component.filtersForm.get('CategoryGroup').patchValue(selectedValue);
    spectator.detectChanges();

    const categoryFilterButton = spectator.query(
      '.cos-filter-category-menu > div.cos-filter-menu-desktop > button'
    );

    spectator.click(categoryFilterButton);
    spectator.detectChanges();

    const applyButtonElement = spectator.query('.cos-filter-apply-button');
    expect(applyButtonElement).toHaveProperty('disabled', false);
  });

  it('Category Filter - After another value is selected, Reset button should be disabled.', () => {
    const { component, spectator } = testSetup();

    const selectedValue = CategoryGroup[1].Value;
    component.filtersForm.get('CategoryGroup').patchValue(selectedValue);
    spectator.detectChanges();

    const categoryFilterButton = spectator.query(
      '.cos-filter-category-menu > div.cos-filter-menu-desktop > button'
    );

    spectator.click(categoryFilterButton);
    spectator.detectChanges();

    const resetButtonElement = spectator.query('.cos-filter-reset-button');
    expect(resetButtonElement).toHaveProperty('disabled', true);
  });

  it('Category Filter - After another value is applied, Reset button should be enabled.', () => {
    const { component, spectator } = testSetup({
      filters: { CategoryGroup: { terms: [CategoryGroup[1].Value] } },
    });

    const selectedValue = CategoryGroup[1].Value;
    component.filtersForm.get('CategoryGroup').patchValue(selectedValue);
    spectator.detectChanges();

    const categoryFilterButton = spectator.query(
      '.cos-filter-category-menu > div.cos-filter-menu-desktop > button'
    );

    spectator.click(categoryFilterButton);
    spectator.detectChanges();

    const resetButtonElement = spectator.query('.cos-filter-reset-button');
    expect(resetButtonElement).toHaveProperty('disabled', false);
  });

  it('Category Filter - After another value is applied, Apply button should be enabled.', () => {
    const { component, spectator } = testSetup({
      filters: { CategoryGroup: { terms: [CategoryGroup[1].Value] } },
    });

    const selectedValue = CategoryGroup[1].Value;
    component.filtersForm.get('CategoryGroup').patchValue(selectedValue);
    spectator.detectChanges();

    const categoryFilterButton = spectator.query(
      '.cos-filter-category-menu > div.cos-filter-menu-desktop > button'
    );

    spectator.click(categoryFilterButton);
    spectator.detectChanges();

    const applyButtonElement = spectator.query('.cos-filter-apply-button');
    expect(applyButtonElement).toHaveProperty('disabled', false);
  });

  it('Category Filter - After reset if clicked, Apply button should be disabled.', () => {
    const { component, spectator } = testSetup({
      filters: { CategoryGroup: { terms: [CategoryGroup[1].Value] } },
    });

    const selectedValue = CategoryGroup[1].Value;
    component.filtersForm.get('CategoryGroup').patchValue(selectedValue);
    spectator.detectChanges();

    const categoryFilterButton = spectator.query(
      '.cos-filter-category-menu > div.cos-filter-menu-desktop > button'
    );

    spectator.click(categoryFilterButton);
    spectator.detectChanges();

    component.resetCategory();
    spectator.detectChanges();

    const applyButtonElement = spectator.query('.cos-filter-apply-button');
    expect(applyButtonElement).toHaveProperty('disabled', true);
  });

  it('Category Filter - After reset if clicked, previously applied category rating filter should be removed.', () => {
    const {
      component,
      spectator,
      spies: { searchSpyFn },
    } = testSetup({
      filters: { CategoryGroup: { terms: [CategoryGroup[1].Value] } },
      setSpies: true,
    });

    const selectedValue = CategoryGroup[1].Value;
    component.filtersForm.get('CategoryGroup').patchValue(selectedValue);
    spectator.detectChanges();

    expect(
      component.state.criteria.filters.CategoryGroup.terms.length
    ).toBeGreaterThan(0);

    component.resetCategory();
    spectator.detectChanges();

    expect(component.filtersForm.get('CategoryGroup').value).toMatch('');

    const criteria = {
      ...component.state.criteria,
      from: 1,
      organicSize: 0,
      ...mapFiltersFormToSearchCriteria(component.filtersForm?.value),
    };

    expect(criteria.filters.CategoryGroup?.terms?.length ?? 0).toEqual(0);
    expect(searchSpyFn).toBeCalledWith(criteria);
    expect(searchSpyFn).toBeCalledTimes(1);
  });

  it('Category Filter - After another value is selected, clicking on Reset will return the value to "All Categories"', () => {
    const {
      component,
      spectator,
      spies: { searchSpyFn },
    } = testSetup({
      filters: { CategoryGroup: { terms: [CategoryGroup[1].Value] } },
      setSpies: true,
    });

    const selectedValue = CategoryGroup[1].Value;
    component.filtersForm.get('CategoryGroup').patchValue(selectedValue);
    spectator.detectChanges();

    const categoryFilterButton = spectator.query(
      '.cos-filter-category-menu > div.cos-filter-menu-desktop > button'
    );
    expect(categoryFilterButton.innerHTML).toMatch(selectedValue);

    spectator.click(categoryFilterButton);
    spectator.detectChanges();

    const selectMenuElement = spectator.query('.cos-filter-category-select');
    expect(selectMenuElement).toHaveValue(selectedValue);

    component.resetCategory();
    spectator.detectChanges();

    expect(component.filtersForm.get('CategoryGroup').value).toMatch('');
    expect(selectMenuElement).toHaveValue('');
    expect(searchSpyFn).toBeCalledWith({
      ...component.state.criteria,
      from: 1,
      organicSize: 0,
      ...mapFiltersFormToSearchCriteria(component.filtersForm?.value),
    });
    expect(searchSpyFn).toBeCalledTimes(1);
  });

  it('Category Filter - After another category is selected, clicking on Clear All filters will return the value to "All Categories"', () => {
    const {
      component,
      spectator,
      spies: { searchSpyFn },
    } = testSetup({
      filters: { CategoryGroup: { terms: [CategoryGroup[1].Value] } },
      setSpies: true,
    });

    const selectedValue = CategoryGroup[1].Value;
    component.filtersForm.get('CategoryGroup').patchValue(selectedValue);
    spectator.detectChanges();

    const categoryFilterButton = spectator.query(
      '.cos-filter-category-menu > div.cos-filter-menu-desktop > button'
    );
    expect(categoryFilterButton.innerHTML).toMatch(selectedValue);

    spectator.click(categoryFilterButton);
    spectator.detectChanges();

    const selectMenuElement = spectator.query('.cos-filter-category-select');
    expect(selectMenuElement).toHaveValue(selectedValue);

    component.resetAllFilters();
    spectator.detectChanges();

    expect(component.filtersForm.get('CategoryGroup').value).toMatch('');
    expect(selectMenuElement).toHaveValue('');
    expect(searchSpyFn).toBeCalledWith({
      ...component.state.criteria,
      from: 1,
      organicSize: 0,
      ...mapFiltersFormToSearchCriteria(component.filtersForm?.value),
      priceFilter: {},
    });
    expect(searchSpyFn).toBeCalledTimes(1);
  });

  it('Price Per Unit Filter - should not allow alpha values in the filter input', () => {
    const { spectator } = testSetup();
    const pricePerUnitFilterButton = spectator
      .queryAll('cos-filter-menu')[3]
      .querySelector('button');

    spectator.click(pricePerUnitFilterButton);
    spectator.detectChanges();
    const priceFromInput = spectator.query('#filter-menu-price-from');
    const priceToInput = spectator.query('#filter-menu-price-to');
    spectator.typeInElement('es', priceFromInput);
    spectator.typeInElement('es', priceToInput);
    spectator.detectChanges();

    expect(priceFromInput.getAttribute('type')).toEqual('number');
    expect(priceFromInput.nodeValue).toBeNull();
    expect(priceToInput.getAttribute('type')).toEqual('number');
    expect(priceToInput.nodeValue).toBeNull();
  });

  it('Supplier Rating Filter - "All Ratings" should be the default value under Supplier Ratings', () => {
    const { spectator } = testSetup();
    const ratingFilterButton = spectator.query(
      '.cos-filter-rating-menu > div.cos-filter-menu-desktop > button'
    );
    expect(ratingFilterButton).toHaveText('All Ratings');
  });

  it('Supplier Rating Filter - Value should be displayed at the top of all other values', () => {
    const { spectator } = testSetup();
    const ratingFilterButton = spectator.query(
      '.cos-filter-rating-menu > div.cos-filter-menu-desktop > button'
    );
    spectator.click(ratingFilterButton);
    spectator.detectChanges();
    const filterMenuElement = spectator.query('.rating-select');
    expect(filterMenuElement.children[0]).toHaveText('All Ratings');
  });

  it('Supplier Rating Filter - Default state of Apply button is greyed out', () => {
    const { spectator } = testSetup();
    const ratingFilterButton = spectator.query(
      '.cos-filter-rating-menu > div.cos-filter-menu-desktop > button'
    );
    spectator.click(ratingFilterButton);
    spectator.detectChanges();
    const applyButtonElement = spectator.query('.cos-filter-apply-button');
    expect(applyButtonElement).toHaveProperty('disabled', true);
  });

  it('Supplier Rating Filter - Default state of Reset button is grayed out', () => {
    const { spectator } = testSetup();
    const ratingFilterButton = spectator.query(
      '.cos-filter-rating-menu > div.cos-filter-menu-desktop > button'
    );
    spectator.click(ratingFilterButton);
    spectator.detectChanges();
    const resetButtonElement = spectator.query('.cos-filter-reset-button');
    expect(resetButtonElement).toHaveProperty('disabled', true);
  });

  it('Supplier Rating Filter - After another value is selected, clicking on Reset will return the value to "All Ratings"', () => {
    const rating: { name: string; value: string } = {
      name: '5 stars',
      value: '10',
    };
    const {
      component,
      spectator,
      spies: { searchSpyFn },
    } = testSetup({
      numericFilters: [
        { Name: 'SupplierRating', From: parseInt(rating.value) },
      ],
      setSpies: true,
    });

    component.filtersForm.get('SupplierRating').patchValue(rating.value);
    spectator.detectChanges();

    const ratingFilterButton = spectator.query(
      '.cos-filter-rating-menu > div.cos-filter-menu-desktop > button'
    );
    expect(ratingFilterButton.innerHTML).toMatch(rating.name);

    spectator.click(ratingFilterButton);
    spectator.detectChanges();

    const selectMenuElement = spectator.query('.rating-select');
    expect(selectMenuElement).toHaveValue(rating.value);

    component.resetFilter('SupplierRating');
    spectator.detectChanges();

    expect(component.filtersForm.get('SupplierRating').value).toMatch('');
    expect(selectMenuElement).toHaveValue('');
    expect(searchSpyFn).toBeCalledWith({
      ...component.state.criteria,
      from: 1,
      organicSize: 0,
      ...mapFiltersFormToSearchCriteria(component.filtersForm?.value),
    });
    expect(searchSpyFn).toBeCalledTimes(1);
  });

  it("Supplier Rating Filter - Should display the 'Clear All Filters' button when rating is selected", () => {
    const rating: { name: string; value: string } = {
      name: '5 stars',
      value: '10',
    };
    const {
      component,
      spectator,
      spies: { searchSpyFn },
    } = testSetup({
      numericFilters: [
        { Name: 'SupplierRating', From: parseInt(rating.value) },
      ],
      setSpies: true,
    });

    component.filtersForm.get('SupplierRating').patchValue(rating.value);
    spectator.detectChanges();

    expect(component.hasFilters).toBeTruthy();
  });

  it('Supplier Rating Filter - After another rating is selected, clicking on  Clear All filters will return the value to "All Ratings"', () => {
    const rating: { name: string; value: string } = {
      name: '5 stars',
      value: '10',
    };
    const {
      component,
      spectator,
      spies: { searchSpyFn },
    } = testSetup({
      numericFilters: [
        { Name: 'SupplierRating', From: parseInt(rating.value) },
      ],
      setSpies: true,
    });

    component.filtersForm.get('SupplierRating').patchValue(rating.value);
    spectator.detectChanges();

    const ratingFilterButton = spectator.query(
      '.cos-filter-rating-menu > div.cos-filter-menu-desktop > button'
    );
    expect(ratingFilterButton.innerHTML).toMatch(rating.name);

    spectator.click(ratingFilterButton);
    spectator.detectChanges();

    const selectMenuElement = spectator.query('.rating-select');
    expect(selectMenuElement).toHaveValue(rating.value);

    component.resetAllFilters();
    spectator.detectChanges();

    expect(component.filtersForm.get('SupplierRating').value).toMatch('');
    expect(selectMenuElement).toHaveValue('');
    expect(searchSpyFn).toBeCalledWith({
      ...component.state.criteria,
      from: 1,
      organicSize: 0,
      ...mapFiltersFormToSearchCriteria(component.filtersForm?.value),
      priceFilter: {},
    });
    expect(searchSpyFn).toBeCalledTimes(1);
  });

  it('Supplier Rating Filter - After another value is selected, Apply button should be enabled.', () => {
    const rating: { name: string; value: string } = {
      name: '5 stars',
      value: '10',
    };
    const { component, spectator } = testSetup();

    component.filtersForm.get('SupplierRating').patchValue(rating.value);
    spectator.detectChanges();

    const ratingFilterButton = spectator.query(
      '.cos-filter-rating-menu > div.cos-filter-menu-desktop > button'
    );

    spectator.click(ratingFilterButton);
    spectator.detectChanges();

    const applyButtonElement = spectator.query('.cos-filter-apply-button');
    expect(applyButtonElement).toHaveProperty('disabled', false);
  });

  it('Supplier Rating Filter - After another value is selected, Reset button should be disabled.', () => {
    const rating: { name: string; value: string } = {
      name: '5 stars',
      value: '10',
    };
    const { component, spectator } = testSetup();

    component.filtersForm.get('SupplierRating').patchValue(rating.value);
    spectator.detectChanges();

    const ratingFilterButton = spectator.query(
      '.cos-filter-rating-menu > div.cos-filter-menu-desktop > button'
    );

    spectator.click(ratingFilterButton);
    spectator.detectChanges();

    const resetButtonElement = spectator.query('.cos-filter-reset-button');
    expect(resetButtonElement).toHaveProperty('disabled', true);
  });

  it('Supplier Rating Filter - After another value is applied, Reset button should be enabled.', () => {
    const rating: { name: string; value: string } = {
      name: '5 stars',
      value: '10',
    };
    const { component, spectator } = testSetup({
      numericFilters: [
        { Name: 'SupplierRating', From: parseInt(rating.value) },
      ],
    });

    component.filtersForm.get('SupplierRating').patchValue(rating.value);
    spectator.detectChanges();

    const ratingFilterButton = spectator.query(
      '.cos-filter-rating-menu > div.cos-filter-menu-desktop > button'
    );

    spectator.click(ratingFilterButton);
    spectator.detectChanges();

    const resetButtonElement = spectator.query('.cos-filter-reset-button');
    expect(resetButtonElement).toHaveProperty('disabled', false);
  });

  it('Supplier Rating Filter - After another value is applied, Apply button should be enabled.', () => {
    const rating: { name: string; value: string } = {
      name: '5 stars',
      value: '10',
    };
    const { component, spectator } = testSetup({
      numericFilters: [
        { Name: 'SupplierRating', From: parseInt(rating.value) },
      ],
    });

    component.filtersForm.get('SupplierRating').patchValue(rating.value);
    spectator.detectChanges();

    const ratingFilterButton = spectator.query(
      '.cos-filter-rating-menu > div.cos-filter-menu-desktop > button'
    );

    spectator.click(ratingFilterButton);
    spectator.detectChanges();

    const applyButtonElement = spectator.query('.cos-filter-apply-button');
    expect(applyButtonElement).toHaveProperty('disabled', false);
  });

  it('Supplier Rating Filter - After reset is clicked, Apply button should be disabled', () => {
    const rating: { name: string; value: string } = {
      name: '5 stars',
      value: '10',
    };
    const { component, spectator } = testSetup({
      numericFilters: [
        { Name: 'SupplierRating', From: parseInt(rating.value) },
      ],
    });

    component.filtersForm.get('SupplierRating').patchValue(rating.value);
    spectator.detectChanges();

    const ratingFilterButton = spectator.query(
      '.cos-filter-rating-menu > div.cos-filter-menu-desktop > button'
    );

    spectator.click(ratingFilterButton);
    spectator.detectChanges();

    component.resetFilter('SupplierRating');
    spectator.detectChanges();

    const applyButtonElement = spectator.query('.cos-filter-apply-button');
    expect(applyButtonElement).toHaveProperty('disabled', true);
  });

  it('Supplier Rating Filter - After reset is clicked, previously applied supplier rating filter should be removed. ', () => {
    const rating: { name: string; value: string } = {
      name: '5 stars',
      value: '10',
    };
    const {
      component,
      spectator,
      spies: { searchSpyFn },
    } = testSetup({
      numericFilters: [
        { Name: 'SupplierRating', From: parseInt(rating.value) },
      ],
      setSpies: true,
    });

    component.filtersForm.get('SupplierRating').patchValue(rating.value);
    spectator.detectChanges();

    expect(component.state.criteria.numericFilters.length).toBeGreaterThan(0);

    component.resetFilter('SupplierRating');
    spectator.detectChanges();

    expect(component.filtersForm.get('SupplierRating').value).toMatch('');

    const criteria = {
      ...component.state.criteria,
      from: 1,
      organicSize: 0,
      ...mapFiltersFormToSearchCriteria(component.filtersForm?.value),
    };

    expect(criteria.numericFilters.length).toEqual(0);
    expect(searchSpyFn).toBeCalledWith(criteria);
    expect(searchSpyFn).toBeCalledTimes(1);
  });

  it('Supplier Rating Filter: should call the search with correct criteria after selecting a Rating and applying filter', () => {
    //Arrange
    const rating: { name: string; value: string } = {
      name: '5 stars',
      value: '10',
    };
    const {
      component,
      spectator,
      spies: { searchSpyFn },
    } = testSetup({
      setSpies: true,
    });
    //Act
    component.filtersForm.get('SupplierRating').patchValue(rating.value);
    spectator.detectChanges();
    component.applyFilter();
    spectator.detectChanges();
    //Assert
    expect(component.state.criteria.numericFilters.length).toBeGreaterThan(0);
    expect(component.filtersForm.get('SupplierRating').value).toEqual('10');

    const criteria = {
      ...component.state.criteria,
      from: 1,
      organicSize: 0,
      ...mapFiltersFormToSearchCriteria(component.filtersForm?.value),
    };
    expect(criteria.numericFilters.length).toEqual(1);
    expect(searchSpyFn).toBeCalledWith(criteria);
  });

  it('Cos-Filter-Menu should be sorted on the basis of the Category Name ascending, having same product count', () => {
    const { spectator, component } = testSetup();

    component.state.facets.CategoryGroup = [
      { Value: 'Bags', Count: 200 },
      { Value: 'Books', Count: 200 },
    ];
    spectator.detectChanges();
    const categoryFilterButton = spectator.query(
      '.cos-filter-category-menu > div.cos-filter-menu-desktop > button'
    );
    spectator.click(categoryFilterButton);
    spectator.detectChanges();
    const filterMenu = spectator.queryAll(
      '.cos-filter-category-select > .category-name > span'
    );

    expect(filterMenu[0]).toHaveText(
      component.state.facets.CategoryGroup[0].Value
    );
    expect(filterMenu[1]).toHaveText(
      component.state.facets.CategoryGroup[1].Value
    );
  });

  it('Cos-Filter-Menu should be closed and search should not be executed when user selects some data from category filter and clicks outside the filter.', () => {
    const { spectator } = testSetup();
    const categoryFilterButton = spectator.query(
      '.cos-filter-category-menu > div.cos-filter-menu-desktop > button'
    );
    spectator.click(categoryFilterButton);
    const filterMenuElement = spectator.queryAll(
      '.cos-filter-category-select > .category-name'
    );
    spectator.click(filterMenuElement[0]);
    spectator.detectChanges();
    const outsideElement = spectator.query('.product-search-filters');
    spectator.click(outsideElement);
    const filterMenu = spectator.query('.cos-filter-category-select');
    expect(filterMenu).toBeFalsy();
  });

  it('Category Filter should be available when product results consist of only single major category', () => {
    const { selections, spectator } = testSetup();

    selections.CategoryValue = { terms: ['Awards'] };
    spectator.detectChanges();
    const categoryFilter = spectator.query('.cos-filter-category-menu');
    expect(categoryFilter).toBeTruthy();
  });

  it('Should be able to to see all categories when there are multiple categories available.', () => {
    const { spectator } = testSetup();

    const categoryFilterButton = spectator.query(
      '.cos-filter-category-menu > div.cos-filter-menu-desktop > button'
    );
    spectator.click(categoryFilterButton);
    spectator.detectChanges();
    const filterMenuElement = spectator.queryAll(
      '.cos-filter-category-select > .category-name'
    );
    expect(filterMenuElement.length).toEqual(3);
  });

  it('Category should be sorted on the basis of Product count descending', () => {
    const { spectator } = testSetup();

    const categoryFilterButton = spectator.query(
      '.cos-filter-category-menu > div.cos-filter-menu-desktop > button'
    );
    spectator.click(categoryFilterButton);
    spectator.detectChanges();
    const filterMenuElement = spectator.queryAll(
      '.cos-filter-category-select > .category-name'
    );
    expect(filterMenuElement[0].innerHTML).toMatch('Awards');
  });

  it('Multiple categories having same count should be sorted on the basis of Category Name ascending.', () => {
    const { spectator } = testSetup();

    const categoryFilterButton = spectator.query(
      '.cos-filter-category-menu > div.cos-filter-menu-desktop > button'
    );
    spectator.click(categoryFilterButton);
    spectator.detectChanges();
    const filterMenuElement = spectator.queryAll(
      '.cos-filter-category-select > .category-name'
    );
    expect(filterMenuElement[1].innerHTML).toMatch('Bags');
    expect(filterMenuElement[2].innerHTML).toMatch('Books');
  });

  it('Category dropdown should be populated correctly when product search results in only single category', () => {
    const { selections, spectator } = testSetup();

    selections.CategoryValue = { terms: ['Awards'] };
    spectator.detectChanges();
    const categoryFilterButton = spectator.query(
      '.cos-filter-category-menu > div.cos-filter-menu-desktop > button'
    );
    spectator.click(categoryFilterButton);
    spectator.detectChanges();
    const filterMenuElement = spectator.queryAll(
      '.cos-filter-category-select > .category-name'
    );
    expect(filterMenuElement[0].innerHTML).toMatch('Awards');
  });

  it('should show the categories to select', () => {
    const { spectator } = testSetup();

    const categoryFilterButton = spectator.query(
      '.cos-filter-category-menu > div.cos-filter-menu-desktop > button'
    );
    spectator.click(categoryFilterButton);
    const filterMenu = spectator.query('.cos-filter-category-select');
    expect(filterMenu).toBeTruthy();
  });

  it('Cos-Filter-Menu should be closed when user clicks Reset', () => {
    const {
      component,
      spectator,
      spies: { searchSpyFn },
    } = testSetup({ setSpies: true });

    component.filtersForm
      .get('CategoryGroup')
      .patchValue(CategoryGroup[2].Value);
    component.applyFilter();
    expect(searchSpyFn).toHaveBeenCalledTimes(1);
    component.resetCategory();
    expect(spectator.query('.cos-filter-category-select')).toBeFalsy();
  });

  it("Filter Name should be updated to 'Category Name' when user selects major category only and clicks Apply.", () => {
    const { spectator } = testSetup({
      filters: { CategoryGroup: { terms: ['Awards'] } },
    });

    const filterLabel = spectator.query(
      '.cos-filter-category-menu > div.cos-filter-menu-desktop > button'
    );
    expect(filterLabel.innerHTML).toMatch('Awards');
  });

  it('Filter Name should be updated to Category: Sub-Category Name, when user selects sub-category only and clicks Apply', () => {
    const { selections, spectator } = testSetup({
      filters: {
        CategoryValue: { terms: ['Awards-General'] },
        CategoryGroup: { terms: ['Awards'] },
      },
    });

    selections.CategoryValue = { terms: ['Awards-General'] };
    const filterLabel = spectator.query(
      '.cos-filter-category-menu > div.cos-filter-menu-desktop > button'
    );
    expect(filterLabel.innerHTML).toMatch(
      selections.CategoryValue.terms[0].toString()
    );
  });

  it("Filter Name should be updated to 'count of selected category Categories' when user selects multiple Minor category and clicks apply.", () => {
    const { selections, spectator } = testSetup({
      filters: {
        CategoryValue: { terms: ['Awards-General', 'Awards-Glass'] },
        CategoryGroup: { terms: ['Awards'] },
      },
    });

    selections.CategoryValue = { terms: ['Awards-General', 'Awards-Glass'] };
    const filterLabel = spectator.query(
      '.cos-filter-category-menu > div.cos-filter-menu-desktop > button'
    );
    expect(filterLabel.innerHTML).toMatch(
      `${selections.CategoryValue.terms.length} Categories`
    );
  });

  it('should be reset to Category when user clicks Reset.', () => {
    const {
      selections,
      spectator,
      component,
      spies: { searchSpyFn },
    } = testSetup({
      filters: {
        CategoryValue: { terms: ['Awards-General'] },
        CategoryGroup: { terms: ['AWARDS'] },
      },
      setSpies: true,
    });

    selections.CategoryValue = { terms: ['Awards-General'] };
    const filterLabel = spectator.query(
      '.cos-filter-category-menu > div.cos-filter-menu-desktop > button'
    );
    expect(filterLabel.innerHTML).toMatch(
      selections.CategoryValue.terms[0].toString()
    );
    component.resetCategory();
    spectator.detectComponentChanges();
    expect(searchSpyFn).toBeCalledWith({
      ...component.state.criteria,
      from: 1,
      organicSize: 0,
      ...mapFiltersFormToSearchCriteria(component.filtersForm?.value),
    });
    expect(searchSpyFn).toBeCalledTimes(1);
  });

  it('Apply button should be enabled as soon as a major category is selected.', () => {
    const { spectator } = testSetup();
    const categoryFilterButton = spectator.query(
      '.cos-filter-category-menu > div.cos-filter-menu-desktop > button'
    );
    spectator.click(categoryFilterButton);
    spectator.detectChanges();
    const filterMenuElement = spectator.queryAll(
      '.cos-filter-category-select > .category-name'
    );
    spectator.component.filtersForm
      .get('CategoryGroup')
      .patchValue(filterMenuElement[0].children[0].textContent.toUpperCase());
    spectator.detectComponentChanges();
    const applyButtonElement = spectator.query('.cos-filter-apply-button');
    expect(applyButtonElement).toHaveProperty('disabled', false);
  });

  it('should be disabled on Removing the major category selection', () => {
    const { spectator } = testSetup({
      filters: { CategoryGroup: { terms: ['Awards'] } },
    });

    const categoryFilterButton = spectator.query(
      '.cos-filter-category-menu > div.cos-filter-menu-desktop > button'
    );
    spectator.click(categoryFilterButton);
    spectator.detectChanges();
    const filterMenuElement = spectator.query('.cos-filter-category-select');
    spectator.click(filterMenuElement.children[0]);
    spectator.detectChanges();
    const applyButtonElement = spectator.query('.cos-filter-apply-button');
    expect(applyButtonElement).toHaveProperty('disabled', true);
  });

  it('should be disabled when no selection made on the Category filter.', () => {
    const { selections, spectator } = testSetup();

    selections.CategoryValue = { terms: [] };
    const categoryFilterButton = spectator.query(
      '.cos-filter-category-menu > div.cos-filter-menu-desktop > button'
    );
    spectator.click(categoryFilterButton);
    spectator.detectChanges();
    const applyButtonElement = spectator.query('.cos-filter-apply-button');
    expect(applyButtonElement).toHaveProperty('disabled', true);
  });

  it('Should NOT disable the Apply button when there is major category selected on Unselecting All selected sub categories ', () => {
    const { selections, spectator } = testSetup();

    selections.CategoryValue = { terms: ['Awards-General', 'Awards-Glass'] };
    const categoryFilterButton = spectator.query(
      '.cos-filter-category-menu > div.cos-filter-menu-desktop > button'
    );
    spectator.click(categoryFilterButton);
    const filterMenuElement = spectator.queryAll(
      '.cos-filter-category-select > .category-name'
    );
    spectator.component.filtersForm
      .get('CategoryGroup')
      .patchValue(filterMenuElement[0].children[0].textContent.toUpperCase());
    spectator.component.filtersForm
      .get('CategoryValue')
      .patchValue(selections.CategoryValue.terms);
    spectator.detectChanges();
    spectator.component.filtersForm
      .get('CategoryValue')
      .reset(filters.CategoryGroup);
    spectator.detectChanges();
    const applyButtonElement = spectator.query('.cos-filter-apply-button');
    expect(applyButtonElement).toHaveProperty('disabled', false);
  });

  it('Reset button should be disabled on Removing the major category selection', () => {
    const { selections, spectator } = testSetup();

    selections.CategoryValue = { terms: ['Awards'] };
    spectator.detectChanges();
    const categoryFilterButton = spectator.query(
      '.cos-filter-category-menu > div.cos-filter-menu-desktop > button'
    );
    spectator.click(categoryFilterButton);
    const filterMenuElement = spectator.queryAll(
      '.cos-filter-category-select > .category-name'
    );
    spectator.click(filterMenuElement[0]);
    spectator.detectChanges();
    const resetButtonElement = spectator.query('.cos-filter-reset-button');
    selections.CategoryValue = { terms: [] };
    spectator.detectChanges();
    expect(resetButtonElement).toHaveProperty('disabled', true);
  });

  it('Reset button should be disabled when no selection made on the Category filter.', () => {
    const { selections, spectator } = testSetup();

    selections.CategoryValue = { terms: [] };
    const categoryFilterButton = spectator.query(
      '.cos-filter-category-menu > div.cos-filter-menu-desktop > button'
    );
    spectator.click(categoryFilterButton);
    spectator.detectChanges();
    const resetButtonElement = spectator.query('.cos-filter-reset-button');
    expect(resetButtonElement).toHaveProperty('disabled', true);
  });

  it('should hide the sub-category section and sub category search on Unselecting a major category from dropdown ', () => {
    const { spectator, component } = testSetup();

    const categoryFilterButton = spectator.query(
      '.cos-filter-category-menu > div.cos-filter-menu-desktop > button'
    );
    spectator.click(categoryFilterButton);
    spectator.detectChanges();
    const filterMenu = spectator.queryAll(
      '.cos-filter-category-select > .category-name'
    );
    component.filtersForm
      .get('CategoryGroup')
      .setValue(filterMenu[0].children[0].textContent);
    spectator.detectComponentChanges();
    let subCategoryNames = spectator.queryAll('.cos-sub-category');
    expect(subCategoryNames.length).toBe(
      spectator.component.state.facets?.CategoryValue?.length
    );
    component.filtersForm.get('CategoryGroup').setValue(filters.CategoryGroup);
    spectator.detectComponentChanges();
    subCategoryNames = spectator.queryAll('.cos-sub-category');
    expect(subCategoryNames).not.toExist();
    expect(spectator.query('.cos-filter-menu-sub-category-search')).toBeFalsy();
  });

  it('Sub category section should display Selected Sub category(ies) at the top of the list as selected when user opens the filter again after clicking Apply.', () => {
    const {
      selections,
      spectator,
      component,
      spies: { searchSpyFn },
    } = testSetup({
      setSpies: true,
      filters: {
        CategoryValue: { terms: ['Awards-General', 'Awards-Glass'] },
        CategoryGroup: { terms: ['Awards'] },
      },
      categoryGroup: CategoryGroup.filter((p) => p.Value === 'Awards'),
      categoryValue: subCategories.filter((p) => p.Value.includes('Awards')),
    });

    //Act
    const categoryFilterButton = spectator.query(
      '.cos-filter-category-menu > div.cos-filter-menu-desktop > button'
    );

    component.filtersForm?.get('CategoryGroup').patchValue('Awards');
    spectator.click(categoryFilterButton);
    spectator.detectChanges();

    //Assert
    const subCategoryNames = spectator.queryAll('.cos-sub-category');
    expect(subCategoryNames[0].textContent).toMatch(
      component.state.facets.CategoryValue[0].Value
    );
    expect(subCategoryNames[1].textContent).toMatch(
      component.state.facets.CategoryValue[1].Value
    );
  });

  it('Sub category section should be displayed with ellipses in sub categories menu', () => {
    const { spectator, component } = testSetup();

    const categoryFilterButton = spectator.query(
      '.cos-filter-category-menu > div.cos-filter-menu-desktop > button'
    );
    spectator.click(categoryFilterButton);
    const filterMenu = spectator.queryAll(
      '.cos-filter-category-select > .category-name'
    );
    component.filtersForm
      .get('CategoryGroup')
      .setValue(filterMenu[0].children[0].textContent);
    spectator.detectChanges();
    expect(spectator.query('.cos-category-selection')).toHaveClass(
      'mat-list-base'
    );
  });

  it('Sub category section should be displayed with search text field', () => {
    const { spectator, component } = testSetup();

    const categoryFilterButton = spectator.query(
      '.cos-filter-category-menu > div.cos-filter-menu-desktop > button'
    );
    spectator.click(categoryFilterButton);
    const filterMenu = spectator.queryAll(
      '.cos-filter-category-select > .category-name'
    );
    component.filtersForm
      .get('CategoryGroup')
      .setValue(filterMenu[0].children[0].textContent);
    spectator.detectChanges();
    expect(
      spectator.query('.cos-filter-menu-sub-category-search')
    ).toBeTruthy();
  });

  it('Sub category section should have category list', () => {
    const { spectator, component } = testSetup();

    const categoryFilterButton = spectator.query(
      '.cos-filter-category-menu > div.cos-filter-menu-desktop > button'
    );
    spectator.click(categoryFilterButton);
    const filterMenu = spectator.queryAll(
      '.cos-filter-category-select > .category-name'
    );
    component.filtersForm
      .get('CategoryGroup')
      .setValue(filterMenu[0].children[0].textContent);
    spectator.detectChanges();

    const subCategoryNames = spectator.queryAll('.cos-sub-category');
    expect(subCategoryNames.length).toEqual(subCategories.length);
  });

  it('Sub category section should only show subcategories that are related to major category', () => {
    const { component, spectator } = testSetup();

    component.state.facets.CategoryValue = [
      {
        Value: 'Awards-Crystal',
        Count: 16930,
      },
      {
        Value: 'Awards-General',
        Count: 5979,
      },
      {
        Value: 'Awards-Glass',
        Count: 4764,
      },
    ];
    const categoryFilterButton = spectator.query(
      '.cos-filter-category-menu > div.cos-filter-menu-desktop > button'
    );
    spectator.click(categoryFilterButton);
    const filterMenu = spectator.queryAll(
      '.cos-filter-category-select > .category-name'
    );
    component.filtersForm
      .get('CategoryGroup')
      .setValue(filterMenu[0].children[0].textContent);
    spectator.detectChanges();
    const subCategoryNames = spectator.queryAll('.cos-sub-category');
    expect(subCategoryNames[0].textContent).toMatch(subCategories[0].Value);
    expect(subCategoryNames[1].textContent).toMatch(subCategories[1].Value);
  });

  it('Sub category section should not shown for categories if it does not exist', () => {
    const { component, spectator } = testSetup();

    const categoryFilterButton = spectator.query(
      '.cos-filter-category-menu > div.cos-filter-menu-desktop > button'
    );
    spectator.click(categoryFilterButton);
    const filterMenu = spectator.queryAll(
      '.cos-filter-category-select > .category-name'
    );
    component.filtersForm
      .get('CategoryGroup')
      .setValue(filterMenu[0].children[0].textContent);
    spectator.detectChanges();
    spectator.component.state.facets.CategoryValue = [];
    spectator.detectChanges();

    spectator.detectComponentChanges();
    expect(spectator.query('.cos-filter-menu-sub-category-search')).toBeFalsy();
  });

  it('Sub category section should have the ability to scroll', () => {
    const { component, spectator } = testSetup();
    const categoryFilterButton = spectator.query(
      '.cos-filter-category-menu > div.cos-filter-menu-desktop > button'
    );
    spectator.click(categoryFilterButton);
    const filterMenu = spectator.queryAll(
      '.cos-filter-category-select > .category-name'
    );
    component.filtersForm
      .get('CategoryGroup')
      .setValue(filterMenu[0].children[0].textContent);
    spectator.detectChanges();
    expect(spectator.query('.cos-category-selection')).toHaveClass(
      'mat-list-base'
    );
  });

  it('Sub category section should show if there is only 1 minor category', () => {
    const { component, spectator } = testSetup();

    const categoryFilterButton = spectator.query(
      '.cos-filter-category-menu > div.cos-filter-menu-desktop > button'
    );
    spectator.click(categoryFilterButton);
    const filterMenu = spectator.queryAll(
      '.cos-filter-category-select > .category-name'
    );
    component.filtersForm
      .get('CategoryGroup')
      .setValue(filterMenu[1].children[0].textContent);
    spectator.detectChanges();
    spectator.component.state.facets.CategoryValue = [
      {
        Value: 'Bags-General',
        Count: 18552,
      },
    ];
    spectator.detectComponentChanges();
    const subCategoryNames = spectator.query('.cos-sub-category');
    expect(subCategoryNames.textContent).toMatch(
      spectator.component.state.facets.CategoryValue[0].Value
    );
  });

  it('Sub category section should be sorted on the basis of product-count', () => {
    const { component, spectator } = testSetup({
      filters: { CategoryGroup: { terms: ['Bags'] } },
      categoryValue: [
        {
          Value: 'Bags-General',
          Products: 18,
        },
        {
          Value: 'Bags-Party',
          Products: 1234,
        },
      ],
    });

    const categoryFilterButton = spectator.query(
      '.cos-filter-category-menu > div.cos-filter-menu-desktop > button'
    );
    spectator.click(categoryFilterButton);
    const filterMenu = spectator.queryAll(
      '.cos-filter-category-select > .category-name'
    );
    component.filtersForm
      .get('CategoryGroup')
      .setValue(filterMenu[1].children[0].textContent);
    spectator.detectChanges();
    spectator.detectComponentChanges();

    const subCategoryNames = spectator.queryAll('.cos-sub-category');
    expect(subCategoryNames[0].textContent).toMatch(
      spectator.component.state.facets.CategoryValue[1].Value
    );
  });

  it('Exclude Filter should be displayed with Blank field when no Exclude keyword provided', () => {
    const { spectator } = testSetup();

    const label = 'Exclude';
    const filterLabel = spectator.query(
      '.cos-filter-exclude-menu > div.cos-filter-menu-desktop > button'
    );
    expect(filterLabel.innerHTML).toMatch(label);
  });

  it('Exclude Filter should be enabled by default', () => {
    const { spectator } = testSetup();

    const filterLabel = spectator.query(
      '.cos-filter-exclude-menu > div.cos-filter-menu-desktop > button'
    );
    expect(filterLabel).toHaveProperty('disabled', false);
  });

  it('Exclude Filter Menu should be closed if reset is pressed', () => {
    const { spectator } = testSetup({ exclude: ['test-keyword'] });

    let excludeFilterButton = spectator.query(
      '.cos-filter-exclude-menu > div.cos-filter-menu-desktop > button'
    );
    spectator.click(excludeFilterButton);
    spectator.detectChanges();
    const filterMenu = spectator.query('.filter-menu-exclude');
    expect(filterMenu).toBeTruthy();
    const filterMenuInput = spectator.query('input.filter-menu-exclude-input');
    expect(filterMenuInput).toBeTruthy();
    const applyButtonElement = spectator.query('.cos-filter-apply-button');
    applyButtonElement.removeAttribute('disabled');
    spectator.detectChanges();
    spectator.click(applyButtonElement);
    spectator.detectChanges();
    excludeFilterButton = spectator.query(
      '.cos-filter-exclude-menu > div.cos-filter-menu-desktop > button'
    );
    spectator.detectComponentChanges();
    const resetButton = spectator.query('.cos-filter-reset-button');
    expect(resetButton).toHaveProperty('disabled', false);
    spectator.click(resetButton);
    spectator.detectChanges();
    const filterMenuNow = spectator.query('.filter-menu-exclude');
    expect(filterMenuNow).toBeFalsy();
  });

  it('Exclude Filter Menu should be closed if clicked out', () => {
    const { spectator } = testSetup();

    const excludeFilterButton = spectator.query(
      '.cos-filter-exclude-menu > div.cos-filter-menu-desktop > button'
    );
    spectator.click(excludeFilterButton);
    spectator.detectChanges();
    const filterMenu = spectator.query('.filter-menu-exclude');
    expect(filterMenu).toBeTruthy();
    const outsideElement = spectator.query('.product-search-filters');
    spectator.click(outsideElement);
    spectator.detectChanges();
    const filterMenuNow = spectator.query('.filter-menu-exclude');
    expect(filterMenuNow).toBeFalsy();
  });

  it('Exclude Filter Menu should be closed if apply is pressed', () => {
    const { spectator } = testSetup({ exclude: ['food'] });

    const excludeFilterButton = spectator.query(
      '.cos-filter-exclude-menu > div.cos-filter-menu-desktop > button'
    );
    spectator.click(excludeFilterButton);
    spectator.detectComponentChanges();
    spectator.detectChanges();
    const filterMenu = spectator.query('.filter-menu-exclude');
    expect(filterMenu).toBeTruthy();
    const applyButtonElement = spectator.query('.cos-filter-apply-button');
    spectator.component.filtersForm.get('ExcludeTerms').setValue('food');
    spectator.detectComponentChanges();
    expect(applyButtonElement).toHaveProperty('disabled', false);
    spectator.click(applyButtonElement);
    expect(spectator.query('.filter-menu-exclude')).toBeFalsy();
  });

  it('Exclude Filter Menu should have enabled the reset button once we enter a key word and press apply', () => {
    const { spectator } = testSetup({ exclude: ['bag bose'] });

    const excludeFilterButton = spectator.query(
      '.cos-filter-exclude-menu > div.cos-filter-menu-desktop > button'
    );
    spectator.click(excludeFilterButton);
    spectator.detectChanges();
    const filterMenu = spectator.query('.filter-menu-exclude');
    expect(filterMenu).toBeTruthy();
    const filterMenuInput = spectator.query('input.filter-menu-exclude-input');
    spectator.typeInElement('test-keyword', filterMenuInput);
    expect(filterMenuInput).toBeTruthy();
    const applyButtonElement = spectator.query('.cos-filter-apply-button');
    applyButtonElement.removeAttribute('disabled');
    spectator.detectChanges();
    spectator.click(applyButtonElement);
    spectator.detectChanges();
    spectator.click(excludeFilterButton);
    const resetButton = spectator.query('.cos-filter-reset-button');
    expect(resetButton).toHaveProperty('disabled', false);
  });

  it('Exclude Filter Menu should have enabled the apply button once we enter a key word', () => {
    //Arrange
    const { spectator } = testSetup();
    const excludeFilterButton = spectator.query(
      '.cos-filter-exclude-menu > div.cos-filter-menu-desktop > button'
    );
    //Act
    spectator.click(excludeFilterButton);
    spectator.detectChanges();

    //Assert
    const filterMenu = spectator.query('.filter-menu-exclude');
    expect(filterMenu).toBeTruthy();
    let applyButtonElement = spectator.query('.cos-filter-apply-button');
    expect(applyButtonElement).toHaveProperty('disabled', true);

    //Act
    const filterMenuInput = spectator.query('input.filter-menu-exclude-input');
    expect(filterMenuInput).toBeTruthy();
    spectator.typeInElement('test-keyword', filterMenuInput);

    //Re-Assert
    applyButtonElement = spectator.query('.cos-filter-apply-button');
    expect(applyButtonElement).toHaveProperty('disabled', false);
  });

  it('Exclude Filter Label should be updated to <Value entered> when user enters single keyword and clicks Apply', () => {
    const {
      spectator,
      spies: { searchSpyFn },
    } = testSetup({ exclude: ['food'], setSpies: true });

    spectator.component.applyFilter();
    expect(searchSpyFn).toHaveBeenCalledTimes(1);
    const label = 'Exclude: food';
    spectator.detectChanges();

    const filterLabel = spectator.query(
      '.cos-filter-exclude-menu > div.cos-filter-menu-desktop > button'
    );
    expect(filterLabel.innerHTML).toMatch(label);
  });

  it('Exclude Filter Label should be correctly updated when values entered has special characters', () => {
    const {
      spectator,
      spies: { searchSpyFn },
    } = testSetup({ exclude: ['food$'], setSpies: true });

    spectator.component.applyFilter();
    expect(searchSpyFn).toHaveBeenCalledTimes(1);
    spectator.detectChanges();
    const label = 'Exclude: food$';
    const filterLabel = spectator.query(
      '.cos-filter-exclude-menu > div.cos-filter-menu-desktop > button'
    );
    expect(filterLabel.textContent).toMatch(label);
  });

  it('Exclude Filter Label should be correctly updated when values entered has numeric characters', () => {
    const {
      spectator,
      spies: { searchSpyFn },
    } = testSetup({ exclude: ['watch23'], setSpies: true });

    spectator.detectChanges();
    spectator.detectComponentChanges();
    spectator.component.applyFilter();
    expect(searchSpyFn).toHaveBeenCalledTimes(1);
    const label = 'Exclude: watch23';
    spectator.detectChanges();
    spectator.detectComponentChanges();

    const filterLabel = spectator.query(
      '.cos-filter-exclude-menu > div.cos-filter-menu-desktop > button'
    );
    expect(filterLabel.innerHTML).toMatch(label);
  });

  it('Exclude Filter Label should be updated to <Value1 Value2 entered> when user enters multiple keyword and clicks Apply', () => {
    const {
      spectator,
      spies: { searchSpyFn },
    } = testSetup({ exclude: ['bag bose'], setSpies: true });

    spectator.component.applyFilter();
    expect(searchSpyFn).toHaveBeenCalledTimes(1);
    const label = 'Exclude: bag bose';
    spectator.detectChanges();
    const filterLabel = spectator.query(
      '.cos-filter-exclude-menu > div.cos-filter-menu-desktop > button'
    );
    expect(filterLabel.innerHTML).toMatch(label);
  });

  it('Exclude Filter Label should be displayed with ellipses if data does not fit on the button', () => {
    const {
      spectator,
      spies: { searchSpyFn },
    } = testSetup({ exclude: ['bag bose'], setSpies: true });

    spectator.component.applyFilter();
    expect(searchSpyFn).toHaveBeenCalledTimes(1);
    spectator.detectChanges();
    expect(
      spectator.query(
        '.cos-filter-exclude-menu > div.cos-filter-menu-desktop > button'
      )
    ).toHaveClass('cos-filter-btn');
  });

  it('Exclude Filter Label should show previously entered keyword when user opens the filter again after executing exclude keyword search', () => {
    const {
      spectator,
      component,
      spies: { searchSpyFn },
    } = testSetup({ exclude: ['bag bose'], setSpies: true });

    const excludeFilterButton = spectator.query(
      '.cos-filter-exclude-menu > div.cos-filter-menu-desktop > button'
    );
    spectator.click(excludeFilterButton);
    spectator.detectChanges();
    expect(spectator.query('.filter-menu-exclude')).toBeTruthy();
    component.applyFilter();
    expect(searchSpyFn).toHaveBeenCalledTimes(1);
    const label = 'Exclude: bag bose';
    spectator.detectChanges();
    const applyButtonElement = spectator.query('.cos-filter-apply-button');
    applyButtonElement.removeAttribute('disabled');
    spectator.detectChanges();
    spectator.click(applyButtonElement);
    spectator.detectChanges();
    const outsideElement = spectator.query('.product-search-filters');
    spectator.click(outsideElement);
    spectator.detectChanges();
    expect(spectator.query('.filter-menu-exclude')).toBeFalsy();
    expect(excludeFilterButton.innerHTML).toMatch(label);
  });

  it('Exclude Filter Reset Button should get disabled when user removes already entered text form the field.', () => {
    const { spectator, component } = testSetup({ exclude: ['bag bose'] });

    const excludeFilterButton = spectator.query(
      '.cos-filter-exclude-menu > div.cos-filter-menu-desktop > button'
    );
    spectator.click(excludeFilterButton);
    spectator.detectChanges();
    const filterMenu = spectator.query('.filter-menu-exclude');
    expect(filterMenu).toBeTruthy();
    component.state.criteria.excludeTerm = '';
    spectator.detectComponentChanges();

    const resetButton = spectator.query('.cos-filter-reset-button');
    expect(resetButton).toHaveProperty('disabled', true);
  });

  it('Exclude Filter Reset Button should be disabled by default', () => {
    const { spectator } = testSetup();

    const excludeFilterButton = spectator.query(
      '.cos-filter-exclude-menu > div.cos-filter-menu-desktop > button'
    );
    spectator.click(excludeFilterButton);
    spectator.detectChanges();
    spectator.detectComponentChanges();

    const filterMenu = spectator.query('.filter-menu-exclude');
    expect(filterMenu).toBeTruthy();
    const resetButton = spectator.query('.cos-filter-reset-button');
    expect(resetButton).toHaveProperty('disabled', true);
  });

  it('Exclude Filter Apply Button should be disabled by default', () => {
    const { spectator } = testSetup();

    const excludeFilterButton = spectator.query(
      '.cos-filter-exclude-menu > div.cos-filter-menu-desktop > button'
    );
    spectator.click(excludeFilterButton);
    spectator.detectChanges();
    const filterMenu = spectator.query('.filter-menu-exclude');
    expect(filterMenu).toBeTruthy();
    const applyButton = spectator.query('.cos-filter-apply-button');
    expect(applyButton).toHaveProperty('disabled', true);
  });

  it('Exclude Filter Apply Button should be enabled once user enters a keyword', () => {
    const { spectator } = testSetup();

    const excludeFilterButton = spectator.query(
      '.cos-filter-exclude-menu > div.cos-filter-menu-desktop > button'
    );
    spectator.click(excludeFilterButton);
    spectator.detectChanges();
    const filterMenuInput = spectator.query('input.filter-menu-exclude-input');
    spectator.typeInElement('test-keyword', filterMenuInput);
    expect(filterMenuInput).toBeTruthy();
    spectator.detectChanges();
    const applyButton = spectator.query('.cos-filter-apply-button');
    expect(applyButton).toHaveProperty('disabled', false);
  });

  it('Exclude Filter Apply Button should get disabled when user removes already entered text form the field.', () => {
    const { spectator, component } = testSetup();

    const excludeFilterButton = spectator.query(
      '.cos-filter-exclude-menu > div.cos-filter-menu-desktop > button'
    );
    spectator.click(excludeFilterButton);
    spectator.detectChanges();
    const filterMenu = spectator.query('.filter-menu-exclude');
    expect(filterMenu).toBeTruthy();
    component.state.criteria.excludeTerm = 'bag bose';
    spectator.detectComponentChanges();
    const applyButton = spectator.query('.cos-filter-apply-button');
    expect(applyButton).toHaveProperty('disabled', true);
  });

  it('Exclude Filter should be comma delimited.', () => {
    const { spectator, component } = testSetup({ exclude: ['red green blue'] });
    component.filtersForm.get('ExcludeTerms').setValue('red green     blue');

    const criteria = {
      ...component.state.criteria,
      ...mapFiltersFormToSearchCriteria(component.filtersForm?.value),
    };
    spectator.detectChanges();
    expect(criteria.excludeTerm).toBe('red, green, blue');
  });

  it('Exclude Filter remove pill should remove respective to index.', () => {
    const { spectator, component } = testSetup({
      exclude: ['red green   blue'],
    });
    component.filtersForm.get('ExcludeTerms').setValue('red, green, blue');

    spectator.detectChanges();
    spectator.detectComponentChanges();

    component.removeFilter({ ControlName: 'ExcludeTerms', Value: ' green' });
    spectator.detectChanges();
    spectator.detectComponentChanges();
    const criteria = {
      ...component.state.criteria,
      ...mapFiltersFormToSearchCriteria(component.filtersForm?.value),
    };
    expect(criteria.excludeTerm).toBe('red, blue');
  });

  it('should reset category, supplier and colors filters', () => {
    const { component } = testSetup();

    component.resetCategory();
    expect(component.filtersForm.get('CategoryGroup').value).toBe(
      FILTERS_FORM_DEFAULT.CategoryGroup
    );
    expect(component.filtersForm.get('CategoryValue').value).toBe(
      FILTERS_FORM_DEFAULT.CategoryValue
    );
    component.resetFilter('Supplier', 'SupplierSearchTerm');
    expect(component.filtersForm.get('Supplier').value).toBe(
      FILTERS_FORM_DEFAULT.Supplier
    );
    component.resetFilter('Color', 'ColorSearchTerm');
    expect(component.filtersForm.get('Color').value).toBe(
      FILTERS_FORM_DEFAULT.Color
    );
  });

  it('should toggle show all filters', () => {
    const { component } = testSetup();

    component.showAllFilters = false;
    component.toggleShowAllFilters();
    expect(component.showAllFilters).toBeTruthy();
    component.toggleShowAllFilters();
    expect(component.showAllFilters).toBeFalsy();
  });

  it('Checkboxes should be closed on apply', () => {
    const { spectator } = testSetup();
    const showMoreButtonElement = spectator.query(
      'cos-filter-controls > button:first-child'
    );
    spectator.click(showMoreButtonElement);
    expect(showMoreButtonElement).toHaveText('Show Less');
    const applyBtn = spectator.queryLast('div.cos-mega-menu-controls > button');
    spectator.click(applyBtn);
    spectator.detectChanges();
    expect(showMoreButtonElement).toHaveText('Show More');
    expect(
      spectator.queryAll('div.cos-mega-menu-radios > cos-checkbox').length
    ).toBe(0);
  });

  it('Checkboxes should all have rendered', () => {
    const { spectator } = testSetup();

    const showMoreButtonElement = spectator.query(
      'cos-filter-controls > button:first-child'
    );
    spectator.click(showMoreButtonElement);
    const checkboxControls = spectator.queryAll(
      'div.cos-mega-menu-radios > cos-checkbox'
    );
    expect(checkboxControls).toHaveLength(CHECK_BOXES.length);
  });

  it('Checkboxes should all have same label as defined for checkBoxFilters', () => {
    const { spectator } = testSetup();

    const showMoreButtonElement = spectator.query(
      'cos-filter-controls > button:first-child'
    );
    spectator.click(showMoreButtonElement);
    const checkboxControls = spectator.queryAll(
      'div.cos-mega-menu-radios > cos-checkbox'
    );
    for (let i = 0; i < CHECK_BOXES.length; i++) {
      expect(checkboxControls[i]).toHaveText(CHECK_BOXES[i].label);
    }
  });

  it('Checkboxes should all have checked on click', () => {
    const { spectator } = testSetup();

    const showMoreButtonElement = spectator.query(
      'cos-filter-controls > button:first-child'
    );
    spectator.click(showMoreButtonElement);
    const checkboxControls = spectator.queryAll(
      'div.cos-mega-menu-radios > cos-checkbox'
    );
    for (let i = 0; i < CHECK_BOXES.length; i++) {
      const checkboxInput = spectator.query(`input[name=checkbox-${i}]`);
      spectator.click(checkboxInput);
      expect(checkboxControls[i]).toHaveClass('cos-checkbox-checked');
    }
  });

  it('Checkboxes should all have updated the form value on click', () => {
    const { spectator, component } = testSetup();

    const showMoreButtonElement = spectator.query(
      'cos-filter-controls > button:first-child'
    );
    spectator.click(showMoreButtonElement);
    expect(showMoreButtonElement).toHaveText('Show Less');

    for (let i = 0; i < CHECK_BOXES.length; i++) {
      const checkboxInput = spectator.query(`input[name=checkbox-${i}]`);
      spectator.click(checkboxInput);
    }
    const applyBtn = spectator.queryLast('div.cos-mega-menu-controls > button');
    spectator.click(applyBtn);
    spectator.detectChanges();

    expect(showMoreButtonElement).toHaveText('Show More');

    for (let i = 0; i < CHECK_BOXES.length; i++) {
      expect(
        component.filtersForm.get(`CheckBoxes.${CHECK_BOXES[i].value}`)
      ).toBeTruthy();
    }
  });

  it("Checkboxes should reset to unchecked when 'Show Less' button is clicked, without applying changes", () => {
    const { spectator } = testSetup();

    const showMoreButtonElement = spectator.query(
      'cos-filter-controls > button:first-child'
    );
    spectator.click(showMoreButtonElement);
    expect(showMoreButtonElement).toHaveText('Show Less');

    for (let i = 0; i < CHECK_BOXES.length - 10; i++) {
      const checkboxInput = spectator.query(`input[name=checkbox-${i}]`);
      spectator.click(checkboxInput);
    }

    spectator.click(showMoreButtonElement);
    spectator.detectChanges();
    spectator.click(showMoreButtonElement);
    spectator.detectChanges();

    expect(showMoreButtonElement).toHaveText('Show Less');

    for (let i = 0; i < CHECK_BOXES.length; i++) {
      const checkboxInput = spectator.query(`input[name=checkbox-${i}]`);
      expect(checkboxInput.getAttribute('aria-checked')).toEqual('false');
    }
  });
});
