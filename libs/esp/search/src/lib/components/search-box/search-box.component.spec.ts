import { CommonModule } from '@angular/common';
import { fakeAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CosButtonModule } from '@cosmos/components/button';
import { CosInputModule } from '@cosmos/components/input';
import type { TabFilter, SortOption } from '../../types';
import { createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { of, Subject } from 'rxjs';
import { SearchLocalState, SEARCH_LOCAL_STATE } from '../../local-states';
import { SearchBoxComponent } from './search-box.component';

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

export const tabs: TabFilter[] = [
  { name: 'All Collections', criteria: { status: 'active', type: 'default' } },
  { name: 'Owned by me', criteria: { status: 'active', type: 'me' } },
  { name: 'Shared with me', criteria: { status: 'active', type: 'shared' } },
  { name: 'Archived', criteria: { status: 'archived', type: null } },
];

describe('SearchBoxComponent', () => {
  const createComponent = createComponentFactory({
    component: SearchBoxComponent,
    imports: [
      CommonModule,
      ReactiveFormsModule,
      CosButtonModule,
      CosInputModule,
    ],
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
      providers: [
        {
          provide: SEARCH_LOCAL_STATE,
          useValue: {
            connect() {
              return of(this);
            },
            search: () => of(),
            from: 0,
            sort: options?.sort || sortOptions[0],
            term: options?.term || '',
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
    const { spectator } = testSetup();
    expect(spectator.component).toExist();
  });

  it("Search box should be displayed with Magnifyer icon and with default 'Search' watermark.", () => {
    //Arrange
    const { spectator, component } = testSetup();

    // Assert
    expect(spectator.query('.form-field-prefix > .fa-search')).toBeTruthy();
    expect(spectator.query('.cos-search-field').children[1]).toHaveAttribute(
      'placeholder',
      'Search'
    );
  });
  it('Search box watermark should be updated when the placeholder is updated', () => {
    //Arrange
    const { spectator, component } = testSetup();
    spectator.setInput('placeholder', 'Search Collections');
    //Assert
    expect(spectator.query('.cos-search-field').children[1]).toHaveAttribute(
      'placeholder',
      'Search Collections'
    );
  });
  it('User should be able to type in the search box.', fakeAsync(() => {
    //Arrange
    const { spectator, component } = testSetup();
    const searchTerm = 'search collection';
    const collectionSearchInput =
      spectator.query('.cos-search-field').children[1];
    //Act
    spectator.typeInElement(searchTerm, collectionSearchInput);
    spectator.tick(400);
    //Assert
    expect(component.state.term).toBe(searchTerm);
  }));

  it('User should be able to filter when single character is typed in', fakeAsync(() => {
    //Arrange
    const { spectator, component } = testSetup();
    const searchTerm = 'a';
    const collectionSearchInput =
      spectator.query('.cos-search-field').children[1];
    //Act
    spectator.typeInElement(searchTerm, collectionSearchInput);
    spectator.tick(400);
    //Assert
    expect(component.state.term).toBe(searchTerm);
  }));

  it('User should be able to filter when multiple characters are typed in.', fakeAsync(() => {
    //Arrange
    const { spectator, component } = testSetup();

    const collectionSearchInput =
      spectator.query('.cos-search-field').children[1];
    const searchTerm = 'test';
    //Act
    spectator.typeInElement(searchTerm, collectionSearchInput);
    spectator.tick(400);
    //Assert
    expect(component.state.term).toBe(searchTerm);
  }));

  it('User should be able to filter when multiple words are typed in.', fakeAsync(() => {
    //Arrange
    const { spectator, component } = testSetup();

    const collectionSearchInput =
      spectator.query('.cos-search-field').children[1];
    const searchTerm = 'test multiple words';
    //Act
    spectator.typeInElement(searchTerm, collectionSearchInput);
    spectator.tick(400);
    //Assert
    expect(component.state.term).toBe(searchTerm);
  }));

  it('User should be able to filter when user types in alpha characters', fakeAsync(() => {
    // Arrange
    const { spectator, component } = testSetup();

    const collectionSearchInput =
      spectator.query('.cos-search-field').children[1];

    const searchTerm = 'abcdef';
    //Act
    spectator.typeInElement(searchTerm, collectionSearchInput);
    spectator.tick(400);
    //Assert
    expect(component.state.term).toBe(searchTerm);
  }));

  it('User should be able to filter when user types in special characters', fakeAsync(() => {
    // Arrange
    const { spectator, component } = testSetup();

    const collectionSearchInput =
      spectator.query('.cos-search-field').children[1];

    const searchTerm = '$#';
    //Act
    spectator.typeInElement(searchTerm, collectionSearchInput);
    spectator.tick(400);
    //Assert
    expect(component.state.term).toBe(searchTerm);
  }));

  it('User should be able to filter when user types in the numeric characters e.g. dates etc.', fakeAsync(() => {
    //Arrange
    const { spectator, component } = testSetup();
    const collectionSearchInput =
      spectator.query('.cos-search-field').children[1];
    const searchTerm = '17/03/2021';
    //Act
    spectator.typeInElement('17/03/2021', collectionSearchInput);
    spectator.tick(400);
    //Assert
    expect(component.state.term).toBe(searchTerm);
  }));

  it('User should be able to filter when user types in the combination of alpha and numeric characters', fakeAsync(() => {
    //Arrange
    const { spectator, component } = testSetup();
    const collectionSearchInput =
      spectator.query('.cos-search-field').children[1];
    const searchTerm = 'test123';
    //Act
    spectator.typeInElement('test123', collectionSearchInput);
    spectator.tick(400);
    //Assert
    expect(component.state.term).toBe(searchTerm);
  }));

  it('Removing text from the search field should update the filter.', fakeAsync(() => {
    //Arrange
    const { spectator, component } = testSetup({ term: 'test' });

    const collectionSearchInput =
      spectator.query('.cos-search-field').children[1];

    //Assert
    expect(component.state.term).toBe('test');
    //Act
    spectator.typeInElement('', collectionSearchInput);
    spectator.tick(400);
    //Assert
    expect(component.state.term).toBe('');
  }));

  it('Sort selection should be retained when user performs a new search when user changes from default sort to another option.', fakeAsync(() => {
    //Arrange
    const { spectator, component } = testSetup({
      sort: sortOptions[1],
      term: 'test',
    });
    //Assert
    expect(component.state.term).toBe('test');
    //Act
    const collectionSearchInput =
      spectator.query('.cos-search-field').children[1];
    spectator.typeInElement('search collection', collectionSearchInput);
    spectator.tick(400);
    //Assert
    expect(component.state.term).toBe('search collection');
    expect(component.state.sort).toBe(sortOptions[1]);
  }));

  it('Tab selection should be retained when user is on a tab other than default and performs a search', fakeAsync(() => {
    //Arrange
    const { spectator, component } = testSetup({ tab: 1 });
    //Assert
    expect(component.state.tab).toBe(tabs[1]);

    //Act
    const collectionSearchInput =
      spectator.query('.cos-search-field').children[1];
    spectator.typeInElement('search collection', collectionSearchInput);
    spectator.tick(400);

    //Assert
    expect(component.state.tab).toBe(tabs[1]);
    expect(component.state.term).toBe('search collection');
  }));
});
