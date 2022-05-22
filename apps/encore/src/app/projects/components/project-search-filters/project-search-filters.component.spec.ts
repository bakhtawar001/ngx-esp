import { BreakpointObserver } from '@angular/cdk/layout';
import { DatePipe } from '@angular/common';
import { fakeAsync } from '@angular/core/testing';
import { dataCySelector } from '@cosmos/testing';
import { createComponentFactory } from '@ngneat/spectator';
import { mockProvider } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { EMPTY, of } from 'rxjs';
import { PROJECT_SEARCH_LOCAL_STATE } from '../../local-states';
import {
  ProjectSearchFiltersComponent,
  ProjectSearchFiltersModule,
} from './project-search-filters.component';

const stepNameFacetsOptions = ['Negotiating and Pitching', 'Close'];
const ownerFacetsOptions = [
  {
    Id: 134577,
    Name: 'Frank Arsenault',
    IconImageUrl: null,
    Email: 'test@t.com',
    IsActive: true,
  },
  {
    Id: 151701,
    Name: 'Jerry Boland',
    IconImageUrl:
      'https://commonmedia.uat-asicentral.com/orders/Artwork/512e7c81bb4a41edaa4ca59c87d7005f.jpg',
    Email: 'jerryb@asicomp.com',
    IsActive: true,
  },
  {
    Id: 26190,
    Name: 'Adam Hebert',
    IconImageUrl: null,
    Email: null,
    IsActive: true,
  },
  {
    Id: 28966,
    Name: 'Leigh Pennyyssss',
    IconImageUrl: null,
    Email: 'lpenny@asicentral.com',
    IsActive: true,
  },
  {
    Id: 303044,
    Name: 'Devon Lehman',
    IconImageUrl: null,
    Email: 'dlehman@asicentral.com',
    IsActive: true,
  },
  {
    Id: 553137,
    Name: 'Rai125724 Rai125724',
    IconImageUrl:
      'https://commonmedia.uat-asicentral.com/orders/Artwork/edfa31f554104eda974b978ebe5ea333.jpg',
    Email: 'bill@gmail.com',
    IsActive: true,
  },
  {
    Id: 553488,
    Name: 'Vlad Savitskyi',
    IconImageUrl: null,
    Email: null,
    IsActive: true,
  },
];

const selectors = {
  filterMenu: {
    menuComponent: 'cos-filter-menu',
    menuButton: dataCySelector('menu-button'),
    ownerFilterMenu: dataCySelector('owner-filter-menu'),
    ownerSearch: dataCySelector('owner-search'),
    stepNameSearch: dataCySelector('step-name-search'),
    applyButton: dataCySelector('filter-apply-button'),
    resetButton: dataCySelector('filter-reset-button'),
  },
  filterPillLabel: dataCySelector('filter-pill-label'),
  matListOption: 'mat-list-option',
  matSelectionList: 'mat-selection-list',
  matPseudoCheckbox: 'mat-pseudo-checkbox',
  matPseudoCheckboxChecked: 'mat-pseudo-checkbox-checked',
  dateRangePicker: dataCySelector('asi-date-range-select'),
};

const openFilterMenu = (spectator: any, index: number) => {
  const menus = spectator.queryAll(`${selectors.filterMenu.menuButton}`);

  spectator.click(menus[index]);
};

const state = {
  tabs: [{ name: 'Active' }, { name: 'Closed' }],
  criteria: <unknown>{
    Terms: '',
    From: [1],
    AggregationsOnly: [false],
    SortBy: ['DFLT'],
    Size: 48,
    OrganicSize: 1,
    PriceFilter: {},
    filters: {},
  },
  filters: {},
  ownerFacets: ownerFacetsOptions,
  stepNameFacets: stepNameFacetsOptions,
  hasLoaded: true,
};

