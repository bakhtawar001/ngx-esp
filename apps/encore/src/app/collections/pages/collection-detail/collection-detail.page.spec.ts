// tslint:disable: nx-enforce-module-boundaries
import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { fakeAsync } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { InitialsPipe } from '@cosmos/common';
import {
  CosAvatarListComponent,
  CosAvatarListModule,
} from '@cosmos/components/avatar-list';
import { CosConfirmDialog } from '@cosmos/components/confirm-dialog';
import {
  CosEmojiMenuComponent,
  CosEmojiMenuModule,
} from '@cosmos/components/emoji-menu';
import {
  CosInlineEditComponent,
  CosInlineEditModule,
} from '@cosmos/components/inline-edit';
import { CosToastService } from '@cosmos/components/notification';
import { AppSettingsModule } from '@cosmos/core';
import { AuthFacade } from '@esp/auth';
import {
  Collection,
  CollectionProductSearchResultItem,
  CollectionsService,
  CollectionStatus,
  EspCollectionsModule,
} from '@esp/collections';
import { CollectionMockDb } from '@esp/collections/mocks';
import { AccessLevel } from '@esp/models';
import { SortOption } from '@esp/search';
import {
  byText,
  createComponentFactory,
  mockProvider,
} from '@ngneat/spectator/jest';
import { NgxsModule } from '@ngxs/store';
import { ProductsMockDb } from '@smartlink/products/mocks';
import { MockComponents } from 'ng-mocks';
import { of } from 'rxjs';
import { CollaboratorsDialogService } from '@asi/collaborators/ui/feature-core';
import { productSortOptions } from '../../configs';
import { CollectionsDialogService } from '../../services';
import { CollectionSearchPage } from '../collection-search';
import { CollectionDetailLocalState } from './collection-detail.local-state';
import {
  CollectionDetailPage,
  CollectionDetailPageModule,
} from './collection-detail.page';

const mockCollection = CollectionMockDb.Collections[0];
const injectProducts = ProductsMockDb.products.slice(0, 5);

