import { BreakpointObserver } from '@angular/cdk/layout';
import { fakeAsync } from '@angular/core/testing';
import { dataCySelector } from '@cosmos/testing';
import { OwnerAggregation, SearchCriteria } from '@esp/companies';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { EMPTY, of } from 'rxjs';
import { CompanyTabs } from '../../configs';
import { CompanySearchLocalState } from '../../local-states';
import {
  CompanySearchFiltersComponent,
  CompanySearchFiltersModule,
} from './company-search-filters.component';

const selectors = {
  recordOwner: {
    menuButton: dataCySelector('menu-button'),
    filterMenu: dataCySelector('record-owner-filter-menu'),
    filterMenuTitle: dataCySelector('record-owner-menu-title'),
    filterMenuSearch: dataCySelector('record-owner-search'),
    applyButton: dataCySelector('filter-apply-button'),
    resetButton: dataCySelector('filter-reset-button'),
  },
  matListOption: 'mat-list-option',
  matSelectionList: 'mat-selection-list',
  matPseudoCheckbox: 'mat-pseudo-checkbox',
  matPseudoCheckboxChecked: 'mat-pseudo-checkbox-checked',
};

function openFilterMenu(
  spectator: Spectator<CompanySearchFiltersComponent>,
  filterName: string
): void {
  spectator.click(spectator.query(selectors[filterName].menuButton));
}

function getOwnerFacets(count: number): OwnerAggregation[] {
  return new Array(count).fill(null).map((_, i) => ({
    Id: i + 1,
    Name: `Name${i + 1} Surname${i + 1}`,
    IconImageUrl: null,
    Email: `test${i + 1}@t.com`,
  }));
}

const state: Partial<CompanySearchLocalState> = {
  criteria: new SearchCriteria(),
  filters: {},
  ownerFacets: getOwnerFacets(10),
  hasLoaded: true,
};

describe('CompanySearchFiltersComponent', () => {
  const createComponent = createComponentFactory({
    component: CompanySearchFiltersComponent,
    imports: [CompanySearchFiltersModule, NgxsModule.forRoot()],
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
        mockProvider(BreakpointObserver, {
          observe: () => of({ matches: true }),
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

  describe('Record Owner filter', () => {
    it('should display filter menu', () => {
      const { spectator } = testSetup();

      expect(spectator.query(selectors.recordOwner.filterMenu)).toBeTruthy();
    });

    it('should display button with Record Owner title by default', () => {
      const { spectator } = testSetup();

      expect(spectator.query(selectors.recordOwner.menuButton)).toHaveText(
        'Record Owner'
      );
    });

    it('should display button Record Owner with counter when one filter selected', () => {
      const { spectator } = testSetup({
        state: {
          filters: {
            Owners: { terms: [4], behavior: 'Any' },
          },
        },
      });

      expect(spectator.query(selectors.recordOwner.menuButton)).toHaveText(
        '1 Owner'
      );
    });

    it('should display button Record Owner with counter when more than one filter selected', () => {
      const { spectator } = testSetup({
        state: {
          filters: {
            Owners: { terms: [2, 3], behavior: 'Any' },
          },
        },
      });

      expect(spectator.query(selectors.recordOwner.menuButton)).toHaveText(
        '2 Owners'
      );
    });

    it('should display dialog with Record Owner title when open', () => {
      const { spectator } = testSetup();
      openFilterMenu(spectator, 'recordOwner');

      expect(spectator.query(selectors.recordOwner.filterMenuTitle)).toHaveText(
        'Record Owner'
      );
    });

    it('should display dialog with list of owners when open', () => {
      const { spectator } = testSetup();
      openFilterMenu(spectator, 'recordOwner');

      expect(spectator.queryAll(selectors.matListOption).length).toEqual(10);
    });

    it('should filter list of owners', fakeAsync(() => {
      const { spectator } = testSetup();
      openFilterMenu(spectator, 'recordOwner');
      const input = spectator.query(selectors.recordOwner.filterMenuSearch);

      expect(input).toBeVisible();
      expect(spectator.queryAll(selectors.matListOption).length).toBe(10);

      spectator.typeInElement('Name2', input);

      expect(spectator.queryAll(selectors.matListOption).length).toBe(1);
      expect(spectator.query(selectors.matListOption)).toHaveText('Name2');
    }));

    it('apply button should be disabled when no owners are checked', () => {
      const { spectator } = testSetup();
      openFilterMenu(spectator, 'recordOwner');

      expect(spectator.query(selectors.recordOwner.applyButton)).toBeDisabled();
    });

    it('reset button should be disabled when no owners selected', () => {
      const { spectator } = testSetup();
      openFilterMenu(spectator, 'recordOwner');

      expect(spectator.query(selectors.recordOwner.resetButton)).toBeDisabled();
    });

    it('should check first owner and apply filter', () => {
      const { spectator, component } = testSetup();
      const applyFilterSpy = jest.spyOn(component, 'applyFilter');

      openFilterMenu(spectator, 'recordOwner');
      spectator.click(spectator.query(selectors.matListOption));

      expect(spectator.query(selectors.matListOption)).toHaveAttribute(
        'aria-selected',
        'true'
      );
      expect(
        spectator.query(selectors.recordOwner.applyButton)
      ).not.toBeDisabled();
      spectator.click(selectors.recordOwner.applyButton);
      expect(applyFilterSpy).toHaveBeenCalledWith(
        component.presenter.filterFormControls.OwnersSearchTerm
      );
    });

    it('should check first option and reset it', () => {
      const { spectator, component } = testSetup({
        state: {
          filters: {
            Owners: { terms: [1], behavior: 'Any' },
          },
          criteria: new SearchCriteria({
            filters: {
              Owners: { terms: [1], behavior: 'Any' },
            },
          }),
        },
      });
      const resetFilterSpy = jest.spyOn(component, 'resetFilter');
      openFilterMenu(spectator, 'recordOwner');
      const resetButton = spectator.query(selectors.recordOwner.resetButton);

      expect(resetButton).not.toBeDisabled();
      expect(spectator.query(selectors.matListOption)).toHaveAttribute(
        'aria-selected',
        'true'
      );

      spectator.click(resetButton);
      expect(resetFilterSpy).toHaveBeenCalledWith(
        component.presenter.filterFormControls.Owners,
        component.presenter.filterFormControls.OwnersSearchTerm
      );

      openFilterMenu(spectator, 'recordOwner');
      expect(spectator.query(selectors.matListOption)).toHaveAttribute(
        'aria-selected',
        'false'
      );
    });

    it('should disabled menu button for Owned By Me tab', fakeAsync(() => {
      const { spectator } = testSetup({
        state: {
          tabIndex: CompanyTabs.OwnedByMe,
        },
      });

      expect(spectator.query(selectors.recordOwner.menuButton)).toBeDisabled();
    }));

    it('should display button Record Owner when disabled and filters selected', () => {
      const { spectator } = testSetup({
        state: {
          tabIndex: CompanyTabs.OwnedByMe,
          filters: {
            Owners: { terms: [4, 6], behavior: 'Any' },
          },
        },
      });

      expect(spectator.query(selectors.recordOwner.menuButton)).toHaveText(
        'Record Owner'
      );
    });
  });
});
