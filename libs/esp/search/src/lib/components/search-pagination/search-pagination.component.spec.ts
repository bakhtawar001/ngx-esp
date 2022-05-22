import { createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import {
  SEARCH_LOCAL_STATE,
  SearchLocalState,
  SearchPaginationComponent,
  SearchSortComponent,
} from '@esp/search';
import { CommonModule } from '@angular/common';
import { of, Subject } from 'rxjs';
import {
  CosPaginationComponent,
  CosPaginationModule,
} from '@cosmos/components/pagination';
import { PageEvent } from '@angular/material/paginator/paginator';

const searchDataMock: Partial<SearchLocalState> = {
  total: 103,
  criteria: {
    size: 50,
    from: 0,
  },
};

describe('SearchSortComponent', () => {
  const createComponent = createComponentFactory({
    component: SearchPaginationComponent,
    imports: [CommonModule, CosPaginationModule],
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
    total?: number;
    criteria?: { size?: number; from?: number };
  }) => {
    const spectator = createComponent({
      providers: [
        {
          provide: SEARCH_LOCAL_STATE,
          useValue: <Partial<SearchLocalState>>{
            connect() {
              return of(this);
            },
            search: () => of(),
            total: options?.total ?? 0,
            criteria: options?.criteria ?? { from: 0, size: 0 },
            from: options?.criteria?.from ?? 0,
          },
        },
      ],
    });

    return {
      spectator,
      component: spectator.component,
      state: spectator.inject(SearchLocalState, true),
    };
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should exist', () => {
    const { spectator } = testSetup();
    expect(spectator.component).toExist();
  });

  it('should generate pagination correctly', () => {
    const { spectator } = testSetup(searchDataMock);
    const pagination = spectator.query(CosPaginationComponent);

    expect(pagination.pages[0].length).toEqual(3);
    expect(pagination.pageSize).toEqual(50);
    expect(pagination.length).toEqual(103);
    expect(pagination.pageIndex).toEqual(0);
    expect(pagination.maxPageNumbers).toEqual(3);
  });

  it('should change page on pageChange call', () => {
    const { spectator, component } = testSetup(searchDataMock);
    const pagination = spectator.query(CosPaginationComponent);
    const pageEventMock: PageEvent = {
      pageSize: searchDataMock.criteria.size,
      pageIndex: 1,
      previousPageIndex: searchDataMock.criteria.from,
      length: searchDataMock.total,
    };
    component.pageChange(pageEventMock);

    expect(pagination.currentPage).toEqual(1);
  });
});
