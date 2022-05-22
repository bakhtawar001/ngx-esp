import { CommonModule } from '@angular/common';
import { fakeAsync } from '@angular/core/testing';
import { MatTabsModule } from '@angular/material/tabs';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import type { SortOption, TabFilter } from '../../types';
import { createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { of, Subject } from 'rxjs';
import { SearchLocalState, SEARCH_LOCAL_STATE } from '../../local-states';
import { SearchTabGroupComponent } from './search-tab-group.component';

export const tabs: TabFilter[] = [
  {
    name: 'All',
    criteria: { status: null, filters: null },
    cssClass: 'all-entities',
  },
  {
    name: `Active`,
    criteria: { status: 'Active', filters: null },
    cssClass: 'active-entities',
  },
  {
    name: 'Owned by me',
    criteria: {
      status: 'Active',
      filters: {
        Owners: {
          terms: [],
          behavior: 'Any',
        },
      },
    },
    cssClass: 'owned-by-me-entities',
  },
  {
    name: 'Shared with me',
    criteria: {
      status: 'Active',
      filters: {
        Owners: {
          terms: [],
          behavior: 'Not',
        },
      },
    },
    cssClass: 'shared-entities',
  },
  {
    name: `Inactive`,
    criteria: { status: 'Inactive', filters: null },
    cssClass: 'inactive-entities',
  },
];

const sortOptions: SortOption[] = [
  {
    name: 'Last Updated',
    value: 'default',
  },
  {
    name: 'Oldest',
    value: 'oldest',
  },
  {
    name: 'Newest',
    value: 'newest',
  },
  {
    name: 'Name A-Z',
    value: 'az',
  },
  {
    name: 'Name Z-A',
    value: 'za',
  },
];

describe('SearchTabGroupComponent', () => {
  const createComponent = createComponentFactory({
    component: SearchTabGroupComponent,
    imports: [CommonModule, MatTabsModule],
    providers: [
      mockProvider(SearchLocalState, {
        connect() {
          return of(this);
        },
        search: () => of(),
      }),
    ],
  });

  const testSetup = (options?: {
    sort?: SortOption;
    term?: string;
    tab?: number;
  }) => {
    const detectChanges$ = new Subject<void>();

    const spectator = createComponent({
      props: { tabs },
      providers: [
        {
          provide: SEARCH_LOCAL_STATE,
          useValue: <Partial<SearchLocalState>>{
            connect() {
              return of(this);
            },
            search: () => of(),
            setTab: jest.fn(() => of()),
            from: 1,
            term: options?.term || '',
            sort: options?.sort || sortOptions[0],
            tabIndex: options?.tab || 0,
            tab: tabs[options?.tab] || tabs[0],
          },
        },
      ],
    });

    const spectatorDetectChanges = spectator.detectChanges;

    spectator.detectChanges = (): void => {
      spectatorDetectChanges.bind(spectator);
      detectChanges$.next();
    };
    return {
      spectator,
      component: spectator.component,
    };
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should exist', () => {
    // Arrange
    const { spectator } = testSetup();

    // Assert
    expect(spectator.component).toExist();
  });

  it('Tab value should be changed when user selects other than default tab', fakeAsync(() => {
    // Arrange
    const { spectator, component } = testSetup({ term: 'test' });
    const spyFn = jest.spyOn(component.state, 'setTab');

    // Act
    expect(component.state.tabIndex).toBe(0);
    spectator.triggerEventHandler('mat-tab-group', 'selectedTabChange', {
      index: 3,
    });
    spectator.tick(400);
    spectator.detectComponentChanges();
    spectator.detectChanges();

    // Assert
    expect(spyFn).toHaveBeenCalledWith({ index: 3 });
  }));

  it('Tab value should be changed when user selects default tab.', fakeAsync(() => {
    // Arrange
    const { spectator, component } = testSetup({ term: 'test', tab: 1 });
    const spyFn = jest.spyOn(component.state, 'setTab');

    // Act
    expect(component.state.tabIndex).toBe(1);
    spectator.triggerEventHandler('mat-tab-group', 'selectedTabChange', {
      index: 0,
    });
    spectator.tick(400);
    spectator.detectComponentChanges();
    spectator.detectChanges();

    // Assert
    expect(spyFn).toHaveBeenCalledWith({ index: 0 });
  }));

  it("All - displays all [entityname] the user is able to see, even if they aren't owners", fakeAsync(() => {
    // Arrange
    const { component, spectator } = testSetup();
    const spyFn = jest.spyOn(component.state, 'setTab');

    // Act
    spectator.triggerEventHandler('mat-tab-group', 'selectedTabChange', {
      index: 0,
    });
    spectator.tick(400);
    spectator.detectComponentChanges();
    spectator.detectChanges();
    const tabs = spectator.queryAll('.mat-tab-label');

    // Assert
    expect(spyFn).toHaveBeenCalledWith({ index: 0 });
    expect(tabs[0]).toHaveText('All');
  }));

  it("Active [entityname] - displays all active  entities the user is able to see, even if they aren't owners", fakeAsync(() => {
    // Arrange
    const { component, spectator } = testSetup();
    const spyFn = jest.spyOn(component.state, 'setTab');

    // Act
    spectator.triggerEventHandler('mat-tab-group', 'selectedTabChange', {
      index: 1,
    });
    spectator.tick(400);
    spectator.detectComponentChanges();
    spectator.detectChanges();
    const tabs = spectator.queryAll('.mat-tab-label');

    // Assert
    expect(spyFn).toHaveBeenCalledWith({ index: 1 });
    expect(tabs[1]).toHaveText('Active');
  }));

  it('Owned by me - displays only active [entityname] that the user is the owner of', fakeAsync(() => {
    // Arrange
    const { component, spectator } = testSetup();
    const spyFn = jest.spyOn(component.state, 'setTab');

    // Act
    spectator.triggerEventHandler('mat-tab-group', 'selectedTabChange', {
      index: 2,
    });
    spectator.tick(400);
    spectator.detectComponentChanges();
    spectator.detectChanges();
    const tabs = spectator.queryAll('.mat-tab-label');

    // Assert
    expect(spyFn).toHaveBeenCalledWith({ index: 2 });
    expect(tabs[2]).toHaveText('Owned by me');
  }));

  it('Shared with me - displays any active [entityname]that the user was made a collaborator of and they do not own', fakeAsync(() => {
    // Arrange
    const { component, spectator } = testSetup();
    const spyFn = jest.spyOn(component.state, 'setTab');

    // Act
    spectator.triggerEventHandler('mat-tab-group', 'selectedTabChange', {
      index: 3,
    });
    spectator.tick(400);
    spectator.detectComponentChanges();
    spectator.detectChanges();
    const tabs = spectator.queryAll('.mat-tab-label');

    // Assert
    expect(spyFn).toHaveBeenCalledWith({ index: 3 });
    expect(tabs[3]).toHaveText('Shared with me');
  }));

  it('Inactive [entityname]- displays any [entityname]the user can view that is in an inactive status', fakeAsync(() => {
    // Arrange
    const { component, spectator } = testSetup();
    const spyFn = jest.spyOn(component.state, 'setTab');

    // Act
    spectator.triggerEventHandler('mat-tab-group', 'selectedTabChange', {
      index: 4,
    });
    spectator.tick(400);
    spectator.detectComponentChanges();
    spectator.detectChanges();
    const tabs = spectator.queryAll('.mat-tab-label');

    // Assert
    expect(spyFn).toHaveBeenCalledWith({ index: 4 });
    expect(tabs[4]).toHaveText('Inactive');
  }));

  it('should set default tab as All when User navigates to the Directory landing page', () => {
    // Arrange
    const { component } = testSetup();

    // Assert
    expect(component.state.tabIndex).toEqual(0);
    expect(component.state.tab.name).toEqual(tabs[0].name);
  });

  // TODO tests if able to solve technical issue.
  // Search text should be retained when user navigates through the tabs.
  // Sort selection should be retained through all tabs when user changes from default sort to another option
});
