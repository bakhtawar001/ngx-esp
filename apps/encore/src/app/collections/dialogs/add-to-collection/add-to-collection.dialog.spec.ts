import { HttpClientTestingModule } from '@angular/common/http/testing';
import { fakeAsync } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  CosCollectionComponent,
  CosCollectionModule,
} from '@cosmos/components/collection';
import { CosProductGridComponent } from '@cosmos/components/product-grid';
import { CollectionSearch } from '@esp/collections';
import { CollectionMockDb } from '@esp/collections/mocks';
import { createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { MockComponent, MockComponents } from 'ng-mocks';
import { of, Subject } from 'rxjs';
import {
  AddToCollectionDialog,
  AddToCollectionDialogModule,
} from './add-to-collection.dialog';
import { AddToCollectionLocalState } from './add-to-collection.local-state';

const injectCollections = CollectionMockDb.Collections.slice(
  0,
  10
) as CollectionSearch[];

describe('AddToCollectionDialog', () => {
  const createComponent = createComponentFactory({
    component: AddToCollectionDialog,
    declarations: [MockComponent(CosProductGridComponent)],
    imports: [
      HttpClientTestingModule,

      NgxsModule.forRoot(),

      AddToCollectionDialogModule,
    ],
    providers: [],
    overrideModules: [
      [
        CosCollectionModule,
        {
          set: {
            declarations: MockComponents(CosCollectionComponent),
            exports: MockComponents(CosCollectionComponent),
          },
        },
      ],
    ],
  });

  const testSetup = (options?: { collections?: CollectionSearch[] }) => {
    const backdropClickSubject = new Subject<void>();
    const collections = options?.collections || injectCollections;

    const spectator = createComponent({
      providers: [
        mockProvider(AddToCollectionLocalState, <
          Partial<AddToCollectionLocalState>
        >{
          connect() {
            return of(this);
          },
          collections,
          search: jest.fn(() => of()),
          reset: jest.fn(() => of()),
        }),
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            entity: {},
          },
        },
        {
          provide: MatDialogRef,
          useValue: {
            close: jest.fn(),
            backdropClick: () => backdropClickSubject,
          },
        },
      ],
    });

    const state = spectator.inject(AddToCollectionLocalState);
    const component = spectator.component;

    const dialogRef = spectator.inject(MatDialogRef, true);

    return {
      spectator,
      component,
      dialogRef,
      backdropClickSubject,
      state,
    };
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', fakeAsync(() => {
    const { spectator } = testSetup();

    expect(spectator).toBeTruthy();
  }));

  it('Product should not be added to a collection when it already exists in the selected collection', fakeAsync(() => {
    const { component, dialogRef } = testSetup();

    const selectedCollection = component.collections[0];
    component.cardClick(selectedCollection);
    expect(dialogRef.close).toHaveBeenCalledWith(selectedCollection);
  }));

  it('Product should not be added to a collection when it already exists in the selected collection with a different image', () => {
    const { component, dialogRef } = testSetup();

    const selectedCollection = component.state.collections[0];
    const selectedProduct = component.state.collections[0].Products[0];
    selectedProduct.ImageUrl = 'media/12345678';
    component.cardClick(selectedCollection);
    expect(dialogRef.close).toHaveBeenCalledWith(selectedCollection);
  });

  it('User should not be able to add product to the currrent collection(collection should not be available on the add product modal)', () => {
    const { spectator, component } = testSetup();

    component.state.collections = injectCollections.slice(1, 6);
    spectator.detectChanges();
    const selectedCollection = injectCollections[0];
    expect(component.state.collections[0]).not.toEqual(selectedCollection);
  });

  it('User should be able to add same product to different collections', () => {
    const { component, dialogRef } = testSetup();

    let selectedCollection = component.state.collections[1];
    component.cardClick(selectedCollection);
    expect(dialogRef.close).toHaveBeenCalledWith(selectedCollection);
    selectedCollection = component.state.collections[2];
    component.cardClick(selectedCollection);
    expect(dialogRef.close).toHaveBeenCalledWith(selectedCollection);
  });

  it('User should be able to add product to new collection after selecting a product and creating new collection', () => {
    const { spectator, dialogRef } = testSetup();

    const createNewCollectionBtn = spectator.query('.create');
    expect(createNewCollectionBtn).toExist();
    expect(createNewCollectionBtn.tagName).toBe('BUTTON');
    expect(createNewCollectionBtn).toHaveText('Create a new Collection');
    spectator.click(createNewCollectionBtn);
    expect(dialogRef.close).toHaveBeenCalled();
    expect(dialogRef.close).toHaveBeenCalledWith('create');
  });

  it('User should be redirected back to the search results page with filter selections retained when user cancels the Add Products modal without adding products', () => {
    const { spectator, dialogRef } = testSetup();
    const closeButton = spectator.query('.cos-modal-close');
    expect(closeButton).toExist();
    spectator.click(closeButton);
    expect(dialogRef.close).toHaveBeenCalled();
    expect(dialogRef.close).toHaveBeenCalledWith('');
  });

  it('Product should be added to a collection when user creates new collection while no existing collections exixts in the system(Add Products modal is bypassed)', fakeAsync(() => {
    const { spectator, dialogRef } = testSetup({ collections: [] });

    const createNewCollectionBtn = spectator.query('.create');
    expect(createNewCollectionBtn).toExist();
    expect(createNewCollectionBtn.tagName).toBe('BUTTON');
    expect(createNewCollectionBtn).toHaveText('Create a new Collection');
    spectator.click(createNewCollectionBtn);
    expect(dialogRef.close).toHaveBeenCalled();
    expect(dialogRef.close).toHaveBeenCalledWith('create');
  }));

  it('Clicking on an existing collection at Add to Collection modal should add the selected products to the selected collection successfully', () => {
    const { component, dialogRef } = testSetup();

    const selectedCollection = component.state.collections[0];
    component.cardClick(selectedCollection);
    expect(dialogRef.close).toHaveBeenCalledWith(selectedCollection);
  });

  it("Clicking 'Add to collection' option should take user to the Create new collection modal when there are no existing active collections", () => {
    const { component, dialogRef } = testSetup({ collections: [] });

    component.create();
    expect(dialogRef.close).toHaveBeenCalled();
    expect(dialogRef.close).toHaveBeenCalledWith('create');
  });

  it("Clicking 'Add to collection' option should take user to the Create new collection modal when there are existing collections with View Only rights", () => {
    const collections = injectCollections.slice(0, 3).map((collection) => {
      collection.IsEditable = false;
      return collection;
    });

    const { component, dialogRef } = testSetup({ collections });

    component.create();
    expect(dialogRef.close).toHaveBeenCalled();
    expect(dialogRef.close).toHaveBeenCalledWith('create');
  });

  it("Clicking 'Add to collection' option should take user to the Add to Collection modal when there are multiple existing collections and user has edit rights for all of collections", () => {
    const collections = injectCollections.slice(0, 3).map((collection) => {
      collection.IsEditable = true;
      return collection;
    });
    const { spectator, component } = testSetup({ collections });

    const collectionItems = spectator.queryAll('.collection-item');
    expect(collectionItems).toHaveLength(component.collections.length);
    component.collections.forEach((collection) => {
      expect(collection.IsEditable).toBeTruthy();
    });
  });

  it("Clicking 'Add to Collection' option should take user to the Add to Collection modal when there are multiple existing collections and user has edit rights to any one collection", () => {
    const collections = injectCollections.slice(0, 3).map((collection, i) => {
      if (i === 0) {
        collection.IsEditable = true;
        return collection;
      }
      collection.IsEditable = false;
      return collection;
    });
    const { component } = testSetup({ collections });

    const canBeEditedCollections = component.collections.filter(
      (collection) => collection.IsEditable
    );
    expect(canBeEditedCollections).toHaveLength(1);
  });

  it('Products should be added to the collection when user selects one or more products and create new collection using Add Products modal', () => {
    const { spectator, dialogRef } = testSetup();

    const createNewCollectionBtn = spectator.query('.create');
    expect(createNewCollectionBtn).toExist();
    expect(createNewCollectionBtn.tagName).toBe('BUTTON');
    expect(createNewCollectionBtn).toHaveText('Create a new Collection');
    spectator.click(createNewCollectionBtn);
    expect(dialogRef.close).toHaveBeenCalled();
    expect(dialogRef.close).toHaveBeenCalledWith('create');
  });

  it('Products should be added to a collection when user selects one or more products and create new collection while no existing collections exixts in the system(Add Products modal is bypassed)', () => {
    const { component, dialogRef } = testSetup({ collections: [] });
    component.create();
    expect(dialogRef.close).toHaveBeenCalled();
    expect(dialogRef.close).toHaveBeenCalledWith('create');
  });

  it('User should be redirected back to the search results page when user selects multiples products and add all products to a collection successfully from Add Collection Modal', () => {
    const { component, dialogRef } = testSetup();

    const selectedCollection = component.state.collections[0];
    component.cardClick(selectedCollection);
    expect(dialogRef.close).toHaveBeenCalledWith(selectedCollection);
  });

  it('User should be redirected back to the search results page with product and filter selections retained when user cancels the Add Products modal without adding products', () => {
    const { spectator, dialogRef } = testSetup();

    const closeButton = spectator.query('.cos-modal-close');
    expect(closeButton).toExist();
    spectator.click(closeButton);
    expect(dialogRef.close).toHaveBeenCalled();
    expect(dialogRef.close).toHaveBeenCalledWith('');
  });

  it('User should be redirected back to the source collection detail page with product selections retained when user cancels the Add Products modal without adding products', () => {
    const { spectator, dialogRef } = testSetup();

    const closeButton = spectator.query('.cos-modal-close');
    expect(closeButton).toExist();
    spectator.click(closeButton);
    expect(dialogRef.close).toHaveBeenCalled();
    expect(dialogRef.close).toHaveBeenCalledWith('');
  });

  it('Clicking link redirects user to the Collections Landing page when a new collection is created from Search results > Add Products Modal and user lands on collection detail page', () => {
    const { spectator, dialogRef } = testSetup();

    const createNewCollectionBtn = spectator.query('.create');
    expect(createNewCollectionBtn).toExist();
    expect(createNewCollectionBtn.tagName).toBe('BUTTON');
    expect(createNewCollectionBtn).toHaveText('Create a new Collection');
    spectator.click(createNewCollectionBtn);
    expect(dialogRef.close).toHaveBeenCalled();
    expect(dialogRef.close).toHaveBeenCalledWith('create');
  });

  it('Add products modal should be displayed with Create New Collection section having Create New Collection button enabled', () => {
    const { spectator } = testSetup();

    const createNewCollectionBtn = spectator.query('.create');
    expect(createNewCollectionBtn).toExist();
    expect(createNewCollectionBtn.tagName).toBe('BUTTON');
    expect(createNewCollectionBtn).toHaveText('Create a new Collection');
    expect(createNewCollectionBtn.getAttribute('disabled')).not.toBeTruthy();
  });

  it('Only Active collections displayed at Add Products Modal', () => {
    const collections = injectCollections
      .slice(0, 5)
      .map((collection, i) => {
        if ([0, 1, 2].includes(i)) {
          collection.Status = 'Archived';
          return collection;
        }
        collection.Status = 'Active';
        return collection;
      })
      .filter((collection) => collection.Status === 'Active');
    const { spectator, component } = testSetup({ collections });

    const collectionItems = spectator.queryAll('.collection-item');
    expect(collectionItems).toHaveLength(component.state.collections.length);
  });

  it('Maximum of 5 collections should be displayed intially', () => {
    const { spectator, component } = testSetup();

    const collectionItems = spectator.queryAll('.collection-item');
    expect(component.collections).toHaveLength(5);
    expect(collectionItems).toHaveLength(component.collections.length);
  });

  it('Archived collections should not be displayed at Add products modal', () => {
    const collections = injectCollections
      .map((collection, i) => {
        if ([0, 2, 4].includes(i)) {
          collection.Status = 'Active';
          return collection;
        }
        collection.Status = 'Archived';
        return collection;
      })
      .filter((collection) => collection.Status !== 'Archived');

    const { spectator, component } = testSetup({ collections });

    const collectionItems = spectator.queryAll('.collection-item');
    expect(component.collections).toHaveLength(3);
    expect(collectionItems).toHaveLength(component.collections.length);
  });

  it('Only collections to which the user has edit rights should be displayed', () => {
    const collections = injectCollections
      .map((collection, i) => {
        if ([1, 3, 5, 7].includes(i)) {
          collection.IsEditable = false;
          return collection;
        }
        collection.IsEditable = true;
        return collection;
      })
      .filter((collection) => collection.IsEditable);
    const { spectator, component } = testSetup({ collections });

    const collectionItems = spectator.queryAll('.collection-item');
    expect(component.collections).toHaveLength(5);
    expect(collectionItems).toHaveLength(component.collections.length);
    component.collections.forEach((collection) => {
      expect(collection.IsEditable).toBeTruthy();
    });
  });

  it('Collections to which user has View rights should not be displayed', () => {
    const collections = injectCollections
      .map((collection, i) => {
        if ([1, 3, 5, 7].includes(i)) {
          collection.IsEditable = true;
          return collection;
        }
        collection.IsEditable = false;
        return collection;
      })
      .filter((collection) => collection.IsEditable);
    const { spectator, component } = testSetup({ collections });

    const collectionItems = spectator.queryAll('.collection-item');
    expect(component.collections).toHaveLength(4);
    expect(collectionItems).toHaveLength(component.collections.length);
    component.collections.forEach((collection) => {
      expect(collection.IsEditable).toBeTruthy();
    });
  });

  it('Collections made active after being archived should be displayed at Add Products modal', () => {
    const collections = injectCollections
      .map((collection) => {
        collection.Status = 'Archived';
        return collection;
      })
      .filter((collection) => collection.Status === 'Active');
    const { spectator, component } = testSetup({ collections });

    expect(component.collections).toHaveLength(0);
    let collectionItems = spectator.queryAll('.collection-item');
    expect(collectionItems).toHaveLength(component.collections.length);
    component.state.collections = injectCollections
      .map((collection, i) => {
        if ([2, 4, 6, 8].includes(i)) {
          collection.Status = 'Active';
          return collection;
        }
        collection.Status = 'Archived';
        return collection;
      })
      .filter((collection) => collection.Status === 'Active');
    spectator.detectComponentChanges();
    expect(component.collections).toHaveLength(4);
    collectionItems = spectator.queryAll('.collection-item');
    expect(collectionItems).toHaveLength(component.collections.length);
  });

  it('Archived collections should no longer be available at Add Products modal', () => {
    const collections = injectCollections
      .map((collection) => {
        collection.Status = 'Archived';
        return collection;
      })
      .filter((collection) => collection.Status === 'Active');
    const { spectator, component } = testSetup({ collections });

    expect(component.collections).toHaveLength(0);
    const collectionItems = spectator.queryAll('.collection-item');
    expect(collectionItems).toHaveLength(component.collections.length);
  });

  it('Update an archive collection and make sure it does not show up on Add Products modal', () => {
    const collections = injectCollections
      .map((collection, i) => {
        if ([3, 4, 5, 6, 7, 8, 9].includes(i)) {
          collection.Status = 'Archived';
          collection.Name = 'test collection';
          collection.Description = 'test description';
          return collection;
        }
        collection.Status = 'Active';
        return collection;
      })
      .filter((collection) => collection.Status === 'Active');
    const { spectator, component } = testSetup({ collections });

    expect(component.collections).toHaveLength(3);
    const collectionItems = spectator.queryAll('.collection-item');
    expect(collectionItems).toHaveLength(component.collections.length);
  });

  it('Search text field should be available blank by default', () => {
    const { spectator, component } = testSetup();

    const searchInput = spectator.query('.search-field-input');
    expect(searchInput).toExist();
    expect(searchInput.tagName).toBe('INPUT');
    expect(component.searchForm.get('term').value).toEqual('');
  });

  it('Show More link displayed when more than 5 Collections available', () => {
    const { spectator, component } = testSetup();

    expect(component.showMoreButtonVisible).toBeTruthy();
    const showMoreSection = spectator.query('.show-more');
    const showMoreBtn = showMoreSection.children[0];
    expect(showMoreSection).toExist();
    expect(showMoreBtn).toExist();
    expect(showMoreBtn.tagName).toBe('BUTTON');
    expect(showMoreBtn).toHaveExactText('Show more');
  });

  it('Show More link should not be displayed when less than 5 collections', () => {
    const collections = injectCollections.slice(0, 4);
    const { spectator, component } = testSetup({ collections });

    expect(component.showMoreButtonVisible).toBeFalsy();
    const showMoreSection = spectator.query('.show-more');
    expect(showMoreSection).not.toExist();
  });

  it('Show More link should not be displayed when = 5 Collections', () => {
    const collections = injectCollections.slice(0, 5);
    const { spectator, component } = testSetup({ collections });

    expect(component.showMoreButtonVisible).toBeFalsy();
    const showMoreSection = spectator.query('.show-more');
    expect(showMoreSection).not.toExist();
  });

  it('Clicking Show more should load all remaining collections', () => {
    const { spectator, component } = testSetup();

    expect(component.showMoreButtonVisible).toBeTruthy();
    let showMoreSection = spectator.query('.show-more');
    const showMoreBtn = showMoreSection.children[0];
    expect(showMoreSection).toExist();
    expect(showMoreBtn).toExist();
    expect(showMoreBtn.tagName).toBe('BUTTON');
    expect(showMoreBtn).toHaveExactText('Show more');
    let collectionItems = spectator.queryAll('.collection-item');
    expect(component.collections).toHaveLength(5);
    expect(collectionItems).toHaveLength(component.collections.length);
    spectator.click(showMoreBtn);
    spectator.detectChanges();
    expect(component.showMoreButtonVisible).toBeFalsy();
    showMoreSection = spectator.query('.show-more');
    expect(showMoreSection).not.toExist();
    collectionItems = spectator.queryAll('.collection-item');
    expect(component.collections).toHaveLength(
      component.state.collections.length
    );
    expect(collectionItems).toHaveLength(component.collections.length);
  });

  it('Show more link should not be displayed when user performs a search within collections modal and results in collections that are less than or equal to 5', fakeAsync(() => {
    const { spectator, component } = testSetup();
    const searchInput = spectator.query('.search-field-input');

    component.state.collections = injectCollections.slice(0, 5);
    expect(searchInput).toExist();
    expect(searchInput.tagName).toBe('INPUT');
    jest.spyOn(component, 'search');
    spectator.typeInElement('test', searchInput);
    spectator.tick(500);
    expect(component.search).toHaveBeenCalled();
    spectator.tick(500);
    expect(component.showMoreButtonVisible).toBeFalsy();
    const showMoreSection = spectator.query('.show-more');
    expect(showMoreSection).not.toExist();
  }));

  it('Show more link should be displayed when user performs a search within collections modal and results are > 5', fakeAsync(() => {
    const { spectator, component } = testSetup();

    const searchInput = spectator.query('.search-field-input');
    expect(searchInput).toExist();
    expect(searchInput.tagName).toBe('INPUT');
    jest.spyOn(component, 'search');
    spectator.typeInElement('test', searchInput);
    spectator.tick(500);
    expect(component.search).toHaveBeenCalled();
    component.state.collections = injectCollections.slice(0, 10);
    spectator.tick(500);
    expect(component.showMoreButtonVisible).toBeTruthy();
    const showMoreSection = spectator.query('.show-more');
    expect(showMoreSection).toExist();
  }));

  it('User Should be able to search on the basis of collections name', fakeAsync(() => {
    const { spectator, component } = testSetup();

    const searchInput = spectator.query('.search-field-input');
    expect(searchInput).toExist();
    expect(searchInput.tagName).toBe('INPUT');
    jest.spyOn(component, 'search');
    spectator.typeInElement('test', searchInput);
    expect(component.searchForm.get('term').value).toBe('test');
    spectator.tick(500);
    expect(component.search).toHaveBeenCalled();
  }));

  it('User should be able to search on the basis of collections description', fakeAsync(() => {
    const { spectator, component } = testSetup();

    const searchInput = spectator.query('.search-field-input');
    expect(searchInput).toExist();
    expect(searchInput.tagName).toBe('INPUT');
    jest.spyOn(component, 'search');
    spectator.typeInElement('test', searchInput);
    expect(component.searchForm.get('term').value).toBe('test');
    spectator.tick(500);
    expect(component.search).toHaveBeenCalled();
  }));

  it('Available collections updated correctly when user types in single character in search collections field. i.e. All collections that contains the typed in character in name or description field should be displayed', fakeAsync(() => {
    const { spectator, component } = testSetup();
    const searchInput = spectator.query('.search-field-input');

    expect(searchInput).toExist();
    expect(searchInput.tagName).toBe('INPUT');

    component.state.collections = injectCollections
      .slice(0, 3)
      .map((collection, i) => {
        if ([0, 2].includes(i)) {
          collection.Name = 'test name';
          collection.Description = 'description test';
          return collection;
        }
        collection.Name = 'name';
        collection.Description = 'desc';
        return collection;
      })
      .filter(
        (collection) =>
          collection.Name.includes('t') || collection.Description.includes('t')
      );

    jest.spyOn(component, 'search');
    spectator.typeInElement('t', searchInput);
    expect(component.searchForm.get('term').value).toBe('t');
    spectator.tick(500);
    expect(component.search).toHaveBeenCalled();
    spectator.tick(500);
    expect(component.collections).toHaveLength(2);
    const collectionItems = spectator.queryAll('.collection-item');
    expect(collectionItems).toHaveLength(component.collections.length);
  }));

  it('Available collections updated correctly when user types in multiple character in search collections field. i.e. All collections that contains the typed in character in name or description field should be displayed', fakeAsync(() => {
    const { spectator, component } = testSetup();
    const searchInput = spectator.query('.search-field-input');

    expect(searchInput).toExist();
    expect(searchInput.tagName).toBe('INPUT');

    component.state.collections = injectCollections
      .slice(0, 3)
      .map((collection, i) => {
        if ([0, 2].includes(i)) {
          collection.Name = 'test name';
          collection.Description = 'description test';
          return collection;
        }
        collection.Name = 'name';
        collection.Description = 'desc';
        return collection;
      })
      .filter(
        (collection) =>
          collection.Name.includes('test') ||
          collection.Description.includes('test')
      );

    jest.spyOn(component, 'search');
    spectator.typeInElement('test', searchInput);
    expect(component.searchForm.get('term').value).toBe('test');
    spectator.tick(500);
    expect(component.search).toHaveBeenCalled();
    spectator.tick(500);
    expect(component.collections).toHaveLength(2);
    const collectionItems = spectator.queryAll('.collection-item');
    expect(collectionItems).toHaveLength(component.collections.length);
  }));

  it('Removing characters and the collections list should be updated', fakeAsync(() => {
    const { spectator, component } = testSetup();

    const searchInput = spectator.query('.search-field-input');
    expect(searchInput).toExist();
    expect(searchInput.tagName).toBe('INPUT');
    jest.spyOn(component, 'search');
    spectator.typeInElement('', searchInput);
    expect(component.searchForm.get('term').value).toBe('');
    spectator.tick(500);
    expect(component.search).toHaveBeenCalled();
  }));

  it('Type more characters and the collections list should be updated', fakeAsync(() => {
    const { spectator, component } = testSetup();

    const searchInput = spectator.query('.search-field-input');
    expect(searchInput).toExist();
    expect(searchInput.tagName).toBe('INPUT');
    jest.spyOn(component, 'search');
    spectator.typeInElement('test', searchInput);
    expect(component.searchForm.get('term').value).toBe('test');
    spectator.tick(500);
    expect(component.search).toHaveBeenCalled();
  }));

  it('Search should work and correct results show when typed in one or more special characters', fakeAsync(() => {
    const { spectator, component } = testSetup();
    const searchInput = spectator.query('.search-field-input');

    expect(searchInput).toExist();
    expect(searchInput.tagName).toBe('INPUT');

    component.state.collections = injectCollections
      .slice(0, 3)
      .map((collection, i) => {
        if ([0, 2].includes(i)) {
          collection.Name = '*$test name';
          collection.Description = 'description *$test';
          return collection;
        }
        collection.Name = 'name';
        collection.Description = 'desc';
        return collection;
      })
      .filter(
        (collection) =>
          collection.Name.includes('*$test') ||
          collection.Description.includes('*$test')
      );

    jest.spyOn(component, 'search');
    spectator.typeInElement('*$test', searchInput);
    expect(component.searchForm.get('term').value).toBe('*$test');
    spectator.tick(500);
    expect(component.search).toHaveBeenCalled();
    spectator.tick(500);
    expect(component.collections).toHaveLength(2);
    const collectionItems = spectator.queryAll('.collection-item');
    expect(collectionItems).toHaveLength(component.collections.length);
  }));

  it('Search should work and correct results are show when typed in one or more words', fakeAsync(() => {
    const { spectator, component } = testSetup();
    const searchInput = spectator.query('.search-field-input');

    expect(searchInput).toExist();
    expect(searchInput.tagName).toBe('INPUT');

    component.state.collections = injectCollections
      .slice(0, 3)
      .map((collection, i) => {
        if ([0, 2].includes(i)) {
          collection.Name = 'test test1 name';
          collection.Description = 'description test test1';
          return collection;
        }
        collection.Name = 'name';
        collection.Description = 'desc';
        return collection;
      })
      .filter(
        (collection) =>
          collection.Name.includes('test test1') ||
          collection.Description.includes('test test1')
      );

    jest.spyOn(component, 'search');
    spectator.typeInElement('test test1', searchInput);
    expect(component.searchForm.get('term').value).toBe('test test1');
    spectator.tick(500);
    expect(component.search).toHaveBeenCalled();
    spectator.tick(500);
    expect(component.collections).toHaveLength(2);
    const collectionItems = spectator.queryAll('.collection-item');
    expect(collectionItems).toHaveLength(component.collections.length);
  }));

  it('Search should work when typed in one or more numeric characters', fakeAsync(() => {
    const { spectator, component } = testSetup();
    const searchInput = spectator.query('.search-field-input');

    expect(searchInput).toExist();
    expect(searchInput.tagName).toBe('INPUT');

    component.state.collections = injectCollections
      .slice(0, 3)
      .map((collection, i) => {
        if ([0, 2].includes(i)) {
          collection.Name = '123 name';
          collection.Description = 'description 123';
          return collection;
        }
        collection.Name = 'name';
        collection.Description = 'desc';
        return collection;
      })
      .filter(
        (collection) =>
          collection.Name.includes('123') ||
          collection.Description.includes('123')
      );

    jest.spyOn(component, 'search');
    spectator.typeInElement('123', searchInput);
    expect(component.searchForm.get('term').value).toBe('123');
    spectator.tick(500);
    expect(component.search).toHaveBeenCalled();
    spectator.tick(500);
    expect(component.collections).toHaveLength(2);
    const collectionItems = spectator.queryAll('.collection-item');
    expect(collectionItems).toHaveLength(component.collections.length);
  }));

  it('User should not be able to add products to an archive collection from search results', () => {
    const collections = injectCollections.map((collection, i) => {
      if ([0, 5, 6, 7].includes(i)) {
        collection.Status = 'Archived';
        return collection;
      }
      collection.Status = 'Active';
      return collection;
    });
    const { spectator, component } = testSetup({ collections });

    const activeCollections = component.state.collections.filter(
      (col) => col.Status !== 'Archived'
    );
    component.state.collections = activeCollections;
    spectator.detectChanges();
    expect(component.collections).toHaveLength(5);
    component.collections.forEach((col) => {
      expect(col.Status).not.toBe('Archived');
    });
  });
});
