import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CosAnalyticsService, TrackEvent } from '@cosmos/analytics';
import { CosToastService } from '@cosmos/components/notification';
import { CollectionsService } from '@esp/collections';
import { CollectionMockDb } from '@esp/collections/mocks';
import { CollectionCreateEvent } from '@esp/products';
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
  SpyObject,
} from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { ProductsMockDb } from '@smartlink/products/mocks';
import { Observable, of } from 'rxjs';
import { CollectionsDialogService } from './collections-dialog.service';

const mockCollection = CollectionMockDb.Collections[0];

describe('CollectionsModalService', () => {
  let spectator: SpectatorService<CollectionsDialogService>;
  const products = ProductsMockDb.products;
  let toastService: SpyObject<CosToastService>;
  let analyticsService: SpyObject<CosAnalyticsService>;
  let errorSpy: jest.SpyInstance;
  let successSpy: jest.SpyInstance;
  let fnTrackStatEvent: jest.SpyInstance;

  const createService = createServiceFactory({
    service: CollectionsDialogService,
    imports: [MatDialogModule, MatSnackBarModule, NgxsModule.forRoot()],
    providers: [
      mockProvider(CosToastService),
      mockProvider(CosAnalyticsService),
    ],
    mocks: [CollectionsService, MatDialog],
  });

  function mockDialogAfterClosed<T>(afterClosedReturnValue: Observable<T>) {
    const dialog = spectator.inject(MatDialog);
    dialog.open.mockReturnValue(<any>{
      afterClosed: () => afterClosedReturnValue,
    });
  }

  beforeEach(() => {
    spectator = createService();
    toastService = spectator.inject(
      CosToastService
    ) as SpyObject<CosToastService>;
    analyticsService = spectator.inject(
      CosAnalyticsService
    ) as SpyObject<CosAnalyticsService>;
    errorSpy = jest.spyOn(toastService, 'error').mockImplementation();
    successSpy = jest.spyOn(toastService, 'success').mockImplementation();
    fnTrackStatEvent = jest
      .spyOn(analyticsService, 'track')
      .mockImplementation();
  });

  it('should create', () => {
    expect(spectator.service).toBeTruthy();
  });

  it('should open add dialog', () => {
    const collectionsService = spectator.inject(CollectionsService);
    collectionsService.query.mockReturnValue(of({ ResultsTotal: 1 }));
    const spy = jest
      .spyOn(spectator.service, 'openAddDialog')
      .mockImplementation();
    spectator.service
      .addToCollection(products)
      .subscribe((result) => console.log(result));
    expect(spy).toHaveBeenCalled();
  });

  it('should open create dialog', () => {
    mockDialogAfterClosed(of('create'));
    spectator.service
      .openAddDialog(products)
      .subscribe((res) => expect(res).toBeTruthy());
  });

  it('should add products', () => {
    mockDialogAfterClosed(of({ Id: 100 }));
    const service = spectator.inject(CollectionsService);
    service.addProducts.mockReturnValue(
      of(<any>{ NumberOfDuplicatesRemoved: 0 })
    );
    spectator.service
      .openAddDialog(products)
      .subscribe((res) =>
        expect(res).toMatchObject({ NumberOfDuplicatesRemoved: 0 })
      );
  });

  it('should add products error', () => {
    mockDialogAfterClosed(of({ Id: 100 }));
    const service = spectator.inject(CollectionsService);
    service.addProducts.mockReturnValue(
      of(<any>{ NumberOfDuplicatesRemoved: 1 })
    );
    spectator.service
      .openAddDialog(products)
      .subscribe((res) =>
        expect(res).toMatchObject({ NumberOfDuplicatesRemoved: 1 })
      );
  });

  it('Product should not be added to a collection when it already exists in the selected collection with a different image', () => {
    mockDialogAfterClosed(of({ Id: 100, ImageUrl: 'media/123456789' }));
    const service = spectator.inject(CollectionsService);
    service.addProducts.mockReturnValue(
      of(<any>{ NumberOfDuplicatesRemoved: 1 })
    );
    spectator.service
      .openAddDialog(products)
      .subscribe((res) =>
        expect(res).toMatchObject({ NumberOfDuplicatesRemoved: 1 })
      );
  });

  it('Clicking Add to collection option should take user to the Create new collection modal when there are no existing active collections', () => {
    mockDialogAfterClosed(of('create'));
    spectator.service
      .openCreateDialog({ products })
      .subscribe((res) => expect(res).toBeTruthy());
  });

  it('Duplicate products should not be added to a collection when multiple products are selected such that all products already exists in the target collection', () => {
    const duplicateProductsCount = 3;
    mockDialogAfterClosed(of({ Id: 100 }));
    const service = spectator.inject(CollectionsService);
    service.addProducts.mockReturnValue(
      of(<any>{ NumberOfDuplicatesRemoved: duplicateProductsCount })
    );
    spectator.service.openAddDialog(products).subscribe((res) =>
      expect(res).toMatchObject({
        NumberOfDuplicatesRemoved: duplicateProductsCount,
      })
    );
    spectator.service
      .openAddDialog(products)
      .subscribe((res) => expect(errorSpy).toHaveBeenCalled());
  });

  it('All selected products should be added successfully when user selects and add products from a single page', () => {
    const duplicateProductsCount = 0;
    mockDialogAfterClosed(of({ Id: 100 }));
    const service = spectator.inject(CollectionsService);
    service.addProducts.mockReturnValue(
      of(<any>{ NumberOfDuplicatesRemoved: duplicateProductsCount })
    );
    spectator.service.openAddDialog(products).subscribe((res) =>
      expect(res).toMatchObject({
        NumberOfDuplicatesRemoved: duplicateProductsCount,
      })
    );
    spectator.service
      .openAddDialog(products)
      .subscribe((res) => expect(successSpy).toHaveBeenCalled());
  });

  it("Success Toast displayed as 'Success: Collection copied!' with Subtext: 'Collection [Collection name] was copied!'", () => {
    const collection = { Id: 12, Name: 'old collection' };
    mockDialogAfterClosed(of(collection));
    const service = spectator.inject(CollectionsService);
    service.copy.mockReturnValue(of({ Id: 14, Name: 'Collection' }));
    spectator.service.openCreateDialog({ collection }).subscribe((res) => {
      expect(successSpy).toHaveBeenCalledTimes(1);
      expect(successSpy).toHaveBeenCalledWith(
        'Success: Collection copied',
        `Collection ${collection.Name} was copied`
      );
    });
  });
  it("Error toast should be displayed when collection is not copied with text 'Error: Collection not copied' with Subtext: 'Collection [collection name] was not able to be copied'", () => {
    const collection = { Id: 12, Name: 'old collection' };
    mockDialogAfterClosed(of(collection));
    const service = spectator.inject(CollectionsService);
    service.copy.mockImplementation(() => {
      throw new Error('Network Error');
    });
    spectator.service.openCreateDialog({ collection }).subscribe((res) => {
      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenCalledWith(
        'Error: Collection not copied',
        `Collection ${collection.Name} was not able to be copied`
      );
    });
  });

  it("Success Toast displayed as Title 'Success: Collection created!', with subtext Subtext 'Your collection [collection name] has been created' after the successfull creation of collection", () => {
    const collection = { Id: 12, Name: 'old collection' };
    mockDialogAfterClosed(of(collection));
    const service = spectator.inject(CollectionsService);
    service.create.mockReturnValue(of(collection));
    spectator.service.openCreateDialog({}).subscribe((res) => {
      expect(successSpy).toHaveBeenCalledTimes(1);
      expect(successSpy).toHaveBeenCalledWith(
        'Success: Collection created!',
        `Your collection ${collection.Name} has been created.`
      );
    });
  });

  it('Collection Name in the subtext of the collection success toast should be correct when user does not update the collection name while creating a collection', () => {
    const collection = { Id: 12, Name: 'New Collection' };
    mockDialogAfterClosed(of(collection));
    const service = spectator.inject(CollectionsService);
    service.create.mockReturnValue(of(collection));
    spectator.service.openCreateDialog({}).subscribe((res) => {
      expect(successSpy).toHaveBeenCalledTimes(1);
      expect(successSpy).toHaveBeenCalledWith(
        'Success: Collection created!',
        `Your collection ${collection.Name} has been created.`
      );
    });
  });

  it('Collection Name in the subtext of the collection toast should be correctly displayed when user enters maximum character limit in the Collection Name field and creates a collection', () => {
    const collection = {
      Id: 12,
      Name: '@#$%^!&*^%$#%^&*abc*&^%$#@(123&!@#$%^&*()(*&^%$#@!',
    };
    mockDialogAfterClosed(of(collection));
    const service = spectator.inject(CollectionsService);
    service.create.mockReturnValue(of(collection));
    spectator.service.openCreateDialog({}).subscribe((res) => {
      expect(successSpy).toHaveBeenCalledTimes(1);
      expect(successSpy).toHaveBeenCalledWith(
        'Success: Collection created!',
        `Your collection ${collection.Name} has been created.`
      );
    });
  });

  it('Collection Name in the subtext of the collection toast should be correctly displayed when user enters combination of alpha numeric and special characters in the Collection Name field and creates a collection', () => {
    const collection = {
      Id: 12,
      Name: 'abc@test123',
    };
    mockDialogAfterClosed(of(collection));
    const service = spectator.inject(CollectionsService);
    service.create.mockReturnValue(of(collection));
    spectator.service.openCreateDialog({}).subscribe((res) => {
      expect(successSpy).toHaveBeenCalledTimes(1);
      expect(successSpy).toHaveBeenCalledWith(
        'Success: Collection created!',
        `Your collection ${collection.Name} has been created.`
      );
    });
  });

  it('Success Toast should not be displayed when collection is not created due to some reason', () => {
    const collection = { Id: 12, Name: 'old collection' };
    mockDialogAfterClosed(of(collection));
    const service = spectator.inject(CollectionsService);
    service.create.mockImplementation(() => {
      throw new Error('Network Error');
    });
    spectator.service.openCreateDialog({}).subscribe((res) => {
      expect(successSpy).not.toHaveBeenCalled();
    });
  });

  it("Error Toast should be displayed as Title 'Error: Collection not created!', with Subtext 'Your collection [collection name] was not able to be created' when collection is not created due to some reason", () => {
    const collection = { Id: 12, Name: 'old collection' };
    mockDialogAfterClosed(of(collection));
    const service = spectator.inject(CollectionsService);
    service.create.mockImplementation(() => {
      throw new Error('Network Error');
    });
    spectator.service.openCreateDialog({}).subscribe((res) => {
      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenCalledWith(
        'Error: Collection not created!',
        `Your collection was not able to be created.`
      );
    });
  });

  it('Success toast correctly displayed when single product added to the collection as "Products added!" with subtext: "1 product(s) added to [Collection Name]!"', () => {
    mockDialogAfterClosed(of(mockCollection));
    const service = spectator.inject(CollectionsService);
    service.addProducts.mockReturnValue(
      of(<any>{
        Collection: mockCollection,
        NumberOfDuplicatesRemoved: 0,
      })
    );
    spectator.service
      .openAddDialog([products[0]], mockCollection.Id)
      .subscribe((res) => {
        expect(successSpy).toHaveBeenCalledTimes(1);
        expect(successSpy).toHaveBeenCalledWith(
          'Success: Products added!',
          `1 product(s) added to ${mockCollection?.Name}!`
        );
      });
  });

  it("Success toast correctly displayed when N products added to the collection as 'Products added!' with subtext: 'N product(s) added to [Collection Name]!'", () => {
    const addedProducts = products.slice(4);
    mockDialogAfterClosed(of(mockCollection));
    const service = spectator.inject(CollectionsService);
    service.addProducts.mockReturnValue(
      of(<any>{
        Collection: mockCollection,
        NumberOfDuplicatesRemoved: 0,
      })
    );
    spectator.service
      .openAddDialog(addedProducts, mockCollection.Id)
      .subscribe((res) => {
        expect(successSpy).toHaveBeenCalledTimes(1);
        expect(successSpy).toHaveBeenCalledWith(
          'Success: Products added!',
          `${addedProducts.length} product(s) added to ${mockCollection?.Name}!`
        );
      });
  });

  it("Error toast displayed when products more than 250 products being added to a collection as 'Error: Too Many Products!' with subtext '[Number not added] product(s) were unable to be added. 250 product per collection limit reached.'", () => {
    const numberOfProductsTruncated = 10;
    mockDialogAfterClosed(of(mockCollection));
    const service = spectator.inject(CollectionsService);
    service.addProducts.mockReturnValue(
      of(<any>{
        Collection: mockCollection,
        NumberOfProductsTruncated: numberOfProductsTruncated,
      })
    );
    spectator.service
      .openAddDialog(products, mockCollection.Id)
      .subscribe((res) => {
        expect(errorSpy).toHaveBeenCalledTimes(1);
        expect(errorSpy).toHaveBeenCalledWith(
          'Error: Too Many Products!',
          `${numberOfProductsTruncated} product(s) were unable to be added. 250 product per collection limit reached.`
        );
      });
  });

  it("Error toast displayed when user tries to add product that already exists in a collection as Title 'Error: Products not added!' with subtext: '[Number not added] product(s) already exist in [Collection Name]'", () => {
    const numberOfDuplicatesRemoved = 10;
    mockDialogAfterClosed(of(mockCollection));
    const service = spectator.inject(CollectionsService);
    service.addProducts.mockReturnValue(
      of(<any>{
        Collection: mockCollection,
        NumberOfDuplicatesRemoved: numberOfDuplicatesRemoved,
      })
    );
    spectator.service
      .openAddDialog(products, mockCollection.Id)
      .subscribe((res) => {
        expect(errorSpy).toHaveBeenCalledTimes(1);
        expect(errorSpy).toHaveBeenCalledWith(
          'Error: Products not added!',
          `${numberOfDuplicatesRemoved} product(s) already exist in ${mockCollection.Name}!`
        );
      });
  });

  it("Error toast should be displayed when for some reason products are not added as 'Error: Products not added!' with subtext: '[Number not added] product(s) were unable to be added to [Collection Name]!'", () => {
    mockDialogAfterClosed(of(mockCollection));
    const service = spectator.inject(CollectionsService);
    service.addProducts.mockReturnValue(
      of(<any>{
        Collection: mockCollection,
        error: 'something went wrong',
      })
    );
    spectator.service
      .openAddDialog(products, mockCollection.Id)
      .subscribe((res) => {
        expect(errorSpy).toHaveBeenCalledTimes(1);
        expect(errorSpy).toHaveBeenCalledWith(
          'Error: Products not added!',
          `${products.length} product(s) were unable to be added to ${mockCollection.Name}!`
        );
      });
  });

  it("'Collection Created' stat should be captured when a collection is copied.", () => {
    const source = { Id: 1, Name: 'old collection' };
    const collection = { Id: 2, Name: 'new collection' };
    mockDialogAfterClosed(of(source));
    const service = spectator.inject(CollectionsService);
    service.copy.mockReturnValue(of(collection));

    const stat: TrackEvent<CollectionCreateEvent> = {
      action: 'Collection Created',
      properties: {
        id: collection.Id,
        name: collection.Name,
        source: { id: source.Id },
      },
    };

    spectator.service
      .openCreateDialog({ collection: source })
      .subscribe((res) => {
        expect(fnTrackStatEvent).toHaveBeenCalledWith(stat);
      });
  });

  it("'Collection Created' stat should be captured when a new collection is created.", () => {
    const collection = { Id: 1, Name: 'new collection' };
    mockDialogAfterClosed(of(collection));
    const service = spectator.inject(CollectionsService);
    service.create.mockReturnValue(of(collection));

    const stat: TrackEvent<CollectionCreateEvent> = {
      action: 'Collection Created',
      properties: {
        id: collection.Id,
        name: collection.Name,
      },
    };

    spectator.service.openCreateDialog({}).subscribe((res) => {
      expect(fnTrackStatEvent).toHaveBeenCalledWith(stat);
    });
  });
});
