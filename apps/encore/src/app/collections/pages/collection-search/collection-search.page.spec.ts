/**
 * Collection unit tests
 * @group collection/unit
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { fakeAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AUTH_SERVICE_CONFIG } from '@asi/auth';
import {
  CosCollectionComponent,
  CosCollectionModule,
} from '@cosmos/components/collection';
import { CosToastService } from '@cosmos/components/notification';
import { AuthFacade } from '@esp/auth';
import { CollectionMockDb } from '@esp/collections/mocks';
import {
  EspSearchPaginationModule,
  SearchPaginationComponent,
  SortOption,
} from '@esp/search';
import { createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { MockComponents } from 'ng-mocks';
import { of, Subject, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
  CollectionCardMenuComponent,
  CollectionCardMenuComponentModule,
} from '../../components/collection-card-menu/collection-card-menu.component';
import { sortOptions } from '../../configs';
import { CollectionsDialogService } from '../../services';
import { CollectionDetailPage } from '../collection-detail';
import { tabs } from './collection-search.config';
import { CollectionSearchLocalState } from './collection-search.local-state';
import {
  CollectionSearchPage,
  CollectionSearchPageModule,
} from './collection-search.page';

const collections = CollectionMockDb.Collections;

describe('CollectionSearchPage', () => {
  const createComponent = createComponentFactory({
    component: CollectionSearchPage,
    imports: [
      HttpClientTestingModule,
      RouterTestingModule.withRoutes([
        {
          path: 'collections',
          component: CollectionSearchPage,
        },
        {
          path: 'collections/:id',
          component: CollectionDetailPage,
        },
      ]),

      NgxsModule.forRoot(),

      CollectionSearchPageModule,
    ],
    providers: [
      mockProvider(CollectionSearchLocalState, {
        connect() {
          return of(this);
        },
        search: () => of(),
      }),
      mockProvider(CosToastService),
      mockProvider(CollectionsDialogService),
      mockProvider(AuthFacade, {
        user: {},
      }),
      { provide: AUTH_SERVICE_CONFIG, useValue: {} },
    ],
    overrideModules: [
      [
        CollectionCardMenuComponentModule,
        {
          set: {
            declarations: MockComponents(CollectionCardMenuComponent),
            exports: MockComponents(CollectionCardMenuComponent),
          },
        },
      ],
      [
        CosCollectionModule,
        {
          set: {
            declarations: MockComponents(CosCollectionComponent),
            exports: MockComponents(CosCollectionComponent),
          },
        },
      ],
      [
        EspSearchPaginationModule,
        {
          set: {
            declarations: MockComponents(SearchPaginationComponent),
            exports: MockComponents(SearchPaginationComponent),
          },
        },
      ],
    ],
  });

  const testSetup = (options?: {
    sort?: SortOption;
    term?: string;
    tab?: number;
  }) => {
    const detectChanges$ = new Subject<void>();
    const sort = options?.sort || sortOptions[0];

    const spectator = createComponent({
      providers: [
        mockProvider(CollectionSearchLocalState, <
          Partial<CollectionSearchLocalState>
        >{
          connect() {
            return detectChanges$.pipe(switchMap(() => of(this)));
          },
          from: 1,
          tabIndex: 0,
          tab: tabs[options?.tab] || tabs[0],
          term: options?.term || '',
          search: jest.fn(() => of()),
          sort,
          isLoading: false,
          hasLoaded: true,
        }),
      ],
    });

    const state = spectator.inject(CollectionSearchLocalState);
    const spectatorDetectChanges = spectator.detectChanges;

    spectator.detectChanges = (): void => {
      spectatorDetectChanges.bind(spectator);
      detectChanges$.next();
    };
    const router = spectator.inject(Router);

    jest.spyOn(router, 'navigate').mockReturnValue(Promise.resolve(true));
    return {
      spectator,
      component: spectator.component,
      state,
      router,
    };
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    const { spectator, component } = testSetup();

    expect(spectator).toBeTruthy();
    expect(component).toBeTruthy();
  });

  describe('Collection operations', () => {
    it('Clicking link redirects user to the Collections Landing page when a new collection is created from Collection Landing page and user lands on collection detail page', fakeAsync(() => {
      // Arrange
      const collection = collections[0];
      const { spectator, component, router } = testSetup();
      const modalService = spectator.inject(CollectionsDialogService);
      const spyFn = jest
        .spyOn(modalService, 'openCreateDialog')
        .mockReturnValue(of(collection));

      //Act
      component.createCollection();
      spectator.tick();

      //Assert
      expect(spyFn).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith([
        '/collections',
        collection.Id,
      ]);
    }));

    it('Clicking Create New Collection button from Collections landing page should display create new collection modal', () => {
      //Arrange
      const { spectator } = testSetup();
      const modalService = spectator.inject(CollectionsDialogService);
      const createNewBtn = spectator.query('.create-collection-btn');
      expect(createNewBtn).toExist();
      expect(createNewBtn.tagName).toBe('BUTTON');
      expect(createNewBtn).toHaveText('Create new Collection');
      const spyFn = jest
        .spyOn(modalService, 'openCreateDialog')
        .mockReturnValue(of(<any>{ test: 'some result' }));

      //Act
      spectator.click(createNewBtn);

      //Assert
      expect(spyFn).toHaveBeenCalled();
    });

    it('User should remain on the collection landing page when user dismisses the create new collection modal', fakeAsync(() => {
      //Arrange
      const { spectator, component, router } = testSetup();
      const modalService = spectator.inject(CollectionsDialogService);
      const spyFn = jest
        .spyOn(modalService, 'openCreateDialog')
        .mockReturnValue(of(null));

      //Act
      component.createCollection();
      spectator.tick();

      //Assert
      expect(spyFn).toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
    }));

    it('User should remain on the collection landing page when collection is not created for some reason', fakeAsync(() => {
      //Arrange
      const { spectator, component, router } = testSetup();
      const modalService = spectator.inject(CollectionsDialogService);
      const spyFn = jest
        .spyOn(modalService, 'openCreateDialog')
        .mockReturnValue(throwError(() => new Error('test')));

      //Act
      component.createCollection();
      spectator.tick();

      //Assert
      expect(spyFn).toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
    }));
  });

  describe('Sort by options', () => {
    it('should be available on collection Landing page: 1- Last Updated Date, 2- Oldest, 3- Newest, 4- Name a-Z, 5-Name Z-A', fakeAsync(() => {
      //Arrange
      const { spectator } = testSetup();

      const matMenuElement = spectator.query('.mat-menu-trigger');
      //Act
      spectator.click(matMenuElement);
      spectator.tick(400);
      //Asert
      const menuContents = spectator.queryAll('.mat-menu-item');
      expect(menuContents[0].textContent).toContain('Last Updated');
      expect(menuContents[1].textContent).toContain('Oldest');
      expect(menuContents[2].textContent).toContain('Newest');
      expect(menuContents[3].textContent).toContain('Name A-Z');
      expect(menuContents[4].textContent).toContain('Name Z-A');
    }));

    it('Last Update Date should be the default sort on collections landing page. ', fakeAsync(() => {
      //Arrange
      const { spectator } = testSetup();

      const matMenuElement = spectator.query('.mat-menu-trigger');
      //Act
      spectator.click(matMenuElement);
      spectator.tick(400);
      //Assert
      const menuContents = spectator.queryAll('.mat-menu-item');
      expect(menuContents[0].textContent).toContain('Last Updated');
    }));

    it('No collections found text should be displayed when user enters a search term that results in no collections', fakeAsync(() => {
      //Arrange
      const { spectator, component } = testSetup();

      const collectionSearchInput =
        spectator.query('.cos-search-field').children[1];
      //Act
      spectator.typeInElement('hello', collectionSearchInput);
      spectator.tick(400);
      component.state.collections = [];
      spectator.tick(400);
      spectator.detectComponentChanges();
      //Assert
      const emptyMessageEl = spectator.query('.empty-results-msg');
      expect(emptyMessageEl).toExist();
      expect(emptyMessageEl).toContainText('No collections found.');
    }));
  });

  describe('Tabs', () => {
    it('All Collections, Owned By me and Archive tabs should be available on Collections Landing page.', () => {
      //Arrange
      const { spectator } = testSetup();
      //Act
      const matMenuTabs = spectator.queryAll('.mat-tab-label');
      //Assert
      expect(matMenuTabs.length).toEqual(4);
      expect(matMenuTabs[0]).toContainText('All Collections');
      expect(matMenuTabs[1]).toContainText('Owned by me');
      expect(matMenuTabs[2]).toContainText('Shared with me');
      expect(matMenuTabs[3]).toContainText('Archived');
    });
  });
});
