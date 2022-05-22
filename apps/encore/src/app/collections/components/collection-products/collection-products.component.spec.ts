import { fakeAsync, flush, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CosAnalyticsService, TrackEvent } from '@cosmos/analytics';
import {
  CosProductCardComponent,
  CosProductCardModule,
} from '@cosmos/components/product-card';
import {
  CosSupplierComponent,
  CosSupplierFooterComponent,
  CosSupplierModule,
} from '@cosmos/components/supplier';
import {
  AddProductsResponse,
  Collection,
  CollectionProductsActions,
  CollectionProductSearchResultItem,
  CollectionsService,
  CollectionStatus,
  productToCollectionProduct,
} from '@esp/collections';
import { CollectionMockDb } from '@esp/collections/mocks';
import { AccessLevel } from '@esp/models';
import {
  Product,
  ProductCollectionRemoveEvent,
  ProductCollectionTrackEvent,
  ProductTrackEvent,
  ProductViewEvent,
} from '@esp/products';
import {
  EspSearchPaginationModule,
  SearchPaginationComponent,
  SortOption,
} from '@esp/search';
import { createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { NgxsModule, Store } from '@ngxs/store';
import { ProductsMockDb } from '@smartlink/products/mocks';
import { MockComponents } from 'ng-mocks';
import { of } from 'rxjs';
import { productToProductEvent } from '../../../products/utils';
import { AddToPresentationFlow } from '../../../projects/flows';
import { productSortOptions } from '../../configs';
import { CollectionDetailPage, CollectionSearchPage } from '../../pages';
import { CollectionsDialogService } from '../../services';
import {
  CollectionProductsComponent,
  CollectionProductsComponentModule,
} from './collection-products.component';
import { CollectionProductsLocalState } from './collection-products.local-state';

const mockCollection = CollectionMockDb.Collections[0];
const injectProducts = ProductsMockDb.products.slice(0, 5);

function buildCollection(options?: {
  explicit?: Partial<Collection>;
  isReadOnly?: boolean;
}) {
  const collection: Collection = {
    Id: 1,
    ...mockCollection,
    ...(options?.explicit || {}),
  };

  if (options?.isReadOnly) {
    Object.assign(collection, {
      Access: [{ AccessType: 'Read' }],
      IsEditable: false,
    });
  }

  return collection;
}
describe('Collection Products Component', () => {
  let collectionsDialogService: CollectionsDialogService;
  let spyFn: jest.SpyInstance;
  let spyAnalyticsFn: jest.SpyInstance;
  let modalService: CollectionsDialogService;
  let analyticsService: CosAnalyticsService;
  const product = injectProducts[0];
  const mockAddProductsResponse: AddProductsResponse = {
    Collection: { Id: 1, Name: 'Test Collection' },
    ProductsDuplicated: [],
    ProductsTruncated: [],
  };

  const createComponent = createComponentFactory({
    component: CollectionProductsComponent,
    imports: [
      CollectionProductsComponentModule,
      RouterTestingModule.withRoutes([
        {
          path: 'collections/:id',
          component: CollectionDetailPage,
        },
        {
          path: 'collections',
          component: CollectionSearchPage,
        },
      ]),
      NgxsModule.forRoot(),
    ],
    providers: [
      mockProvider(CollectionProductsLocalState, {
        connect() {
          return of(this);
        },
      }),
      mockProvider(CollectionsService, {
        searchProducts: jest.fn(() => of([])),
      }),

      mockProvider(CollectionsDialogService),
      mockProvider(CosAnalyticsService),
    ],
    overrideModules: [
      [
        CosSupplierModule,
        {
          set: {
            declarations: MockComponents(
              CosSupplierComponent,
              CosSupplierFooterComponent
            ),
            exports: MockComponents(
              CosSupplierComponent,
              CosSupplierFooterComponent
            ),
          },
        },
      ],
      [
        CosProductCardModule,
        {
          set: {
            declarations: MockComponents(CosProductCardComponent),
            exports: MockComponents(CosProductCardComponent),
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
    isReadOnly?: boolean;
    status?: CollectionStatus;
    sort?: SortOption;
    accessLevel?: AccessLevel;
    products?: CollectionProductSearchResultItem[];
  }) => {
    const collection = buildCollection({
      explicit: {
        Status: options?.status || 'Active',
        AccessLevel: options?.accessLevel || 'Everyone',
      },
      isReadOnly: options?.isReadOnly,
    });

    const sort = options?.sort || productSortOptions[0];
    const products = options?.products || injectProducts;

    const spectator = createComponent({
      providers: [
        mockProvider(CollectionProductsLocalState, <
          Partial<CollectionProductsLocalState>
        >{
          connect() {
            return of(this);
          },
          collection,
          products: {
            Results: products,
            ResultsTotal: products.length,
          },
          save: () => of(),
          sort,
          search: jest.fn(() => of()),
          criteria: {
            from: 1,
            size: 50,
          },
        }),
      ],
    });

    const router = spectator.inject(Router);

    jest.spyOn(router, 'navigate').mockResolvedValue(true);
    jest.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

    return { spectator, component: spectator.component };
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    const { component } = testSetup();

    expect(component).toBeTruthy();
  });

  it('should display a product card for every available product', () => {
    const { component, spectator } = testSetup();

    component.state.isLoading = false;
    component.state.hasLoaded = true;
    spectator.detectComponentChanges();
    const productCards = spectator.queryAll('.product-results > a');

    expect(productCards).toHaveLength(component.state.products.Results.length);
  });

  it('should check product', () => {
    const { component } = testSetup();

    component.toggleChecked(product);
    expect(component.checkedProducts.size).toBeGreaterThan(0);
  });

  xit('should show pagination when there are 50 products', () => {
    testSetup();

    // TODO: this does nothing when it's mocked. Should this test be moved to cos-pagination?

    expect('esp-search-pagination').toBeVisible();
  });

  it("'Remove From Collection' option should be available on the action bar when user selects multiple products and action bar appears", fakeAsync(() => {
    const { component, spectator } = testSetup();
    spectator.tick();
    injectProducts
      .slice(0, 4)
      .forEach((product) => component.checkedProducts.set(product.Id, product));
    spectator.detectComponentChanges();
    const optionsBtn = spectator.query(
      '.cos-action-bar > .cos-action-bar-container > .card-actions > .cos-action-bar-controls'
    ).children[0].children[0].children[0];
    expect(optionsBtn).toExist();
    spectator.click(optionsBtn);
    const removeFromCollectionBtn = spectator.query(
      '.action-remove-from-collection'
    );
    expect(removeFromCollectionBtn).toExist();
    expect(removeFromCollectionBtn.tagName).toBe('BUTTON');
    expect(removeFromCollectionBtn).toHaveText('Remove from Collection');
  }));

  it("Selecting the 'Delete' option from three dot menu should remove that product from the collection detail page", fakeAsync(() => {
    const { component, spectator } = testSetup();
    spectator.tick();
    injectProducts
      .slice(0, 4)
      .forEach((product) => component.checkedProducts.set(product.Id, product));
    spectator.detectComponentChanges();
    const service = spectator.inject(CollectionProductsLocalState, true);
    const facadeSpyFn = jest.spyOn(service, 'delete');
    component.state.delete([injectProducts.slice(0, 4)[0].Id]);
    spectator.tick(200);
    expect(facadeSpyFn).toHaveBeenCalled();
  }));

  it("Selecting a single product from the collection and clicking 'Remove from collection' button from action bar should remove that single product from the collection", fakeAsync(() => {
    const { component, spectator } = testSetup();
    spectator.tick();
    const service = spectator.inject(CollectionProductsLocalState, true);
    const facadeSpyFn = jest.spyOn(service, 'delete');
    // component.checkedProducts = [product];
    spectator.detectChanges();
    component.state.delete([product.Id]);
    expect(facadeSpyFn).toHaveBeenCalledWith([product.Id]);
  }));

  it("Selecting the multiple products from the collection and clicking 'Remove from collection' button from action bar should remove the all selected products from the collection", fakeAsync(() => {
    const { component, spectator } = testSetup();
    spectator.tick();
    const service = spectator.inject(CollectionProductsLocalState, true);
    const facadeSpyFn = jest.spyOn(service, 'delete');
    const productIds = Array.from(component.checkedProducts.keys());
    injectProducts
      .slice(0, 3)
      .forEach((product) => component.checkedProducts.set(product.Id, product));
    spectator.detectChanges();
    component.state.delete(productIds);
    expect(facadeSpyFn).toHaveBeenCalledWith(productIds);
  }));

  it('User should be able to remove all products from the collection', fakeAsync(() => {
    const { component, spectator } = testSetup();
    spectator.tick();
    const service = spectator.inject(CollectionProductsLocalState, true);
    const facadeSpyFn = jest.spyOn(service, 'delete');
    component.selectAll({ checked: true });
    const productIds = Array.from(component.checkedProducts.keys());
    spectator.detectChanges();
    component.state.delete(productIds);
    expect(facadeSpyFn).toHaveBeenCalledWith(productIds);
  }));

  it('Selected sort should be retained when user removes products from collection', fakeAsync(() => {
    const { component, spectator } = testSetup({ sort: productSortOptions[2] });
    spectator.tick();
    const service = spectator.inject(CollectionProductsLocalState, true);
    const facadeSpyFn = jest.spyOn(service, 'delete');
    component.state.delete([1]);
    expect(facadeSpyFn).toHaveBeenCalledWith([1]);
    expect(component.state.sort).toEqual(productSortOptions[2]);
  }));

  it('Product removed stat should be recorded when product is checked and removed from collection', fakeAsync(() => {
    const mockProduct: CollectionProductSearchResultItem = {
      Id: 1,
      Name: 'Red mug',
      Price: {
        Quantity: {
          From: 48,
          To: 143,
        },
        Price: 6.8,
        Cost: 3.4,
        DiscountCode: 'P',
        CurrencyCode: 'USD',
        IsQUR: false,
        PreferredPrice: 6.8,
      },
      Description: '',
      ShortDescription: '',
      Number: '',
      ImageUrl: '',
      Supplier: null,
      IsNew: false,
      IsConfirmed: false,
      HasInventory: false,
    };

    const { component, spectator } = testSetup({ products: [mockProduct] });
    spectator.tick();
    const service = spectator.inject(CollectionProductsLocalState, true);
    const analyticsService = spectator.inject(CosAnalyticsService, true);

    const fnTrackStatEvent = jest
      .spyOn(analyticsService, 'track')
      .mockImplementation();

    const facadeSpyFn = jest.spyOn(service, 'delete');

    component.selectAll({ checked: true });
    const productIds = Array.from(component.checkedProducts.keys());
    spectator.detectChanges();
    component.removeProducts();
    expect(facadeSpyFn).toHaveBeenCalledWith(productIds);

    const stat: TrackEvent<ProductCollectionRemoveEvent> = {
      action: 'Collection Products Removed',
      properties: {
        id: component.state.collection.Id,
        products: [mockProduct.Id],
      },
    };

    expect(fnTrackStatEvent).toHaveBeenCalledWith(stat);
  }));

  it('Product removed stat should be recorded when products are selected from multiple pages and removed from collection', fakeAsync(() => {
    const { component, spectator } = testSetup();
    spectator.tick();

    component.state.products.Results = injectProducts.slice(0, 2);

    let product = component.state.products.Results[0];
    component.checkedProducts.set(product.Id, product);

    component.state.products.Results = injectProducts.slice(3, 5);

    product = component.state.products.Results[0];
    component.checkedProducts.set(product.Id, product);
    spectator.detectComponentChanges();

    const service = spectator.inject(CollectionProductsLocalState, true);
    const analyticsService = spectator.inject(CosAnalyticsService, true);

    const fnTrackStatEvent = jest
      .spyOn(analyticsService, 'track')
      .mockImplementation();

    const facadeSpyFn = jest.spyOn(service, 'delete');

    const productIds = Array.from(component.checkedProducts.keys());
    spectator.detectChanges();
    component.removeProducts();
    expect(facadeSpyFn).toHaveBeenCalledWith(productIds);

    const stat: TrackEvent<ProductCollectionRemoveEvent> = {
      action: 'Collection Products Removed',
      properties: {
        id: component.state.collection.Id,
        products: productIds,
      },
    };

    expect(fnTrackStatEvent).toHaveBeenCalledWith(stat);
  }));

  it('Product List Viewed event should trigger', fakeAsync(() => {
    const { spectator, component } = testSetup();

    const analyticsService = spectator.inject(CosAnalyticsService, true);
    const fnTrackStatEvent = jest
      .spyOn(analyticsService, 'track')
      .mockImplementation();

    const products: Product[] = component.state.products.Results.map(
      (product, index) => productToProductEvent(product, index + 1)
    );

    const stat: TrackEvent<ProductViewEvent> = {
      action: 'Product List Viewed',
      properties: {
        products: products,
        source: { id: component.state.collection.Id },
      },
    };

    spectator.tick();
    expect(fnTrackStatEvent).toHaveBeenCalledWith(stat);
  }));

  it('Product removed stat should be recorded when product is deleted from collection', fakeAsync(() => {
    const { component, spectator } = testSetup();
    spectator.tick();
    const service = spectator.inject(CollectionProductsLocalState, true);
    const analyticsService = spectator.inject(CosAnalyticsService, true);
    const productId = 1;
    const fnTrackStatEvent = jest
      .spyOn(analyticsService, 'track')
      .mockImplementation();

    const facadeSpyFn = jest.spyOn(service, 'delete');

    component.removeProduct(productId);
    expect(facadeSpyFn).toHaveBeenCalledWith([productId]);

    const stat = {
      action: 'Collection Products Removed',
      properties: {
        id: component.state.collection.Id,
        products: [productId],
      },
    };

    expect(fnTrackStatEvent).toHaveBeenCalledWith(stat);
  }));

  it('Product add stat should be recorded when product is added to a collection', fakeAsync(() => {
    const mockProduct: CollectionProductSearchResultItem = {
      Id: 1,
      Name: 'Red mug',
      Price: {
        Quantity: {
          From: 48,
          To: 143,
        },
        Price: 6.8,
        Cost: 3.4,
        DiscountCode: 'P',
        CurrencyCode: 'USD',
        IsQUR: false,
        PreferredPrice: 6.8,
      },
      Description: '',
      ShortDescription: '',
      Number: '',
      ImageUrl: '',
      Supplier: null,
      IsNew: false,
      IsConfirmed: false,
      HasInventory: false,
    };

    const collectionId = 1;
    const { component, spectator } = testSetup({ products: [mockProduct] });

    collectionsDialogService = spectator.inject(CollectionsDialogService, true);
    const analyticsService = spectator.inject(CosAnalyticsService, true);

    jest
      .spyOn(collectionsDialogService, 'addToCollection')
      .mockReturnValue(of(mockAddProductsResponse));

    const fnTrackStatEvent = jest
      .spyOn(analyticsService, 'track')
      .mockImplementation();

    component.selectAll({ checked: true });
    spectator.detectChanges();
    component.addToCollection();

    spectator.tick();

    const stat: TrackEvent<ProductCollectionTrackEvent> = {
      action: 'Collection Products Added',
      properties: {
        id: collectionId,
        products: [mockProduct.Id],
        productsDuplicated: mockAddProductsResponse.ProductsDuplicated,
        productsTruncated: mockAddProductsResponse.ProductsTruncated,
        source: { id: component.state.collection.Id },
      },
    };

    expect(fnTrackStatEvent).toHaveBeenCalledWith(stat);
  }));

  describe('Actions', () => {
    let spyFn: jest.SpyInstance;

    it('should open add to collection dialog', fakeAsync(() => {
      const { component, spectator } = testSetup();
      spectator.tick();
      collectionsDialogService = spectator.inject(
        CollectionsDialogService,
        true
      );
      spyFn = jest
        .spyOn(collectionsDialogService, 'addToCollection')
        .mockReturnValue(of(mockAddProductsResponse));

      analyticsService = spectator.inject(CosAnalyticsService, true);
      jest.spyOn(analyticsService, 'track').mockImplementation();

      component.addToCollection(product);
      spectator.detectChanges();
      expect(spyFn).toHaveBeenCalled();
    }));
  });

  describe('Bulk product add to collection', () => {
    let spyFn: jest.SpyInstance;

    it('Clicking Add to collection option from action bar should take user to the Add to collection modal when there are multiple existing collections and user has edit rights for all of collections', () => {
      const { component, spectator } = testSetup();
      modalService = spectator.inject(CollectionsDialogService);
      spyFn = jest
        .spyOn(modalService, 'addToCollection')
        .mockReturnValue(of(mockAddProductsResponse));

      analyticsService = spectator.inject(CosAnalyticsService, true);
      jest.spyOn(analyticsService, 'track').mockImplementation();

      injectProducts
        .slice(0, 4)
        .forEach((product) =>
          component.checkedProducts.set(product.Id, product)
        );
      spectator.detectComponentChanges();
      component.addToCollection();
      expect(spyFn).toHaveBeenCalled();
      expect(spyFn).toHaveBeenCalledWith(
        component.state.products.Results.filter((product) =>
          component.checkedProducts.has(product.Id)
        ).map(productToCollectionProduct),
        component.state.collection.Id
      );
    });

    it('Product selections should not be retained when user selects and adds multiple products to a collection successfully and redirected back to the source collection detail page', fakeAsync(() => {
      const { spectator, component } = testSetup({ products: [product] });
      spectator.tick();
      modalService = spectator.inject(CollectionsDialogService, true);
      spyFn = jest
        .spyOn(modalService, 'addToCollection')
        .mockReturnValue(of(mockAddProductsResponse));

      analyticsService = spectator.inject(CosAnalyticsService, true);
      jest.spyOn(analyticsService, 'track').mockImplementation();

      // component.checkedProducts = [product.Id];
      spectator.detectComponentChanges();
      component.addToCollection();
      expect(spyFn).toHaveBeenCalled();

      spectator.tick();
      expect(component.checkedProducts.size).toHaveLength(0);
    }));

    it('Product selections should not be retained when user selects and adds multiple products to a collection such that only some of the products are added and user is redirected back to the source collection detail page', fakeAsync(() => {
      const { component, spectator } = testSetup();
      modalService = spectator.inject(CollectionsDialogService, true);
      spyFn = jest
        .spyOn(modalService, 'addToCollection')
        .mockReturnValue(of(mockAddProductsResponse));

      analyticsService = spectator.inject(CosAnalyticsService, true);
      jest.spyOn(analyticsService, 'track').mockImplementation();

      injectProducts
        .slice(0, 3)
        .forEach((product) =>
          component.checkedProducts.set(product.Id, product)
        );
      spectator.detectChanges();
      component.addToCollection();
      expect(spyFn).toHaveBeenCalled();
      expect(spyFn).toHaveBeenCalledWith(
        component.state.products.Results.filter((product) =>
          component.checkedProducts.has(product.Id)
        ).map(productToCollectionProduct),
        component.state.collection.Id
      );
      spectator.tick();
      expect(component.checkedProducts.size).toHaveLength(0);
    }));

    it('Sort should be retained after changing default sort order when user successfully adds a product and redirected back to the source collection detail page', fakeAsync(() => {
      const { component, spectator } = testSetup({
        sort: productSortOptions[2],
      });
      modalService = spectator.inject(CollectionsDialogService, true);
      spyFn = jest
        .spyOn(modalService, 'addToCollection')
        .mockReturnValue(of(mockAddProductsResponse));

      analyticsService = spectator.inject(CosAnalyticsService, true);
      jest.spyOn(analyticsService, 'track').mockImplementation();

      injectProducts
        .slice(0, 3)
        .forEach((product) =>
          component.checkedProducts.set(product.Id, product)
        );
      spectator.detectChanges();
      component.addToCollection();
      expect(spyFn).toHaveBeenCalled();
      expect(spyFn).toHaveBeenCalledWith(
        component.state.products.Results.filter((product) =>
          component.checkedProducts.has(product.Id)
        ).map(productToCollectionProduct),
        component.state.collection.Id
      );
      spectator.tick();
      expect(component.state.sort).toEqual(productSortOptions[2]);
    }));

    // it('User should be able to select 250 products and add to a collection', () => {
    //   const { component } = testSetup();
    //   spyFn = jest
    //     .spyOn(modalService, 'addToCollection')
    //     .mockReturnValue(of({ test: 'some result' }));
    //   component.checkedProducts.length = 249;
    //   component.addToCollection();
    //   expect(spyFn).toHaveBeenCalled();
    // });

    // it('User should not be able to add more than 250 products to a collection', () => {
    //   const { component, spectator } = testSetup();
    //   const toastService = spectator.inject(CosToastService, true);
    //   const errorSpy = jest.spyOn(toastService, 'error').mockImplementation();
    //   component.checkedProducts.length = 251;
    //   component.addToCollection();
    //   expect(errorSpy).toHaveBeenCalled();
    // });

    it('User should be redirected back to the source collection detail page with product selections retained when user cancels the Add Products modal without adding products', fakeAsync(() => {
      const { component, spectator } = testSetup();
      modalService = spectator.inject(CollectionsDialogService, true);
      spyFn = jest
        .spyOn(modalService, 'addToCollection')
        .mockReturnValue(of(undefined));

      analyticsService = spectator.inject(CosAnalyticsService, true);
      jest.spyOn(analyticsService, 'track').mockImplementation();

      injectProducts
        .slice(0, 3)
        .forEach((product) =>
          component.checkedProducts.set(product.Id, product)
        );
      spectator.detectChanges();
      component.addToCollection();
      expect(spyFn).toHaveBeenCalled();
      spectator.tick();
      spectator.detectChanges();
      expect(Array.from(component.checkedProducts.keys())).toHaveLength(3);
    }));
  });

  it("Clicking 'Add to Collection' option should take user to the 'Add to Collection' modal when there are multiple existing collections and user has edit rights for all of collections", () => {
    const { component, spectator } = testSetup();
    const modalService = spectator.inject(CollectionsDialogService);
    const spyFn = jest
      .spyOn(modalService, 'addToCollection')
      .mockReturnValue(of(mockAddProductsResponse));

    analyticsService = spectator.inject(CosAnalyticsService, true);
    jest.spyOn(analyticsService, 'track').mockImplementation();

    component.state.products.Results = [product];
    spectator.detectChanges();
    component.addToCollection(product);
    expect(spyFn).toHaveBeenCalled();
  });

  it("Clicking 'Add to Collection' option should take user to the 'Create new collection' modal when there are existing collections with View Only rights", () => {
    const { component, spectator } = testSetup();
    const modalService = spectator.inject(CollectionsDialogService);
    const spyFn = jest
      .spyOn(modalService, 'addToCollection')
      .mockReturnValue(of(mockAddProductsResponse));

    analyticsService = spectator.inject(CosAnalyticsService, true);
    jest.spyOn(analyticsService, 'track').mockImplementation();

    component.state.products.Results = [product];
    spectator.detectChanges();
    component.addToCollection(product);
    expect(spyFn).toHaveBeenCalled();
  });

  it('Sort should be retained when user successfully adds a product after changing default sort order and is redirected back to collection detail page', fakeAsync(() => {
    const { component, spectator } = testSetup({ sort: productSortOptions[2] });
    const modalService = spectator.inject(CollectionsDialogService);
    const spyFn = jest
      .spyOn(modalService, 'addToCollection')
      .mockReturnValue(of(mockAddProductsResponse));

    analyticsService = spectator.inject(CosAnalyticsService, true);
    jest.spyOn(analyticsService, 'track').mockImplementation();

    component.state.products.Results = [product];
    spectator.detectChanges();
    component.addToCollection(product);
    expect(spyFn).toHaveBeenCalled();
    tick();
    expect(component.state.sort).toEqual(productSortOptions[2]);
    flush();
  }));

  // it('User should not be able to add a product to a collection if the target collection already has 250 products', () => {
  //   const { component, spectator } = testSetup();
  //   const toastService = spectator.inject(CosToastService, true);
  //   const errorSpy = jest.spyOn(toastService, 'error').mockImplementation();
  //   component.checkedProducts.length = 251;
  //   component.addToCollection(product);
  //   expect(errorSpy).toHaveBeenCalled();
  // });

  it('User shoud be able to add upto 250 products to a collection', () => {
    const { component, spectator } = testSetup();
    const modalService = spectator.inject(CollectionsDialogService);
    const spyFn = jest
      .spyOn(modalService, 'addToCollection')
      .mockReturnValue(of(mockAddProductsResponse));

    analyticsService = spectator.inject(CosAnalyticsService, true);
    jest.spyOn(analyticsService, 'track').mockImplementation();

    // component.checkedProducts.size = 220;
    component.addToCollection(product);
    expect(spyFn).toHaveBeenCalled();
  });

  it('Product Hovered event should trigger', fakeAsync(() => {
    const { spectator, component } = testSetup();
    const analyticsService = spectator.inject(CosAnalyticsService, true);
    const fnTrackStatEvent = jest
      .spyOn(analyticsService, 'trackHover')
      .mockImplementation();
    component.productHovered(component.state.products.Results[0], 0);
    const stat: TrackEvent<ProductTrackEvent> = {
      action: 'Product Hovered',
      properties: {
        id: product.Id,
        currencyCode: product.Price?.CurrencyCode,
        productIndex: 1,
        pageNumber: component.state.pageIndex + 1,
        source: { id: component.state.collection.Id },
      },
    };
    spectator.tick();
    expect(fnTrackStatEvent).toHaveBeenCalledWith(stat);
  }));

  describe('Toolbar tests', () => {
    it('Tool bar should be displayed when user selects one or more products from collections detail page', fakeAsync(() => {
      const { spectator, component } = testSetup({});
      spectator.tick();
      injectProducts
        .slice(0, 4)
        .forEach((product) =>
          component.checkedProducts.set(product.Id, product)
        );
      spectator.detectComponentChanges();
      const toolbar = spectator.query('.cos-action-bar');
      expect(toolbar).toExist();
    }));

    it('Unselecting all products individually should hide the tool bar', fakeAsync(() => {
      const { spectator, component } = testSetup({});
      spectator.tick();
      injectProducts
        .slice(0, 4)
        .forEach((product) =>
          component.checkedProducts.set(product.Id, product)
        );
      spectator.detectComponentChanges();
      let toolbar = spectator.query('.cos-action-bar');
      expect(toolbar).toExist();
      component.checkedProducts.clear();
      spectator.detectComponentChanges();
      toolbar = spectator.query('.cos-action-bar');
      expect(toolbar).not.toExist();
    }));

    it('Text should be updated correctly on tool bar when user selects single product as 1 product selected', fakeAsync(() => {
      const { spectator, component } = testSetup({});
      spectator.tick();
      injectProducts
        .slice(0, 1)
        .forEach((product) =>
          component.checkedProducts.set(product.Id, product)
        );
      spectator.detectComponentChanges();
      const checkboxLabel = spectator.query(
        'cos-checkbox.checkbox-products > label > span.cos-checkbox-label'
      );
      expect(checkboxLabel).toExist();
      expect(component.checkedProducts.size).toHaveLength(1);
      expect(checkboxLabel).toHaveText(
        `${component.checkedProducts.size} Product Selected`
      );
    }));

    it("Text should be updated correctly on tool bar when user selects multiple products as 'n products selected', where n is the number of products selected", fakeAsync(() => {
      const { spectator, component } = testSetup({});
      spectator.tick();
      injectProducts
        .slice(0, 3)
        .forEach((product) =>
          component.checkedProducts.set(product.Id, product)
        );
      spectator.detectComponentChanges();
      const checkboxLabel = spectator.query(
        'cos-checkbox.checkbox-products > label > span.cos-checkbox-label'
      );
      expect(checkboxLabel).toExist();
      expect(Array.from(component.checkedProducts.keys())).toHaveLength(3);
      expect(checkboxLabel).toHaveText(
        `${component.checkedProducts.size} Product Selected`
      );
    }));

    it('Count of the products should be updated correctly when user unselects one or more products individually', fakeAsync(() => {
      const { spectator, component } = testSetup({});
      spectator.tick();
      injectProducts
        .slice(0, 3)
        .forEach((product) =>
          component.checkedProducts.set(product.Id, product)
        );
      spectator.detectComponentChanges();
      let checkboxLabel = spectator.query(
        'cos-checkbox.checkbox-products > label > span.cos-checkbox-label'
      );
      expect(checkboxLabel).toExist();
      expect(Array.from(component.checkedProducts.keys())).toHaveLength(3);
      expect(checkboxLabel).toHaveText(
        `${component.checkedProducts.size} Product Selected`
      );
      injectProducts
        .slice(0, 1)
        .forEach((product) =>
          component.checkedProducts.set(product.Id, product)
        );
      spectator.detectComponentChanges();
      checkboxLabel = spectator.query(
        'cos-checkbox.checkbox-products > label > span.cos-checkbox-label'
      );
      expect(checkboxLabel).toExist();
      expect(component.checkedProducts.size).toHaveLength(1);
      expect(checkboxLabel).toHaveText(
        `${component.checkedProducts.size} Product Selected`
      );
    }));

    it('Count of selected products should be updated correctly when user selects products individually', fakeAsync(() => {
      const { spectator, component } = testSetup({});
      spectator.tick();
      injectProducts
        .slice(0, 3)
        .forEach((product) =>
          component.checkedProducts.set(product.Id, product)
        );
      spectator.detectComponentChanges();
      const checkboxLabel = spectator.query(
        'cos-checkbox.checkbox-products > label > span.cos-checkbox-label'
      );
      expect(checkboxLabel).toExist();
      expect(Array.from(component.checkedProducts.keys())).toHaveLength(3);
      expect(checkboxLabel).toHaveText(
        `${component.checkedProducts.size} Product Selected`
      );
    }));

    it('Count of the selected products on tool bar should be updated correctly when user selects all visible products using the checkbox on the tool bar', fakeAsync(() => {
      const { spectator, component } = testSetup({});
      spectator.tick();
      const selectedProducts = injectProducts.slice(0, 5).map((product, i) => {
        product.Id = i;
        return product;
      });
      component.state.products.Results = selectedProducts;
      spectator.detectComponentChanges();
      component.selectAll({ checked: true });
      spectator.detectComponentChanges();
      const checkboxLabel = spectator.query(
        'cos-checkbox.checkbox-products > label > span.cos-checkbox-label'
      );
      expect(checkboxLabel).toExist();
      expect(Array.from(component.checkedProducts.keys())).toHaveLength(
        selectedProducts.length
      );
      expect(checkboxLabel).toHaveText(
        `${component.checkedProducts.size} Product Selected`
      );
    }));

    it('Tool bar should be hidden and selection should be removed when some of the selected products are removed from collection', fakeAsync(() => {
      // Arrange
      const products = injectProducts.slice(0, 3).map((product, i) => {
        product.Id = i + 1;
        return product;
      });
      const { component, spectator } = testSetup({ products });
      const store = spectator.inject(Store);

      products.forEach((product) =>
        component.checkedProducts.set(product.Id, product)
      );
      spectator.detectComponentChanges();
      expect('.cos-action-bar').toExist();

      // Act
      // component.state.removeProducts(component.checkedProducts);
      store.dispatch(
        new CollectionProductsActions.RemoveSuccess(
          component.state.collection.Id,
          Array.from(component.checkedProducts.keys())
        )
      );
      spectator.tick();
      spectator.detectComponentChanges();

      // Assert
      expect('.cos-action-bar').not.toExist();
      expect(component.checkedProducts.size).toHaveLength(0);
    }));

    it('Tool bar should be hidden when user selects a single product and deletes the product', fakeAsync(() => {
      // Arrange
      const { component, spectator } = testSetup();
      const store = spectator.inject(Store);
      const products = injectProducts.slice(0, 1).map((product, i) => {
        product.Id = i + 1;
        return product;
      });
      products.forEach((product) =>
        component.checkedProducts.set(product.Id, product)
      );
      spectator.detectComponentChanges();
      expect('.cos-action-bar').toExist();

      // Act
      // component.state.removeProducts(component.checkedProducts);
      store.dispatch(
        new CollectionProductsActions.RemoveSuccess(
          component.state.collection.Id,
          Array.from(component.checkedProducts.keys())
        )
      );
      spectator.tick();
      spectator.detectComponentChanges();

      // Assert
      expect('.cos-action-bar').not.toExist();
      expect(component.checkedProducts.size).toHaveLength(0);
    }));

    it('Tool bar should be hidden when user selects all visible products and delete them individually', fakeAsync(() => {
      // Arrange
      const products = injectProducts.slice(0, 5).map((product, i) => {
        product.Id = i + 1;
        return product;
      });
      const { spectator, component } = testSetup({ products });
      const store = spectator.inject(Store);

      // Act
      component.selectAll({ checked: true });
      spectator.detectComponentChanges();
      const currentCheckedProducts = Array.from(
        component.checkedProducts.keys()
      );
      expect(currentCheckedProducts).toHaveLength(products.length);
      expect(component.state.products.Results).toHaveLength(
        currentCheckedProducts.length
      );
      expect('.cos-action-bar').toExist();

      // component.state.removeProducts(component.checkedProducts);
      store.dispatch(
        new CollectionProductsActions.RemoveSuccess(
          component.state.collection.Id,
          Array.from(component.checkedProducts.keys())
        )
      );
      spectator.tick();
      spectator.detectComponentChanges();

      // Assert
      expect('.cos-action-bar').not.toExist();
    }));

    it('Checkbox should be selected when all visible products are selected', fakeAsync(() => {
      const { spectator, component } = testSetup({});
      spectator.tick();
      const products = injectProducts.slice(0, 5).map((product, i) => {
        product.Id = i;
        return product;
      });
      component.state.products.Results = products;
      component.selectAll({ checked: true });
      spectator.detectComponentChanges();
      expect(Array.from(component.checkedProducts.keys())).toHaveLength(
        products.length
      );
      const checkboxIcon = spectator.query(
        'cos-checkbox.checkbox-products > label > div.cos-checkbox-inner-container > div.cos-checkbox-background > i'
      );
      expect(checkboxIcon).toExist();
      expect(checkboxIcon).toHaveClass([
        'cos-checkbox-checkmark',
        'fa fa-check',
      ]);
    }));

    it('Checkbox should be displayed as: - when some of the visible products are selected', fakeAsync(() => {
      const { spectator, component } = testSetup({});
      spectator.tick();
      const products = injectProducts.slice(0, 5).map((product, i) => {
        product.Id = i;
        return product;
      });
      component.state.products.Results = products;
      const slicedProducts = products.slice(0, 3);
      slicedProducts.forEach((product) => {
        component.checkedProducts.set(product.Id, product);
      });
      spectator.detectComponentChanges();
      const currentCheckedProducts = Array.from(
        component.checkedProducts.keys()
      );
      expect(currentCheckedProducts).toHaveLength(3);
      expect(currentCheckedProducts.length).toBeLessThan(
        component.state.products.Results.length
      );
      const checkbox = spectator.query('cos-checkbox.checkbox-products');
      expect(checkbox).toExist();
      expect(checkbox).toHaveClass('cos-checkbox-indeterminate');
    }));

    it('Selecting checkbox from tool bar should select all visible products', () => {
      const { component, spectator } = testSetup();
      const products = injectProducts.slice(0, 5).map((product, i) => {
        product.Id = i;
        return product;
      });
      component.state.products.Results = products;
      spectator.detectChanges();
      component.selectAll({ checked: true });
      spectator.detectChanges();
      expect(Array.from(component.checkedProducts.keys())).toHaveLength(
        component.state.products.Results.length
      );
    });

    it('Unselecting checkbox from tool bar should unselect all products all selected', () => {
      const { component, spectator } = testSetup();
      const products = injectProducts.slice(0, 1).map((prouct, i) => {
        prouct.Id = i;
        return prouct;
      });
      component.state.products.Results = products;
      spectator.detectChanges();
      component.selectAll({ checked: true });
      spectator.detectChanges();
      expect(component.checkedProducts.size).toHaveLength(
        component.state.products.Results.length
      );
      component.selectAll({ checked: false });
      spectator.detectChanges();
      expect(component.checkedProducts.size).toHaveLength(0);
    });

    it('Tool bar should be hidden when user unselects all products using unselect checkbox', () => {
      // Arrange
      const products = injectProducts.slice(0, 1).map((product, i) => {
        product.Id = i + 1;
        return product;
      });
      const { spectator, component } = testSetup({ products });

      // Act
      component.selectAll({ checked: true });
      spectator.detectComponentChanges();
      expect('.cos-action-bar').toExist();

      component.selectAll({ checked: false });
      spectator.detectComponentChanges();

      // Assert
      expect('.cos-action-bar').not.toExist();
    });

    it('Tool bar should be hidden once user selects products and performs Remove from collection', fakeAsync(() => {
      const { spectator, component } = testSetup({});
      spectator.tick();
      const products = injectProducts.slice(0, 5).map((product, i) => {
        product.Id = i;
        return product;
      });
      products
        .slice(0, 3)
        .forEach((product) =>
          component.checkedProducts.set(product.Id, product)
        );
      spectator.detectComponentChanges();
      let toolbar = spectator.query('.cos-action-bar');
      expect(toolbar).toExist();
      component.state.delete(Array.from(component.checkedProducts.keys()));
      spectator.detectComponentChanges();
      component.checkedProducts.clear();
      spectator.detectComponentChanges();
      toolbar = spectator.query('.cos-action-bar');
      expect(toolbar).not.toExist();
    }));

    it('Selections should be removed and tool bar should be hidden when user navigates away from and come back to current page again', () => {
      const { component, spectator } = testSetup();
      const toolbar = spectator.query('.cos-action-bar');
      expect(toolbar).not.toExist();
      expect(component.checkedProducts.size).toHaveLength(0);
    });

    it('Tool bar should not be displayed when there are no products added to the collection', fakeAsync(() => {
      const { spectator, component } = testSetup();
      spectator.tick();
      component.state.products.Results = [];
      spectator.detectComponentChanges();
      const toolbar = spectator.query('.cos-action-bar');
      expect(toolbar).not.toExist();
    }));
  });

  // it('Max limit error toast should be displayed when user tries to add more than 250 products to a collection from collection detail page', () => {
  //   const { component, spectator } = testSetup();
  //   const maxProductsLength = 250;
  //   const toastService = spectator.inject(CosToastService, true);
  //   const errorSpy = jest.spyOn(toastService, 'error').mockImplementation();
  //   component.checkedProducts.length = 253;
  //   component.addToCollection();
  //   expect(errorSpy).toHaveBeenCalledWith(
  //     'Error: Too Many Products!',
  //     `${component.checkedProducts.length} product(s) were unable to be added. ${maxProductsLength} product per collection limit reached.`
  //   );
  // });

  it('Selecting all products should not include the count of the unavailable product on action bar', () => {
    const { spectator, component } = testSetup();
    //Arrange
    const productsSelected = injectProducts.slice(0, 5);
    productsSelected[0].IsDeleted = true;
    productsSelected[1].IsDeleted = true;
    component.state.products.Results = productsSelected;

    //Act
    component.selectAll({ checked: true });
    spectator.detectComponentChanges();

    //Assert
    const selectedProductsLabel = spectator.query(
      'cos-checkbox.checkbox-products > label > span.cos-checkbox-label'
    );
    expect(selectedProductsLabel).toExist();
    expect(selectedProductsLabel).toHaveText(
      `${component.checkedProducts.size} Product Selected`
    );
  });

  it('should start create presentation flow with checked products', () => {
    const { spectator, component } = testSetup();
    const flow = spectator.inject(AddToPresentationFlow, true);
    const flowSpy = jest.spyOn(flow, 'start');

    component.addToPresentation();
    expect(flowSpy).toHaveBeenCalledWith({
      checkedProducts: component.checkedProducts,
    });
  });
});
