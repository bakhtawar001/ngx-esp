import { CommonModule } from '@angular/common';
import { fakeAsync } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material/menu';
import { CosButtonModule } from '@cosmos/components/button';
import type { SortOption } from '../../types';
import { createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { of, Subject } from 'rxjs';
import { SearchLocalState, SEARCH_LOCAL_STATE } from '../../local-states';
import { SearchSortComponent } from './search-sort.component';

const sortOptions: SortOption[] = [
  {
    name: 'Recently Added',
    value: 'newest',
  },
  {
    name: 'Oldest',
    value: 'oldest',
  },
  {
    name: 'Category',
    value: 'category',
  },
  {
    name: 'Name A-Z',
    value: 'az',
  },
  {
    name: 'Name Z-A',
    value: 'za',
  },
  {
    name: 'By Price - Low to High',
    value: 'priceAsc',
  },
  {
    name: 'By Price - High to Low',
    value: 'priceDesc',
  },
];

export const productSortOptions: SortOption[] = [
  {
    name: 'Recently Added',
    value: 'newest',
  },
  {
    name: 'Oldest',
    value: 'oldest',
  },
  {
    name: 'Category',
    value: 'category',
  },
  {
    name: 'Name A-Z',
    value: 'az',
  },
  {
    name: 'Name Z-A',
    value: 'za',
  },
  {
    name: 'By Price - Low to High',
    value: 'priceAsc',
  },
  {
    name: 'By Price - High to Low',
    value: 'priceDesc',
  },
];

describe('SearchSortComponent', () => {
  const createComponent = createComponentFactory({
    component: SearchSortComponent,
    imports: [CommonModule, MatMenuModule, CosButtonModule],
    providers: [
      mockProvider(SearchLocalState, {
        connect() {
          return of(this);
        },
        search: () => of(),
      }),
    ],
  });

  const testSetup = (options?: { sort?: SortOption; term?: string }) => {
    const detectChanges$ = new Subject<void>();

    const spectator = createComponent({
      props: { options: sortOptions },
      providers: [
        {
          provide: SEARCH_LOCAL_STATE,
          useValue: <Partial<SearchLocalState>>{
            connect() {
              return of(this);
            },
            search: () => of(),
            from: 0,
            term: options?.term || '',
            sort: options?.sort || sortOptions[0],
            tabIndex: 0,
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

  it("Following sort options should be available at the collection Detail page. 'Recently Added', 'Oldest', 'Name A-Z', 'Name Z-A','By category','By Price - Low to High', 'By Price - High to Low'", fakeAsync(() => {
    // Arrange
    const { spectator, component } = testSetup();
    const menuTriggerBtn = spectator.query('.search-sort-button');

    // Act
    spectator.setInput('options', productSortOptions);
    spectator.click(menuTriggerBtn);
    spectator.tick(400);
    const menuContents = spectator.queryAll('.mat-menu-item');

    // Assert
    expect(menuContents[0].textContent).toContain('Recently Added');
    expect(menuContents[1].textContent).toContain('Oldest');
    expect(menuContents[2].textContent).toContain('Category');
    expect(menuContents[3].textContent).toContain('Name A-Z');
    expect(menuContents[4].textContent).toContain('Name Z-A');
    expect(menuContents[5].textContent).toContain('By Price - Low to High');
    expect(menuContents[6].textContent).toContain('By Price - High to Low');
  }));

  it('Search text should be retained when user changes the sort order.', fakeAsync(() => {
    //Arrange
    const { spectator, component } = testSetup({
      sort: sortOptions[1],
      term: 'test',
    });
    //Assert
    expect(component.state.sort).toBe(sortOptions[1]);

    //Act
    component.setSort(spectator.component.options[2]);
    spectator.tick(400);
    //Assert
    expect(component.state.sort).toBe(sortOptions[2]);
    expect(component.state.term).toBe('test');
  }));
});
