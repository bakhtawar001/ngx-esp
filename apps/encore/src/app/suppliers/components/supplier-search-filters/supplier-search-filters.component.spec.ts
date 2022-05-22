import { BreakpointObserver } from '@angular/cdk/layout';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  FormGroupDirective,
} from '@angular/forms';
import { SearchFilter } from '@esp/models';
import {
  FiltersForm,
  mapFiltersToSearchCriteria,
  SUPPLIER_FILTERS_DEFAULT,
} from '@esp/suppliers';
import { createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { Store } from '@ngxs/store';
import {} from 'ng-mocks';
import { of } from 'rxjs';
import { SupplierSearchLocalState } from '../../local-states';
import {
  SupplierSearchFiltersComponent,
  SupplierSearchFiltersComponentModule,
} from './supplier-search-filters.component';

describe('SupplierSearchFiltersComponent', () => {
  beforeEach(async () => {
    const filters: typeof SUPPLIER_FILTERS_DEFAULT = {
      ...SUPPLIER_FILTERS_DEFAULT,
    };
  });

  const filterFormGroup: FormGroup = new FormGroup({
    MinorityOwned: new FormControl(''),
  });

  const fgd: FormGroupDirective = new FormGroupDirective([], []);
  fgd.form = filterFormGroup;

  const createComponent = createComponentFactory({
    component: SupplierSearchFiltersComponent,
    imports: [SupplierSearchFiltersComponentModule],
    providers: [
      {
        provide: ControlContainer,
        useValue: fgd,
      },
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
      mockProvider(SupplierSearchLocalState, {
        connect() {
          return of(this);
        },
      }),
    ],
  });

  const testSetup = (options?: {
    filters?: Partial<Record<keyof FiltersForm, SearchFilter>>;
    setSpies?: boolean;
  }) => {
    const spectator = createComponent({
      providers: [
        mockProvider(SupplierSearchLocalState, <
          Partial<SupplierSearchLocalState>
        >{
          connect() {
            return of(this);
          },
          criteria: <unknown>{
            excludeTerm: null,
            filters: options?.filters,
            term: 'pen',
            from: 1,
            sortBy: '',
            size: 48,
          },
        }),
      ],
    });

    if (options?.setSpies) {
      const localState = spectator.inject(SupplierSearchLocalState, true);
      const searchSpyFn = jest
        .spyOn(localState, 'search')
        .mockReturnValue(null);
      return {
        spectator,
        component: spectator.component,
        spies: { searchSpyFn },
      };
    }
    return { spectator, component: spectator.component };
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Cos-Filter-Menu works', () => {
    const { component } = testSetup();
    expect(component).toBeTruthy();
  });

  describe('minority owned filter', () => {
    it('should have minority owned filter visible on supplier results page', () => {
      const { spectator } = testSetup();

      const filterButton = spectator.query(
        'cos-filters > div.cos-filters-desktop > div.minority-owned-container > cos-checkbox'
      );
      expect(filterButton).toHaveText('Minority Owned');
    });

    it('should be able to check the minority-owned checkbox on click', () => {
      const { spectator } = testSetup();
      const checkboxParent = spectator.query(
        'cos-filters > div.cos-filters-desktop > div.minority-owned-container > cos-checkbox'
      );
      const checkboxInput = spectator.query('input[name=minorityOwned]');

      spectator.click(checkboxInput);
      spectator.detectChanges();

      expect(checkboxParent).toHaveClass('cos-checkbox-checked');
    });

    it('should have high-lighted border line once the minority owned is checked', () => {
      const { spectator } = testSetup();
      const checkboxContainer = spectator.query(
        'div.cos-filters-desktop > div.minority-owned-container'
      );
      const checkboxInput = spectator.query('input[name=minorityOwned]');

      spectator.click(checkboxInput);
      spectator.detectChanges();

      expect(checkboxContainer).toHaveClass('minority-owned-applied');
    });

    it('Clicking on minority owned should trigger a search', () => {
      const {
        spectator,
        spies: { searchSpyFn },
      } = testSetup({
        setSpies: true,
      });
      // filters: { MinorityOwned: { terms: ['true'] } },

      const checkboxInput = spectator.query('input[name=minorityOwned]');
      spectator.click(checkboxInput);
      spectator.detectChanges();

      const criteria = {
        ...spectator.component.state.criteria,
        from: 1,
        ...mapFiltersToSearchCriteria(
          spectator.component.supplierFiltersForm.value
        ),
      };

      expect(searchSpyFn).toBeCalledWith(criteria);
    });
  });
});