function buildCollection(options?: {
  explicit?: Partial<Collection>;
  isReadOnly?: boolean;
}) {
  const collection: Collection = {
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

describe('CollectionDetailPage', () => {
  let collectionsDialogService: CollectionsDialogService;
  let spyFn: jest.SpyInstance;

  const createComponent = createComponentFactory({
    component: CollectionDetailPage,
    imports: [
      HttpClientTestingModule,
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

      AppSettingsModule,
      EspCollectionsModule,

      CollectionDetailPageModule,
    ],
    providers: [
      mockProvider(CollectionDetailLocalState, {
        connect() {
          return of(this);
        },
      }),
      mockProvider(CollectionsService, {
        searchProducts: jest.fn(() => of([])),
        searchRecent: jest.fn(() => of([])),
      }),
      mockProvider(CollectionsDialogService),
      mockProvider(CosToastService),
      InitialsPipe,
      mockProvider(AuthFacade, {
        user: {},
        profile$: of({}),
      }),
      mockProvider(Location),
    ],
    overrideModules: [
      [
        CosEmojiMenuModule,
        {
          set: {
            declarations: MockComponents(CosEmojiMenuComponent),
            exports: MockComponents(CosEmojiMenuComponent),
          },
        },
      ],
      [
        CosInlineEditModule,
        {
          set: {
            declarations: MockComponents(CosInlineEditComponent),
            exports: MockComponents(CosInlineEditComponent),
          },
        },
      ],
      [
        CosAvatarListModule,
        {
          set: {
            declarations: MockComponents(CosAvatarListComponent),
            exports: MockComponents(CosAvatarListComponent),
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
        mockProvider(CollectionDetailLocalState, <
          Partial<CollectionDetailLocalState>
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
          isLoading: false,
          hasLoaded: true,
          canEdit: false,
          search: jest.fn(() => of()),
        }),
      ],
    });

    const router = spectator.inject(Router);

    jest.spyOn(router, 'navigate').mockResolvedValue(true);
    jest.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

    const location = spectator.inject(Location);
    jest.spyOn(location, 'back');

    return { spectator, component: spectator.component };
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    const { component } = testSetup();

    expect(component).toBeTruthy();
  });

  it('should change emoji', () => {
    const { component } = testSetup();
    const randomImage = 'https://imageserver.com/test-image32423';

    component.emoji = randomImage;

    expect(component.collectionForm.get('Emoji').value).toBe(randomImage);
  });

  it('should set description', () => {
    const { component } = testSetup();

    component.setDescription({ value: 'test' });
    const value = component.collectionForm.get('Description').value;
    expect(value).toEqual('test');
  });

  it('should set name', () => {
    const { component } = testSetup();

    component.setName({ value: 'test' });
    const value = component.collectionForm.get('Name').value;
    expect(value).toEqual('test');
  });

  // Need to set up store to have product results before you can test like this, will always fail otherwise
  // xit('should select all products', () => {
  //   component.selectAll({ checked: true });
  //   expect(component.checkedProducts.length).toEqual(0);
  // });
  it("Global three dot menu and 'Use in Presentation' buttons at the top should get enabled when there are no products selected", fakeAsync(() => {
    const { component, spectator } = testSetup();
    spectator.tick();

    component.checkedProducts.clear();
    expect(component.checkedProducts.size).toEqual(0);

    const actionsBtn = spectator.query('.mat-menu-trigger.actions-button');
    expect(actionsBtn).toExist();
    spectator.click(actionsBtn);
    spectator.tick(200);
    //Assert
    expect('.use-collection-in-presentation').toExist();
  }));

  it('Transfer ownership option should not be available to the user with view only permission when user clicks at the three dot menu on the collection landing page of a collection', fakeAsync(() => {
    const { component, spectator } = testSetup();

    spectator.tick();

    const authfacade = spectator.inject(AuthFacade, true);
    authfacade.user.IsAdmin = false;

    const actionsBtn = spectator.query('.mat-menu-trigger.actions-button');
    expect(actionsBtn).toExist();

    spectator.click(actionsBtn);
    spectator.tick(200); // animations?
    expect('.transfer-collection').not.toExist();
  }));

  it('An owner should be displayed with following options under the three dot menu of a collection at collection detail page: Add to Presentation, Add to Order, Transfer Ownership, Archive/Make Active, Duplicate Collection, Delete', fakeAsync(() => {
    const { spectator, component } = testSetup();

    spectator.tick();

    const authfacade = spectator.inject(AuthFacade, true);
    authfacade.user.Id = component.state.collection.OwnerId;
    component.state.canEdit = true;
    const actionsBtn = spectator.query('.mat-menu-trigger.actions-button');
    expect(actionsBtn).toExist();
    expect(actionsBtn.tagName).toBe('BUTTON');
    spectator.click(actionsBtn);
    spectator.tick(200);
    const menuPanel = spectator.query('.mat-menu-content');
    expect(menuPanel).toExist();
    expect(menuPanel.children[0]).toHaveText('Add to Presentation');
    expect(menuPanel.children[1]).toHaveText('Add to Order');
    expect(menuPanel.children[2]).toHaveText('Transfer ownership');
    expect(menuPanel.children[3]).toHaveText('Archive');
    expect(menuPanel.children[4]).toHaveText('Duplicate Collection');
    expect(menuPanel.children[5]).toHaveText('Delete');
  }));

  it('An admin should be displayed with the following options under the three dot menu of a collection: Add to Presentation, Add to Order, Transfer Ownership, Archive/Make Active, Duplicate Collection, Delete', fakeAsync(() => {
    const { spectator, component } = testSetup();

    spectator.tick();

    const authfacade = spectator.inject(AuthFacade, true);
    authfacade.user.IsAdmin = true;
    component.state.canEdit = true;
    const actionsBtn = spectator.query('.mat-menu-trigger.actions-button');
    expect(actionsBtn).toExist();
    expect(actionsBtn.tagName).toBe('BUTTON');
    spectator.click(actionsBtn);
    spectator.tick(200);

    expect(component.isAdmin).toBeTruthy();
    const menuPanel = spectator.query('.mat-menu-content');
    expect(menuPanel).toExist();
    expect(menuPanel.children[0]).toHaveText('Add to Presentation');
    expect(menuPanel.children[1]).toHaveText('Add to Order');
    expect(menuPanel.children[2]).toHaveText('Transfer ownership');
    expect(menuPanel.children[3]).toHaveText('Archive');
    expect(menuPanel.children[4]).toHaveText('Duplicate Collection');
    expect(menuPanel.children[5]).toHaveText('Delete');
  }));

  it('Order of the three dot menu items should be: Add to Presentation, Add to Order, Transfer Ownership, Archive/Make Active, Duplicate Collection, Delete', fakeAsync(() => {
    const { spectator, component } = testSetup();

    spectator.tick();

    const authfacade = spectator.inject(AuthFacade, true);
    authfacade.user.IsAdmin = true;
    component.state.canEdit = true;
    const actionsBtn = spectator.query('.mat-menu-trigger.actions-button');
    expect(actionsBtn).toExist();
    expect(actionsBtn.tagName).toBe('BUTTON');
    spectator.click(actionsBtn);
    spectator.tick(200);
    const menuPanel = spectator.query('.mat-menu-content');
    expect(menuPanel).toExist();
    expect(menuPanel.children[0]).toHaveText('Add to Presentation');
    expect(menuPanel.children[1]).toHaveText('Add to Order');
    expect(menuPanel.children[2]).toHaveText('Transfer ownership');
    expect(menuPanel.children[3]).toHaveText('Archive');
    expect(menuPanel.children[4]).toHaveText('Duplicate Collection');
    expect(menuPanel.children[5]).toHaveText('Delete');
  }));

  it('Archive collection three dot menu will display options as: Add to Presentation, Add to Order, Transfer Ownership, Make Active, Duplicate Collection, Delete', fakeAsync(() => {
    const { spectator } = testSetup({
      status: 'Archived',
    });

    spectator.tick();

    const authfacade = spectator.inject(AuthFacade, true);
    authfacade.user.IsAdmin = true;
    const actionsBtn = spectator.query('.mat-menu-trigger.actions-button');
    expect(actionsBtn).toExist();
    expect(actionsBtn.tagName).toBe('BUTTON');
    spectator.click(actionsBtn);
    spectator.tick(200);
    const menuPanel = spectator.query('.mat-menu-content');
    expect(menuPanel).toExist();
    expect(menuPanel.children[0]).toHaveText('Add to Presentation');
    expect(menuPanel.children[1]).toHaveText('Add to Order');
    expect(menuPanel.children[2]).toHaveText('Make Active');
    expect(menuPanel.children[3]).toHaveText('Duplicate Collection');
    expect(menuPanel.children[4]).toHaveText('Delete');
  }));

  it('Delete option should be available on the top three dot menu on Collection detail page', fakeAsync(() => {
    const { spectator, component } = testSetup();

    spectator.tick();

    const authfacade = spectator.inject(AuthFacade, true);
    authfacade.user.IsAdmin = true;
    component.state.canEdit = true;
    const actionsBtn = spectator.query('.mat-menu-trigger.actions-button');
    expect(actionsBtn).toExist();
    expect(actionsBtn.tagName).toBe('BUTTON');
    spectator.click(actionsBtn);
    spectator.tick(200);
    const menuPanel = spectator.query('.mat-menu-content');
    expect(menuPanel).toExist();
    expect(menuPanel.children[5]).toHaveText('Delete');
  }));

  it("Selecting the 'Delete' option should display warning as 'Are you sure you want to delete this collection?' with options 'Yes, remove this collection', 'No, do not delete'", fakeAsync(() => {
    const { spectator, component } = testSetup();
    const dialog = spectator.inject(MatDialog, true);
    spectator.tick();

    const authfacade = spectator.inject(AuthFacade, true);
    authfacade.user.IsAdmin = true;
    component.state.canEdit = true;
    const actionsBtn = spectator.query('.mat-menu-trigger.actions-button');
    expect(actionsBtn).toExist();
    expect(actionsBtn.tagName).toBe('BUTTON');
    spectator.click(actionsBtn);
    spectator.tick(200);
    const menuPanel = spectator.query('.mat-menu-content');
    expect(menuPanel).toExist();
    const spyFn = jest.spyOn(dialog, 'open').mockReturnValue(<any>{
      afterClosed: () => of(true),
    });
    const deleteBtn = menuPanel.children[5];
    expect(deleteBtn).toHaveText('Delete');
    component.delete();
    expect(spyFn).toHaveBeenCalled();
    expect(spyFn).toHaveBeenCalledWith(CosConfirmDialog, {
      minWidth: '400px',
      width: '400px',
      data: {
        message: 'Are you sure you want to delete this collection?',
        confirm: 'Yes, remove this collection',
        cancel: 'No, do not delete',
      },
    });
  }));

  it("Selecting 'No' on the warning message should not delete the collection and user stays on the collection detail page", () => {
    const { component, spectator } = testSetup();
    const service = spectator.inject(CollectionsService, true);
    const dialog = spectator.inject(MatDialog, true);
    const dialogSpyFn = jest.spyOn(dialog, 'open').mockReturnValue(<any>{
      afterClosed: () => of(false),
    });
    const facadeSpyFn = jest.spyOn(service, 'delete');
    component.delete();
    expect(dialogSpyFn).toHaveBeenCalled();
    expect(facadeSpyFn).not.toHaveBeenCalled();
    const router = spectator.inject(Router);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it("Selecting 'Yes' on the warning modal should remove the collection", fakeAsync(() => {
    const { component, spectator } = testSetup();
    spectator.tick();
    const service = spectator.inject(CollectionDetailLocalState, true);
    const dialog = spectator.inject(MatDialog, true);
    const dialogSpyFn = jest.spyOn(dialog, 'open').mockReturnValue(<any>{
      afterClosed: () => of(true),
    });
    const deleteSpy = jest.spyOn(service, 'delete');
    component.delete();
    expect(dialogSpyFn).toHaveBeenCalled();
    expect(deleteSpy).toHaveBeenCalled();
  }));

  it('User should not be able to perform following actions on an archived collection from collection details page: Update icon, Update Name, Update decription, Add products, remove products, Update collaborators and transfer ownership', fakeAsync(() => {
    const { component, spectator } = testSetup({
      status: 'Archived',
    });
    spectator.tick();
    expect(component.state.canEdit).toBeFalsy();
    expect(spectator.query('.manage-collaborators-btn')).not.toExist();
    const actionsBtn = spectator.query('.mat-menu-trigger.actions-button');
    expect(actionsBtn).toExist();
    spectator.click(actionsBtn);
    spectator.tick(200);
    expect(spectator.query('.cos-menu-item.transfer-collection')).not.toExist();
  }));

  it('User should be able to use collection in a presentation from collection detail page', fakeAsync(() => {
    const { spectator } = testSetup({
      status: 'Archived',
    });
    spectator.tick();
    const useCollectionInPresentationBtn = spectator.query(
      '.use-in-presentation-btn'
    );
    expect(useCollectionInPresentationBtn).toExist();
    expect(useCollectionInPresentationBtn).toHaveText('Add to Presentation');
  }));

  it('User should be able to delete an archived collection', fakeAsync(() => {
    const { component, spectator } = testSetup({
      status: 'Archived',
    });
    spectator.tick();
    const service = spectator.inject(CollectionDetailLocalState, true);
    const dialog = spectator.inject(MatDialog, true);
    const dialogSpyFn = jest.spyOn(dialog, 'open').mockReturnValue(<any>{
      afterClosed: () => of(true),
    });

    const actionsBtn = spectator.query('.mat-menu-trigger.actions-button');
    expect(actionsBtn).toExist();
    spectator.click(actionsBtn);
    spectator.tick(200);
    const deleteButton = spectator.query('.cos-menu-item.delete-collection');
    expect(deleteButton).toExist();
    expect(deleteButton).toHaveText('Delete');
    const facadeSpyFn = jest.spyOn(service, 'delete');
    component.delete();
    expect(dialogSpyFn).toHaveBeenCalled();
    expect(facadeSpyFn).toHaveBeenCalled();
  }));

  it('User should be able to delete collection from collections details page', fakeAsync(() => {
    const { component, spectator } = testSetup({
      status: 'Archived',
    });
    spectator.tick();
    const service = spectator.inject(CollectionDetailLocalState, true);
    const dialog = spectator.inject(MatDialog, true);
    const dialogSpyFn = jest.spyOn(dialog, 'open').mockReturnValue(<any>{
      afterClosed: () => of(true),
    });
    const facadeSpyFn = jest.spyOn(service, 'delete');
    const actionsBtn = spectator.query('.mat-menu-trigger.actions-button');
    expect(actionsBtn).toExist();
    spectator.click(actionsBtn);
    spectator.tick(200);
    const deleteButton = spectator.query('.cos-menu-item.delete-collection');
    expect(deleteButton).toExist();
    expect(deleteButton).toHaveText('Delete');
    spectator.click(deleteButton);
    spectator.tick(500);
    expect(dialogSpyFn).toHaveBeenCalled();
    expect(facadeSpyFn).toHaveBeenCalled();
  }));

  describe('Display collaborators', () => {
    it("should display 'Only the owner and admins can edit or view' next to avatar list", fakeAsync(() => {
      const { spectator } = testSetup({
        accessLevel: 'Owner',
        status: 'Archived',
      });
      spectator.tick();
      const collaboratorSettings = spectator.query('.collaborator-settings');
      const displayText = collaboratorSettings.querySelector('p');
      expect(displayText.textContent).toMatch(
        'Only the owner and admins can edit or view'
      );
    }));

    it("Only the owner avatar should be displayed when access level of a collection is set to 'Everyone within the company can view' followed by text 'Anyone within your company can view'", fakeAsync(() => {
      const { spectator } = testSetup({
        status: 'Active',
        accessLevel: 'Everyone',
        isReadOnly: true,
      });
      spectator.tick();
      const collaboratorSettings = spectator.query('.collaborator-settings');
      const displayText = collaboratorSettings.querySelector('p');
      expect(displayText.textContent).toMatch(
        'Anyone within your company can view'
      );
    }));

    it("Only the owner avatar should be displayed when access level of a collection is set to 'Everyone within the company can edit' followed by text 'Anyone within your company can edit'", fakeAsync(() => {
      const { spectator } = testSetup({
        status: 'Active',
        accessLevel: 'Everyone',
        isReadOnly: false,
      });
      spectator.tick();
      const collaboratorSettings = spectator.query('.collaborator-settings');
      const displayText = collaboratorSettings.querySelector('p');
      expect(displayText.textContent).toMatch(
        'Anyone within your company can edit'
      );
    }));

    it('Manage collaborators link should be available for all collections to an Admin', fakeAsync(() => {
      const { spectator, component } = testSetup({
        status: 'Active',
      });
      component.state.canEdit = true;
      spectator.tick();
      const manageCollaboratorsBtn = spectator.query(
        '.manage-collaborators-btn'
      );
      expect(component.state.canEdit).toBeTruthy();
      expect(manageCollaboratorsBtn).toExist();
      expect(manageCollaboratorsBtn).toHaveText('Manage');
    }));

    it('Manage collaborators link should be available for the owner of a Collection', fakeAsync(() => {
      const { component, spectator } = testSetup({
        accessLevel: 'Owner',
      });
      component.state.canEdit = true;
      spectator.tick();
      const manageCollaboratorsBtn = spectator.query(
        '.manage-collaborators-btn'
      );
      expect(component.state.canEdit).toBeTruthy();
      expect(manageCollaboratorsBtn).toExist();
      expect(manageCollaboratorsBtn).toHaveText('Manage');
    }));

    it('Manage Collaborators link should be available for the user with Edit rights', fakeAsync(() => {
      const { component, spectator } = testSetup({
        status: 'Active',
        isReadOnly: false,
        accessLevel: 'Everyone',
      });
      component.state.canEdit = true;
      spectator.tick();
      const manageCollaboratorsBtn = spectator.query(
        '.manage-collaborators-btn'
      );
      expect(component.state.collection.IsEditable).toBeTruthy();
      expect(component.state.canEdit).toBeTruthy();
      expect(component.state.collection.Access[0].AccessType).toEqual(
        'ReadWrite'
      );
      expect(manageCollaboratorsBtn).toExist();
      expect(manageCollaboratorsBtn).toHaveText('Manage');
    }));

    it('Manage Collaborators link shoud not be available for the user having View Only rights for a collection', fakeAsync(() => {
      const { component, spectator } = testSetup({
        status: 'Active',
        isReadOnly: true,
      });
      spectator.tick();
      const manageCollaboratorsBtn = spectator.query(
        '.manage-collaborators-btn'
      );
      expect(component.state.collection.IsEditable).toBeFalsy();
      expect(component.state.collection.Access[0].AccessType).toEqual('Read');
      expect(component.state.canEdit).toBeFalsy();
      expect(manageCollaboratorsBtn).not.toExist();
    }));

    it('Manage Collaborators link should not be available for the user having no access', fakeAsync(() => {
      const { component, spectator } = testSetup({
        status: 'Active',
        isReadOnly: true,
      });
      spectator.tick();
      const manageCollaboratorsBtn = spectator.query(
        '.manage-collaborators-btn'
      );
      expect(component.state.collection.IsEditable).toBeFalsy();
      expect(component.state.collection.Access[0].AccessType).toBe('Read');
      expect(component.state.canEdit).toBeFalsy();
      expect(manageCollaboratorsBtn).not.toExist();
    }));
  });

  describe('Actions', () => {
    let spyFn: jest.SpyInstance;

    it('should copy collection', fakeAsync(() => {
      const { component, spectator } = testSetup();
      spectator.tick();
      collectionsDialogService = spectator.inject(
        CollectionsDialogService,
        true
      );
      spyFn = jest
        .spyOn(collectionsDialogService, 'openCreateDialog')
        .mockReturnValue(of({ Id: 1, Name: 'Collection' }));
      component.copy();
      expect(spyFn).toHaveBeenCalled();
    }));

    it("Clicking at the 'Transfer Ownership' option from Collections Detail page should load the Transfer ownership modal", fakeAsync(() => {
      const { component, spectator } = testSetup();
      spectator.tick();
      const collaboratorsDialogService = spectator.inject(
        CollaboratorsDialogService,
        true
      );
      spyFn = jest
        .spyOn(collaboratorsDialogService, 'openTransferOwnershipDialog')
        .mockReturnValue(of(<any>{ test: 'success' }));
      component.transferOwnership();
      expect(spyFn).toHaveBeenCalled();
    }));
  });

  it("Manage Collaborators modal should be displayed when an owner clicks on the 'Manage Collaborators' link", fakeAsync(() => {
    const { component, spectator } = testSetup();
    spectator.tick();
    const collaboratorsDialogService = spectator.inject(
      CollaboratorsDialogService,
      true
    );
    const service = spectator.inject(CollectionDetailLocalState, true);
    const saveSpyFn = jest.spyOn(service, 'save');
    const dialogSpy = jest
      .spyOn(collaboratorsDialogService, 'openManageCollaboratorsDialog')
      .mockReturnValue(of(<any>{ test: 'success' }));
    const authFacade = spectator.inject(AuthFacade, true);
    authFacade.user.Id = component.state.collection.OwnerId;
    expect(component.userId).toEqual(component.state.collection.OwnerId);
    component.manageCollaborators();
    expect(dialogSpy).toHaveBeenCalledWith({
      entity: component.state.collection,
      isOnlyReadWrite: false,
    });
    expect(saveSpyFn).toHaveBeenCalled();
  }));

  it("Manage Collaborators modal should be displayed when an admin clicks on the 'Manage Collaborators' link", fakeAsync(() => {
    const { component, spectator } = testSetup();
    spectator.tick();
    const collaboratorsDialogService = spectator.inject(
      CollaboratorsDialogService,
      true
    );
    const dialogSpy = jest
      .spyOn(collaboratorsDialogService, 'openManageCollaboratorsDialog')
      .mockReturnValue(of(<any>{ test: 'success' }));
    const authFacade = spectator.inject(AuthFacade, true);
    authFacade.user.IsAdmin = true;
    expect(component.isAdmin).toBeTruthy();
    component.manageCollaborators();
    expect(dialogSpy).toHaveBeenCalledWith({
      entity: component.state.collection,
      isOnlyReadWrite: false,
    });
  }));

  it('Manage Collaborators modal should be displayed when a non admin user with edit rights clicks on the Manage Collaborators link.', fakeAsync(() => {
    const { component, spectator } = testSetup();
    spectator.tick();
    const collaboratorsDialogService = spectator.inject(
      CollaboratorsDialogService,
      true
    );
    const dialogSpy = jest
      .spyOn(collaboratorsDialogService, 'openManageCollaboratorsDialog')
      .mockReturnValue(of(<any>{ test: 'success' }));
    const authFacade = spectator.inject(AuthFacade, true);
    authFacade.user.IsAdmin = false;
    expect(component.isAdmin).toBeFalsy();
    component.manageCollaborators();
    expect(dialogSpy).toHaveBeenCalledWith({
      entity: component.state.collection,
      isOnlyReadWrite: false,
    });
  }));

  it("'Back To Collections' link is displayed on collection detail page of a new collection", fakeAsync(() => {
    const { spectator } = testSetup();
    spectator.component.backToNavigationName = 'Back to Collections';
    spectator.tick();
    spectator.detectChanges();
    const backLink = spectator.query('.back-to-collections-link');
    expect(backLink).toExist();
    expect(backLink.tagName).toBe('A');
    expect(backLink).toHaveText('Back to Collections');
  }));

  it("'Back To Collections' link should not display when none provided.", fakeAsync(() => {
    const { spectator } = testSetup();
    spectator.tick();
    spectator.detectChanges();
    const backLink = spectator.query('.back-to-collections-link');
    expect(backLink).toBeFalsy();
  }));

  it('Clicking link redirects user to the Collections Landing page when a new collection is created from Collection Landing page and user lands on collection detail page', fakeAsync(() => {
    const { spectator } = testSetup();
    spectator.component.backToNavigationName = 'Back to Collections';
    spectator.tick();
    const backLink = spectator.query('.back-to-collections-link');
    expect(backLink.tagName).toBe('A');
    expect(backLink).toHaveText('Back to Collections');
    spectator.click(backLink);
    const router = spectator.inject(Location);
    expect(router.back).toHaveBeenCalled();
  }));

  it('Clicking link redirects user to the Collections Landing page when a new collection is created from Collections detail page > Duplicate Collection and user lands on collection detail page', fakeAsync(() => {
    const { spectator, component } = testSetup();
    spectator.component.backToNavigationName = 'Back to Collections';
    spectator.tick();
    collectionsDialogService = spectator.inject(CollectionsDialogService, true);
    spyFn = jest
      .spyOn(collectionsDialogService, 'openCreateDialog')
      .mockReturnValue(of({ Id: 1, Name: 'Collection' }));
    component.copy();
    expect(spyFn).toHaveBeenCalled();
    spectator.tick();
    const router = spectator.inject(Router);
    expect(router.navigate).toHaveBeenCalledWith(['/collections', 1]);
    spectator.detectChanges();
    const backLink = spectator.query('.back-to-collections-link');
    expect(backLink.tagName).toBe('A');
    expect(backLink).toHaveText('Back to Collections');
    spectator.click(backLink);
    const location = spectator.inject(Location);
    expect(location.back).toHaveBeenCalled();
  }));

  it('Clicking link redirects user to the Collections Landing page for an existing collection', fakeAsync(() => {
    const { spectator } = testSetup();
    spectator.component.backToNavigationName = 'Back to Collections';
    spectator.tick();
    const backLink = spectator.query('.back-to-collections-link');
    expect(backLink.tagName).toBe('A');
    expect(backLink).toHaveText('Back to Collections');
    spectator.click(backLink);
    const location = spectator.inject(Location);
    expect(location.back).toHaveBeenCalled();
  }));

  describe('Bulk product add to collection', () => {
    let spyFn: jest.SpyInstance;

    it('Buttons at the top of the page should get disabled when one or more products are selected in the collection using the product card checkboxes', fakeAsync(() => {
      const { spectator, component } = testSetup();
      spectator.tick();
      injectProducts
        .slice(0, 2)
        .forEach((product) =>
          component.checkedProducts.set(product.Id, product)
        );
      spectator.detectComponentChanges();
      const actionsBtn = spectator.query('.mat-menu-trigger.actions-button');
      const useCollectionInPresentationBtn = spectator.query(
        '.use-in-presentation-btn'
      );
      expect(actionsBtn).toExist();
      expect(useCollectionInPresentationBtn).toExist();
      expect(actionsBtn.tagName).toBe('BUTTON');
      expect(useCollectionInPresentationBtn.tagName).toBe('BUTTON');
      expect(actionsBtn).toHaveClass('cos-button-disabled');
      expect(useCollectionInPresentationBtn).toHaveClass('cos-button-disabled');
    }));
  });

  describe('Duplicate Collections', () => {
    const setup = (collection = { Id: 1, Name: 'Collection' }) => {
      const spyFn = jest
        .spyOn(collectionsDialogService, 'openCreateDialog')
        .mockReturnValue(of(collection));

      return {
        spyFn,
      };
    };

    it("'Duplicate collection' option should be available on the top three dot menu on Collection detail page.", () => {
      setup();
      const { component, spectator } = testSetup();
      component.state.collection.Status = 'Active';
      spectator.detectChanges();
      const matMenuElement = spectator.query(
        '.mat-menu-trigger.actions-button'
      );
      spectator.click(matMenuElement);
      const menuContents = spectator.queryAll('.mat-menu-item');
      expect(menuContents).toContainText('Duplicate Collection');
    });

    it("Dismissing the 'Create new Collection' modal should redirect user back to the source collection detail page and the collection should not be copied/created and success/error toast shoud not be displayed.", () => {
      const { spectator } = testSetup();
      collectionsDialogService = spectator.inject(CollectionsDialogService);
      const { spyFn } = setup(null);

      spectator.component.copy();

      expect(spyFn).toHaveBeenCalled();
      const router = spectator.inject(Router);
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it("'Create New Collection' modal should be displayed with user clicks on the 'Duplicate Collection' icon.", () => {
      const { component, spectator } = testSetup();
      collectionsDialogService = spectator.inject(CollectionsDialogService);
      const { spyFn } = setup();

      component.copy();
      expect(spyFn).toHaveBeenCalled();
    });

    it("Description and icon should be copied to the 'Create New Collection' screen correctly when user duplicate a collection.", () => {
      const { component, spectator } = testSetup();
      collectionsDialogService = spectator.inject(CollectionsDialogService);
      const { spyFn } = setup();

      component.copy();
      expect(spyFn).toHaveBeenCalledWith({
        collection: component.state.collection,
      });
    });

    it('User should be able to duplicate a collection with no products.', () => {
      const { component, spectator } = testSetup();
      collectionsDialogService = spectator.inject(CollectionsDialogService);
      const { spyFn } = setup();

      component.state.collection.Products.length = 0;
      spectator.detectChanges();
      component.copy();
      expect(spyFn).toHaveBeenCalledWith({
        collection: component.state.collection,
      });
    });

    it('User should be able to duplicate a collection with 250 products and all 250 products should be copied over.', () => {
      const { component, spectator } = testSetup();
      collectionsDialogService = spectator.inject(CollectionsDialogService);
      const { spyFn } = setup();

      component.state.collection.Products.length = 250;
      spectator.detectChanges();
      component.copy();
      expect(spyFn).toHaveBeenCalledWith({
        collection: component.state.collection,
      });
    });
  });

  it('Transfer ownership option should be available to the owner of the collection when user clicks at the three dot menu on the collection detail page of a collection', fakeAsync(() => {
    const { spectator, component } = testSetup();
    spectator.tick();
    spectator.detectChanges();
    const authfacade = spectator.inject(AuthFacade, true);
    authfacade.user.Id = component.state.collection.OwnerId;
    component.state.canEdit = true;
    const actionsBtn = spectator.query('.mat-menu-trigger.actions-button');
    expect(actionsBtn).toExist();
    spectator.click(actionsBtn);
    spectator.tick(200);
    const transferOwnershipBtn = spectator.query('.transfer-collection');
    expect(transferOwnershipBtn).toExist();
    expect(transferOwnershipBtn).toHaveText('Transfer ownership');
  }));

  it('Transfer ownership option should be available to the admin when user clicks at the three dot menu on the collection detail page of a collection', fakeAsync(() => {
    const { spectator, component } = testSetup();
    spectator.tick();
    const authfacade = spectator.inject(AuthFacade, true);
    authfacade.user.IsAdmin = true;
    component.state.canEdit = true;
    const actionsBtn = spectator.query('.mat-menu-trigger.actions-button');
    expect(actionsBtn).toExist();
    spectator.click(actionsBtn);
    spectator.tick(200);
    const transferOwnershipBtn = spectator.query('.transfer-collection');
    expect(transferOwnershipBtn).toExist();
    expect(transferOwnershipBtn).toHaveText('Transfer ownership');
  }));

  it('Transfer ownership option should not be available to a user with editing permission when user clicks at the three dot menu on the collection landing page of a collection', fakeAsync(() => {
    const { spectator, component } = testSetup({ isReadOnly: true });
    spectator.tick();
    expect(component.state.canEdit).toBeFalsy();
    const authfacade = spectator.inject(AuthFacade, true);
    authfacade.user.IsAdmin = true;
    const actionsBtn = spectator.query('.mat-menu-trigger.actions-button');
    expect(actionsBtn).toExist();
    spectator.click(actionsBtn);
    spectator.tick(200);
    const transferOwnershipBtn = spectator.query('.transfer-collection');
    expect(transferOwnershipBtn).not.toExist();
  }));

  it("User should remain on the collection detail page once the ownership is transferred and the collection permissions set as 'Everyone within company can view'", fakeAsync(() => {
    const { spectator, component } = testSetup({});
    spectator.tick();
    const collaboratorsDialogService = spectator.inject(
      CollaboratorsDialogService,
      true
    );
    let collaboratorsDialogSpy: jest.SpyInstance = jest
      .spyOn(collaboratorsDialogService, 'openTransferOwnershipDialog')
      .mockReturnValue(of(<any>{ test: 'success' }));
    component.transferOwnership();
    expect(collaboratorsDialogSpy).toHaveBeenCalled();
    collaboratorsDialogSpy = jest
      .spyOn(collaboratorsDialogService, 'openManageCollaboratorsDialog')
      .mockReturnValue(of(<any>{ test: 'success' }));
    component.manageCollaborators();
    expect(collaboratorsDialogSpy).toHaveBeenCalled();
    component.state.collection.AccessLevel = 'Everyone';
    component.state.collection.Access = [
      { AccessLevel: 'Everyone', AccessType: 'Read', EntityId: 0 },
    ];
    spectator.detectComponentChanges();
    const accessText = spectator.query('.collaborator-settings > p');
    expect(accessText).toExist();
    expect(accessText).toHaveText('Anyone within your company can view');
  }));

  it("User should remain on the collection detail page once the ownership is transferred and the collection permissions set as 'Everyone within company can edit'", fakeAsync(() => {
    const { spectator, component } = testSetup({});
    spectator.tick();
    const collaboratorsDialogService = spectator.inject(
      CollaboratorsDialogService,
      true
    );
    let collaboratorsDialogSpy: jest.SpyInstance = jest
      .spyOn(collaboratorsDialogService, 'openTransferOwnershipDialog')
      .mockReturnValue(of(<any>{ test: 'success' }));
    component.transferOwnership();
    expect(collaboratorsDialogSpy).toHaveBeenCalled();
    collaboratorsDialogSpy = jest
      .spyOn(collaboratorsDialogService, 'openManageCollaboratorsDialog')
      .mockReturnValue(of(<any>{ test: 'success' }));
    component.manageCollaborators();
    expect(collaboratorsDialogSpy).toHaveBeenCalled();
    component.state.collection.AccessLevel = 'Everyone';
    component.state.collection.Access = [
      { AccessLevel: 'Everyone', AccessType: 'ReadWrite', EntityId: 0 },
    ];
    spectator.detectComponentChanges();
    const accessText = spectator.query('.collaborator-settings > p');
    expect(accessText).toExist();
    expect(accessText).toHaveText('Anyone within your company can edit');
  }));

  it('User should remain on the collection detail page once the ownership is transferred and the collection permissions set as Individual and Teams and existing owner is part of a team having View Only access', fakeAsync(() => {
    const { spectator, component } = testSetup({});
    spectator.tick();
    const collaboratorsDialogService = spectator.inject(
      CollaboratorsDialogService,
      true
    );
    let collaboratorsDialogSpy: jest.SpyInstance = jest
      .spyOn(collaboratorsDialogService, 'openTransferOwnershipDialog')
      .mockReturnValue(of(<any>{ test: 'success' }));
    component.transferOwnership();
    expect(collaboratorsDialogSpy).toHaveBeenCalled();
    collaboratorsDialogSpy = jest
      .spyOn(collaboratorsDialogService, 'openManageCollaboratorsDialog')
      .mockReturnValue(of(<any>{ test: 'success' }));
    component.manageCollaborators();
    expect(collaboratorsDialogSpy).toHaveBeenCalled();
    component.state.collection.AccessLevel = 'Custom';
    component.state.collection.Access = [
      { AccessLevel: 'Team', AccessType: 'Read' },
    ];
    spectator.detectChanges();
    const accessText = spectator.query('.access-text');
    expect(accessText).not.toExist();
  }));

  it('User with view only rights should not be able to remove products using bulk(Action Bar)', () => {
    // Arrange
    const { spectator, component } = testSetup({ isReadOnly: true });

    // Act
    injectProducts
      .slice(0, 4)
      .forEach((product) => component.checkedProducts.set(product.Id, product));

    spectator.detectChanges();

    // Assert
    const removeFromCollectionBtn = spectator.query(
      byText('Remove from Collection', {
        selector:
          'cos-action-bar .card-actions > .cos-action-bar-controls button',
      })
    );
    expect(removeFromCollectionBtn).not.toExist();
  });

  it('User should remain on the collection detail page once the ownership is transferred and the collection permissions set as Individual and Teams and existing owner is part of a team having Edit access', () => {
    const { spectator, component } = testSetup();

    const collaboratorsDialogService = spectator.inject(
      CollaboratorsDialogService,
      true
    );
    const authfacade = spectator.inject(AuthFacade, true);
    authfacade.user.Id = component.state.collection.OwnerId;

    spyFn = jest
      .spyOn(collaboratorsDialogService, 'openTransferOwnershipDialog')
      .mockReturnValue(of(<any>{ test: 'success' }));
    component.transferOwnership();
    expect(spyFn).toHaveBeenCalled();
    const collaboratorsDialogSpy = jest
      .spyOn(collaboratorsDialogService, 'openManageCollaboratorsDialog')
      .mockReturnValue(of(component.state.collection));

    component.manageCollaborators();
    expect(collaboratorsDialogSpy).toHaveBeenCalled();
    const accessText = spectator.query('.access-text');
    expect(accessText).not.toExist();
  });
});