const filters = {
  criteria: {
    filters: {
      Owners: { terms: [134577], behavior: 'Any' },
      StepName: { terms: ['Negotiating and Pitching'], behavior: 'Any' },
      InHandsDate: {
        terms: ['2021-11-30T23:00:00.000Z', '2021-12-30T23:00:00.000Z'],
        behavior: 'Any',
      },
      EventDate: {
        terms: ['2021-11-30T23:00:00.000Z', '2021-12-30T23:00:00.000Z'],
        behavior: 'Any',
      },
    },
  },
  filters: {
    Owners: { terms: [134577], behavior: 'Any' },
    StepName: { terms: ['Negotiating and Pitching'], behavior: 'Any' },
    InHandsDate: {
      terms: ['2021-11-30T23:00:00.000Z', '2021-12-30T23:00:00.000Z'],
      behavior: 'Any',
    },
    EventDate: {
      terms: ['2021-11-30T23:00:00.000Z', '2021-12-30T23:00:00.000Z'],
      behavior: 'Any',
    },
  },
};

const filterPills = [
  {
    Value: 134577,
  },
  {
    Value: 'Negotiating and Pitching',
  },
];

describe('ProjectSearchFiltersComponent', () => {
  const createComponent = createComponentFactory({
    component: ProjectSearchFiltersComponent,
    imports: [ProjectSearchFiltersModule, NgxsModule.forRoot()],
  });

  const testSetup = (options?: any) => {
    const spectator = createComponent({
      providers: [
        {
          provide: PROJECT_SEARCH_LOCAL_STATE,
          useValue: {
            ...state,
            ...options?.state,
            connect: () => of({ ...state, ...options?.state }),
            search: () => EMPTY,
            closeProject: (project) => EMPTY,
            reopenProject: (project) => EMPTY,
            transferOwnership: (project, userId) => EMPTY,
            setFilters: () => EMPTY,
            ownerFacets: ownerFacetsOptions,
            stepNameFacets: stepNameFacetsOptions,
          },
        },
        mockProvider(BreakpointObserver, {
          observe: () => of({ matches: true }),
        }),
        mockProvider(DatePipe),
      ],
    });

    spectator.detectComponentChanges();

    return { spectator, component: spectator.component };
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    const { spectator } = testSetup();
    expect(spectator).toBeTruthy();
  });

  it('should display 4 menus', () => {
    const { spectator } = testSetup();

    expect(spectator.queryAll(selectors.filterMenu.menuComponent).length).toBe(
      4
    );
  });

  it('should display proper title for menus', () => {
    const { spectator, component } = testSetup();
    const menus = spectator.queryAll(`${selectors.filterMenu.menuButton}`);

    expect(menus[0].textContent.trim()).toBe(component.presenter.labels.owner);
    expect(menus[1].textContent.trim()).toBe(
      component.presenter.labels.stepName
    );
    expect(menus[2].textContent.trim()).toBe(
      component.presenter.labels.inHandsDate
    );
    expect(menus[3].textContent.trim()).toBe(
      component.presenter.labels.eventDate
    );
  });

  it('should display proper title for menus when single filter is selected', () => {
    const { spectator, component } = testSetup({
      state: {
        ...filters,
        filterPills,
      },
    });
    const menus = spectator.queryAll(`${selectors.filterMenu.menuButton}`);

    expect(menus[0].textContent.trim()).toBe('1 Owner');
    expect(menus[1].textContent.trim()).toBe('1 Phase');
    expect(menus[2].textContent.trim()).toBe(
      component.presenter.labels.inHandsDate
    );
    expect(menus[3].textContent.trim()).toBe(
      component.presenter.labels.eventDate
    );
  });

  it('should display proper title for menus when two filters is selected', () => {
    const { spectator, component } = testSetup({
      state: {
        criteria: {
          filters: {
            Owners: { terms: [134577, 26190], behavior: 'Any' },
            StepName: {
              terms: ['Negotiating and Pitching', 'Close'],
              behavior: 'Any',
            },
          },
        },
        filters: {
          Owners: { terms: [134577, 26190], behavior: 'Any' },
          StepName: {
            terms: ['Negotiating and Pitching', 'Close'],
            behavior: 'Any',
          },
        },
        filterPills: [
          {
            Value: 134577,
          },
          {
            Value: 26190,
          },
          {
            Value: 'Negotiating and Pitching',
          },
          {
            Value: 'Close',
          },
        ],
      },
    });
    const menus = spectator.queryAll(`${selectors.filterMenu.menuButton}`);

    expect(menus[0].textContent.trim()).toBe('2 Owners');
    expect(menus[1].textContent.trim()).toBe('2 Phases');
    expect(menus[2].textContent.trim()).toBe(
      component.presenter.labels.inHandsDate
    );
    expect(menus[3].textContent.trim()).toBe(
      component.presenter.labels.eventDate
    );
  });

  describe('Filter pills', () => {
    it('should display filter pill with proper format', () => {
      const { spectator, component } = testSetup({
        state: {
          ...filters,
        },
      });

      const filterPills = spectator.queryAll(selectors.filterPillLabel);
      filterPills.forEach((element, index) => {
        expect(element.innerHTML).toBe(component.filterPills[index].Label);
      });
    });
  });

  describe('Owner filter', () => {
    it('should display owner facets options', () => {
      const { spectator } = testSetup();
      openFilterMenu(spectator, 0);
      expect(spectator.queryAll(selectors.matListOption).length).toEqual(7);
    });

    it('should filter display owner facets options', fakeAsync(() => {
      const { spectator, component } = testSetup();
      openFilterMenu(spectator, 0);
      const input = spectator.query(selectors.filterMenu.ownerSearch);
      expect(input).toBeVisible();
      spectator.typeInElement('Frank', input);
      const matListOptions = spectator.queryAll(selectors.matListOption);
      matListOptions.forEach((element, index) => {
        if (index === 0) {
          expect(element).toBeVisible();
        } else {
          expect(element).not.toBeVisible();
        }
      });
    }));

    it('apply button should be disabled', () => {
      const { spectator } = testSetup();
      openFilterMenu(spectator, 0);
      expect(spectator.query(selectors.filterMenu.applyButton)).toBeDisabled();
    });

    it('reset button should be disabled', () => {
      const { spectator } = testSetup();
      openFilterMenu(spectator, 0);
      expect(spectator.query(selectors.filterMenu.resetButton)).toBeDisabled();
    });

    it('should check first option and apply filter', () => {
      const { spectator, component } = testSetup();
      const applyFilterSpy = jest.spyOn(component, 'applyFilter');
      openFilterMenu(spectator, 0);
      const options = spectator.queryAll(selectors.matListOption);
      spectator.click(options[0]);
      expect(
        spectator
          .queryAll(selectors.matPseudoCheckbox)[0]
          .classList.contains(selectors.matPseudoCheckboxChecked)
      );
      expect(
        spectator.query(selectors.filterMenu.applyButton)
      ).not.toBeDisabled();
      spectator.click(selectors.filterMenu.applyButton);
      expect(applyFilterSpy).toHaveBeenCalledWith(
        component.presenter.filterFormControls.OwnersSearchTerm
      );
    });

    it('should check first option and reset it', () => {
      const { spectator, component } = testSetup({
        state: {
          ...filters,
        },
      });
      const spyRemove = jest.spyOn(component, 'resetFilter');
      openFilterMenu(spectator, 0);
      const resetButton = spectator.query(selectors.filterMenu.resetButton);
      expect(resetButton).not.toBeDisabled();
      spectator.click(resetButton);
      expect(spyRemove).toHaveBeenCalledWith(
        component.presenter.filterFormControls.OwnerTerms,
        component.presenter.filterFormControls.OwnersSearchTerm
      );
      expect(spectator.query(selectors.matSelectionList)).not.toBeVisible();
    });
  });

  describe('Step name', () => {
    it('should display step name options', () => {
      const { spectator } = testSetup();
      openFilterMenu(spectator, 1);
      expect(spectator.queryAll(selectors.matListOption).length).toEqual(2);
    });

    it('should filter step name options', fakeAsync(() => {
      const { spectator } = testSetup();
      openFilterMenu(spectator, 1);
      const input = spectator.query(selectors.filterMenu.stepNameSearch);
      expect(input).toBeVisible();
      spectator.typeInElement('Negotiating', input);
      const matListOptions = spectator.queryAll(selectors.matListOption);
      matListOptions.forEach((element, index) => {
        if (index === 0) {
          expect(element).toBeVisible();
        } else {
          expect(element).not.toBeVisible();
        }
      });
    }));

    it('apply button should be disabled', () => {
      const { spectator } = testSetup();
      openFilterMenu(spectator, 1);
      expect(spectator.query(selectors.filterMenu.applyButton)).toBeDisabled();
    });

    it('reset button should be disabled', () => {
      const { spectator } = testSetup();
      openFilterMenu(spectator, 1);
      expect(spectator.query(selectors.filterMenu.resetButton)).toBeDisabled();
    });

    it('should check first option and apply filter', () => {
      const { spectator, component } = testSetup();
      const applyFilterSpy = jest.spyOn(component, 'applyFilter');
      openFilterMenu(spectator, 1);
      const options = spectator.queryAll(selectors.matListOption);
      spectator.click(options[0]);
      expect(
        spectator
          .queryAll(selectors.matPseudoCheckbox)[0]
          .classList.contains(selectors.matPseudoCheckboxChecked)
      );
      expect(
        spectator.query(selectors.filterMenu.applyButton)
      ).not.toBeDisabled();
      spectator.click(selectors.filterMenu.applyButton);
      expect(applyFilterSpy).toHaveBeenCalledWith(
        component.presenter.filterFormControls.StepNameSearchTerm
      );
    });

    it('should check first option and reset it', () => {
      const { spectator, component } = testSetup({
        state: {
          ...filters,
        },
      });
      const spyRemove = jest.spyOn(component, 'resetFilter');
      openFilterMenu(spectator, 1);
      const resetButton = spectator.query(selectors.filterMenu.resetButton);
      expect(resetButton).not.toBeDisabled();
      spectator.click(resetButton);
      expect(spyRemove).toHaveBeenCalledWith(
        component.presenter.filterFormControls.StepNameTerms,
        component.presenter.filterFormControls.StepNameSearchTerm
      );
      expect(spectator.query(selectors.matSelectionList)).not.toBeVisible();
    });
  });

  describe('InHands date', () => {
    it('should display calendar component', () => {
      const { spectator } = testSetup();
      openFilterMenu(spectator, 2);
      expect(spectator.query(selectors.dateRangePicker)).toBeVisible();
    });

    it('apply button should be disabled', () => {
      const { spectator } = testSetup();
      openFilterMenu(spectator, 2);
      expect(spectator.query(selectors.filterMenu.applyButton)).toBeDisabled();
    });

    it('reset button should be disabled', () => {
      const { spectator } = testSetup();
      openFilterMenu(spectator, 2);
      expect(spectator.query(selectors.filterMenu.resetButton)).toBeDisabled();
    });
  });

  describe('Event date', () => {
    it('should display calendar component', () => {
      const { spectator } = testSetup();
      openFilterMenu(spectator, 3);
      expect(spectator.query(selectors.dateRangePicker)).toBeVisible();
    });

    it('apply button should be disabled', () => {
      const { spectator } = testSetup();
      openFilterMenu(spectator, 3);
      expect(spectator.query(selectors.filterMenu.applyButton)).toBeDisabled();
    });

    it('reset button should be disabled', () => {
      const { spectator } = testSetup();
      openFilterMenu(spectator, 3);
      expect(spectator.query(selectors.filterMenu.resetButton)).toBeDisabled();
    });
  });
});
