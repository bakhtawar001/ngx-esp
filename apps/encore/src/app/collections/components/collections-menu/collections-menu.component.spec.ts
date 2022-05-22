/**
 * Collection unit tests
 * @group collection/unit
 */
import { AnimationEvent } from '@angular/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { fakeAsync } from '@angular/core/testing';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AUTH_SERVICE_CONFIG } from '@asi/auth';
import {
  CosEmojiMenuComponent,
  CosEmojiMenuModule,
} from '@cosmos/components/emoji-menu';
import { CosToastService } from '@cosmos/components/notification';
import { AuthFacade } from '@esp/auth';
import {
  CollectionsService,
  EspCollectionsModule,
  RecentCollectionsStateModel,
} from '@esp/collections';
import { CollectionSearchMockDb } from '@esp/collections/mocks';
import { createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { NgxsModule, Store } from '@ngxs/store';
import { MockComponents } from 'ng-mocks';
import { BehaviorSubject, of } from 'rxjs';
import { CollectionDetailPage } from '../../pages/collection-detail/collection-detail.page';
import { CollectionSearchPage } from '../../pages/collection-search/collection-search.page';
import { CollectionsDialogService } from '../../services';
import {
  CollectionsMenuComponent,
  CollectionsMenuComponentModule,
} from './collections-menu.component';

const collections = CollectionSearchMockDb.CollectionSearch.slice(0, 5);

describe('CollectionsMenuComponent', () => {
  const mockMatMenu = (component: CollectionsMenuComponent) => {
    component.menu = {
      _animationDone: new BehaviorSubject(<AnimationEvent>{
        toState: 'enter',
      }),
    } as unknown as MatMenu;
  };

  const createComponent = createComponentFactory({
    component: CollectionsMenuComponent,
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
      EspCollectionsModule.forRoot(),

      CollectionsMenuComponentModule,
    ],
    overrideModules: [
      [
        MatMenuModule,
        {
          set: {
            declarations: MockComponents(MatMenu),
            exports: MockComponents(MatMenu),
          },
        },
      ],
      [
        CosEmojiMenuModule,
        {
          set: {
            declarations: MockComponents(CosEmojiMenuComponent),
            exports: MockComponents(CosEmojiMenuComponent),
          },
        },
      ],
    ],
    providers: [
      mockProvider(CollectionsDialogService),
      mockProvider(CosToastService),
      mockProvider(AuthFacade, {
        user: {},
        profile$: of(null),
      }),
      { provide: AUTH_SERVICE_CONFIG, useValue: {} },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    detectChanges: false,
  });

  const testSetup = (value?: Partial<RecentCollectionsStateModel>) => {
    const spectator = createComponent();
    mockMatMenu(spectator.component);
    const store = spectator.inject(Store);
    const state = store.snapshot();

    store.reset({
      ...state,
      recentCollections: {
        ...state.recentCollections,
        ...value,
      },
    });

    spectator.detectComponentChanges();

    return { spectator, component: spectator.component };
  };

  it('should create', () => {
    const { component } = testSetup();

    expect(component).toBeTruthy();
  });

  it("Recents menu should be displayed with text 'You don't have any collections that you can add to yet.', 'Create New collection' and 'All collection' options when there are no collections in the system.", () => {
    const { spectator } = testSetup();

    expect(spectator.query('.no-collections')).toHaveText(
      "You don't have any Collections that you can add to yet"
    );
  });

  it("Text 'No collections found. Try changing the search term.' displayed with 'Create New Collection' button when search criteria does not result in any collection.", fakeAsync(() => {
    const { spectator } = testSetup({ items: collections });
    const collectionsService = spectator.inject(CollectionsService);

    jest
      .spyOn(collectionsService, 'query')
      .mockReturnValue(of({ Results: [] }));

    const collectionSearchInput = spectator.query('.collection-search-input');

    expect(collectionSearchInput).toExist();

    spectator.typeInElement('test', collectionSearchInput);
    spectator.tick(400);

    expect(spectator.query('.no-collections-in-search')).toHaveText(
      'No collections found. Try changing the search term.'
    );
    expect(spectator.query('.create-collection-btn')).toBeTruthy();
  }));

  it("'X' button should appear on the right corner upon entering the text in the search box", fakeAsync(() => {
    const { spectator } = testSetup({ items: collections });
    const collectionsService = spectator.inject(CollectionsService);

    const searchSpyFn = jest
      .spyOn(collectionsService, 'query')
      .mockReturnValue(of({ Results: [] }));

    let closeButton = spectator.query('.form-field-suffix');
    expect(closeButton).toHaveAttribute('hidden');
    const collectionSearchInput = spectator.query('.collection-search-input');
    spectator.typeInElement('search collection', collectionSearchInput);
    spectator.tick(400);
    expect(searchSpyFn).toHaveBeenCalledWith(
      spectator.component.state.form.value
    );
    closeButton = spectator.query('.form-field-suffix');
    expect(closeButton).toExist();
    const closeIcon = spectator.query('.form-field-suffix > i');
    expect(closeIcon).toHaveClass('fa fa-times');
  }));

  it("Clicking 'X' button should empty the search field and should display the watermark", fakeAsync(() => {
    const { spectator, component } = testSetup({ items: collections });
    const collectionsService = spectator.inject(CollectionsService);
    const searchSpyFn = jest
      .spyOn(collectionsService, 'query')
      .mockReturnValue(of({ Results: collections }));

    const collectionSearchInput = spectator.query('.collection-search-input');

    spectator.typeInElement('search collection', collectionSearchInput);
    spectator.tick(400);
    expect(searchSpyFn).toHaveBeenCalledWith(
      spectator.component.state.form.value
    );
    const closeButton = spectator.query('.form-field-suffix');
    spectator.click(closeButton);
    spectator.tick(400);

    expect(component.state.searchTerm).toEqual('');
    const searchBox = spectator.query('.collection-search-input');
    expect(searchBox.getAttribute('placeholder')).toEqual('Search Collections');
  }));

  it('Recent Collection title should be hidden when user starts entering text in the search field', fakeAsync(() => {
    const { spectator } = testSetup({ items: collections });
    const collectionsService = spectator.inject(CollectionsService);
    const searchSpyFn = jest
      .spyOn(collectionsService, 'query')
      .mockReturnValue(of({ Results: [] }));

    let recentColheading = spectator.query('.recent-col-heading');
    expect(recentColheading).toHaveText('Recent Collections');
    const collectionSearchInput = spectator.query('.collection-search-input');
    spectator.typeInElement('search collection', collectionSearchInput);
    spectator.tick(400);

    expect(searchSpyFn).toHaveBeenCalledWith(
      spectator.component.state.form.value
    );
    recentColheading = spectator.query('.recent-col-heading');
    expect(recentColheading).not.toExist();
  }));

  it("Recent collection menu should be displayed with Search box having watermark as 'Search Collections'.", () => {
    const { spectator } = testSetup({ items: collections });

    expect(spectator.query('.collections-menu')).toExist();
    const searchBox = spectator.query('.collection-search-input');
    expect(searchBox).toExist();
    expect(searchBox.getAttribute('placeholder')).toEqual('Search Collections');
    const searchIcon = spectator.query('.fa-search');
    expect(searchIcon).toExist();
    expect(searchIcon.tagName).toEqual('I');
  });

  it('Recent Collection text should be displayed under the search field', () => {
    const { spectator } = testSetup({ items: collections });

    const recentmenuHead = spectator.query(
      '.collections-menu h5.recent-col-heading '
    );
    expect(recentmenuHead).toExist();
    expect(recentmenuHead).toHaveText('Recent Collections');
  });

  it('Collections should be displayed with Collection Icon, Collection Name followed by Number of products', () => {
    const { spectator, component } = testSetup({ items: collections });

    const listItems = spectator.queryAll('.global-menu-list-item');
    expect(component.state.collections.length).toEqual(listItems.length);

    const collectionEmoji = listItems[0].querySelector(
      '.global-menu-list-item__emoji'
    );
    expect(collectionEmoji).toExist();

    const collectionInfo = listItems[0].querySelector(
      '.global-menu-list-item__content'
    );
    expect(collectionInfo).toExist();

    const collectionName = collectionInfo.querySelector('.collection-name');
    expect(collectionName).toExist();
    expect(collectionName).toHaveText(component.state.collections[0].Name);

    const collectionLength = collectionInfo.querySelector('p');
    expect(collectionLength).toHaveText(
      `${component.state.collections[0].Products.length} products`
    );
  });

  it("'Create new Collection' option should not be available when there is at least 1 collection displayed on the 'recents' menu", () => {
    const { spectator } = testSetup();

    const createCollectionBtn = spectator.query('.create-collection-btn');

    expect(createCollectionBtn).toExist();
    expect(createCollectionBtn).toHaveText('Create new Collection');
  });

  it('should focus the "Create new Collection" button when the menu is opened', () => {
    const { spectator } = testSetup();
    spectator.detectChanges();
    const createCollectionBtn = spectator.query('.create-collection-btn');
    expect(document.activeElement).toBe(createCollectionBtn);
  });

  it('Create new collection option should not be available when there is at least 1 collection displayed on the recent menu', () => {
    testSetup({ items: collections });

    expect('.create-collection-btn').not.toExist();
  });

  it("Recent menu should be displayed with 'All Collections' link when there are less than 5 collections on the menu", () => {
    const { spectator } = testSetup({ items: collections });
    const heading = spectator.query('.recent-col-heading');
    expect(heading).toExist();
    expect(heading).toContainText('Recent Collections');
    const collectionsLink = spectator.query('.all-collections-link');
    expect(collectionsLink).toExist();
    expect(collectionsLink).toHaveText('All Collections');
    expect(collectionsLink.tagName).toBe('A');
  });

  it("Clicking on 'All Collections' link should take user to the collections landing page on same tab", () => {
    const { spectator } = testSetup({ items: collections });

    const router = spectator.inject(Router);

    jest.spyOn(router, 'navigate').mockReturnValue(Promise.resolve(true));

    const allCollectionsLink = spectator.query('.all-collections-link');
    expect(allCollectionsLink.getAttribute('href')).toEqual('/collections');
    spectator.click(allCollectionsLink);
    router.navigate([allCollectionsLink.getAttribute('href')]);
    expect(router.navigate).toHaveBeenCalledWith(['/collections']);
  });

  it('Clicking on Collection should take user to the collections detail page on same tab', () => {
    const { spectator, component } = testSetup({ items: collections });

    const router = spectator.inject(Router);
    jest.spyOn(router, 'navigate').mockReturnValue(Promise.resolve(true));

    const collectionItemLink = spectator.query('.global-menu-list-item');
    expect(collectionItemLink.getAttribute('href')).toEqual(
      `/collections/${component.state.collections[0].Id}`
    );
    spectator.click(collectionItemLink);
    router.navigate([collectionItemLink.getAttribute('href')]);
    expect(router.navigate).toHaveBeenCalledWith([
      `/collections/${component.state.collections[0].Id}`,
    ]);
  });

  describe('Collections Menu search operations', () => {
    it('should be able search collections when multiple words are typed in the Search text box', fakeAsync(() => {
      const { spectator, component } = testSetup({ items: collections });
      const collectionsService = spectator.inject(CollectionsService);
      const searchSpyFn = jest
        .spyOn(collectionsService, 'query')
        .mockReturnValue(of({ Results: [] }));

      const collectionSearchInput = spectator.query('.collection-search-input');
      spectator.typeInElement('search collection', collectionSearchInput);
      spectator.tick(400);
      expect(searchSpyFn).toHaveBeenCalledWith(component.state.form.value);
    }));

    it('should be able to search the collections with special characters', fakeAsync(() => {
      const { spectator, component } = testSetup({ items: collections });
      const collectionsService = spectator.inject(CollectionsService);
      const searchSpyFn = jest
        .spyOn(collectionsService, 'query')
        .mockReturnValue(of({ Results: [] }));

      const collectionSearchInput = spectator.query('.collection-search-input');

      spectator.typeInElement('$#', collectionSearchInput);
      spectator.tick(400);
      expect(searchSpyFn).toHaveBeenCalledWith(component.state.form.value);
    }));

    it('should be able to search the collections with numeric characters', fakeAsync(() => {
      const { spectator, component } = testSetup({ items: collections });
      const collectionsService = spectator.inject(CollectionsService);
      const searchSpyFn = jest
        .spyOn(collectionsService, 'query')
        .mockReturnValue(of({ Results: [] }));

      const collectionSearchInput = spectator.query('.collection-search-input');

      spectator.typeInElement('123', collectionSearchInput);
      spectator.tick(400);

      expect(searchSpyFn).toHaveBeenCalledWith(component.state.form.value);
    }));

    it('should be able to search the collections with alpha numeric and special characters', fakeAsync(() => {
      const { spectator, component } = testSetup({ items: collections });
      const collectionsService = spectator.inject(CollectionsService);
      const searchSpyFn = jest
        .spyOn(collectionsService, 'query')
        .mockReturnValue(of({ Results: [] }));

      const collectionSearchInput = spectator.query('.collection-search-input');

      spectator.typeInElement('test123@COL', collectionSearchInput);
      spectator.tick(400);

      expect(searchSpyFn).toHaveBeenCalledWith(component.state.form.value);
    }));
  });
});
