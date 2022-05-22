import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { CosConfirmDialog } from '@cosmos/components/confirm-dialog';
import { CosToastService } from '@cosmos/components/notification';
import { AuthFacade } from '@esp/auth';
import { CollectionsActions, CollectionsService } from '@esp/collections';
import { CollectionMockDb } from '@esp/collections/mocks';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { Navigate } from '@ngxs/router-plugin';
import { NgxsModule, Store } from '@ngxs/store';
import { of } from 'rxjs';
import { CollaboratorsDialogService } from '@asi/collaborators/ui/feature-core';
import { CollectionsDialogService } from '../../services';
import {
  CollectionCardMenuComponent,
  CollectionCardMenuComponentModule,
} from './collection-card-menu.component';

describe('CollectionCardMenuComponent', () => {
  let spectator: Spectator<CollectionCardMenuComponent>;
  let component: CollectionCardMenuComponent;
  let collection: any;

  const createComponent = createComponentFactory({
    component: CollectionCardMenuComponent,
    imports: [
      NgxsModule.forRoot(),
      CollectionCardMenuComponentModule,
      HttpClientTestingModule,
    ],
    providers: [
      mockProvider(AuthFacade, {
        user: {
          Id: 1,
        },
      }),
      mockProvider(CosToastService),
      mockProvider(CollectionsDialogService),
    ],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        collection: {
          Name: 'Collection',
        },
      },
    });
    component = spectator.component;
    collection = CollectionMockDb.Collections[0];
  });

  it('should create', () => {
    expect(spectator).toBeTruthy();
    expect(component).toBeTruthy();
  });

  it('Transfer ownership option should be available to the owner of the collection, when user clicks at the three dot menu on the collection landing page of a collection', () => {
    const authfacade = spectator.inject(AuthFacade, true);
    authfacade.user.Id = collection.OwnerId;
    collection.Status = 'Active';
    collection.IsEditable = true;
    spectator.setInput('collection', collection);
    spectator.detectChanges();
    expect(component.userId).toEqual(component.collection.OwnerId);
    const transferOwnershipBtn = spectator.query('.transfer-owner');
    expect(transferOwnershipBtn).toExist();
    expect(transferOwnershipBtn).toHaveText('Transfer Owner');
  });

  it('Transfer ownership option should be available to the admin, when user clicks at the three dot menu on the collection landing page of a collection', () => {
    const authfacade = spectator.inject(AuthFacade, true);
    authfacade.user.IsAdmin = true;
    collection.Status = 'Active';
    collection.IsEditable = true;
    spectator.setInput('collection', collection);
    spectator.detectChanges();
    expect(component.isAdmin).toBeTruthy();
    const transferOwnershipBtn = spectator.query('.transfer-owner');
    expect(transferOwnershipBtn).toExist();
    expect(transferOwnershipBtn).toHaveText('Transfer Owner');
  });

  it('Transfer ownership option should not be available to the user with view only permission, when user clicks at the three dot menu on the collection landing page of a collection', () => {
    const authfacade = spectator.inject(AuthFacade, true);
    authfacade.user.IsAdmin = false;
    collection.Status = 'Active';
    collection.IsEditable = false;
    spectator.setInput('collection', collection);
    spectator.detectChanges();
    expect(component.isAdmin).toBeFalsy();
    expect(component.userId).not.toEqual(component.collection.OwnerId);
    const transferOwnershipBtn = spectator.query('.transfer-owner');
    expect(transferOwnershipBtn).not.toExist();
  });

  it('Transfer ownership option should not be available to the user with editing permission, when user clicks at the three dot menu on the collection landing page of a collection', () => {
    const authfacade = spectator.inject(AuthFacade, true);
    authfacade.user.IsAdmin = false;
    collection.Status = 'Active';
    collection.IsEditable = true;
    spectator.setInput('collection', collection);
    spectator.detectChanges();
    expect(component.isAdmin).toBeFalsy();
    const transferOwnershipBtn = spectator.query('.transfer-owner');
    expect(transferOwnershipBtn).not.toExist();
  });

  it('An owner should be displayed with following options under the three dot menu of a collection at collection landing page: Transfer Ownership, Duplicate Collection, Archive/Make Active, Delete', () => {
    const authfacade = spectator.inject(AuthFacade, true);
    authfacade.user.Id = collection.OwnerId;
    collection.Status = 'Active';
    collection.IsEditable = true;
    spectator.setInput('collection', collection);
    spectator.detectChanges();
    expect(component.userId).toEqual(component.collection.OwnerId);
    const listOptions = spectator.queryAll('button.cos-menu-item');
    expect(listOptions).toHaveLength(4);
    expect(listOptions[0]).toHaveText('Transfer Owner');
    expect(listOptions[1]).toHaveText('Duplicate Collection');
    expect(listOptions[2]).toHaveText('Archive');
    expect(listOptions[3]).toHaveText('Delete');
  });

  it('An admin should be displayed with the following options under the three dot menu of a collection: Transfer Ownership, Duplicate Collection, Archive/Make Active, Delete', () => {
    const authfacade = spectator.inject(AuthFacade, true);
    authfacade.user.IsAdmin = true;
    collection.Status = 'Active';
    collection.IsEditable = true;
    spectator.setInput('collection', collection);
    spectator.detectChanges();
    expect(component.isAdmin).toBeTruthy();
    const listOptions = spectator.queryAll('button.cos-menu-item');
    expect(listOptions).toHaveLength(4);
    expect(listOptions[0]).toHaveText('Transfer Owner');
    expect(listOptions[1]).toHaveText('Duplicate Collection');
    expect(listOptions[2]).toHaveText('Archive');
    expect(listOptions[3]).toHaveText('Delete');
  });

  it('Order of the three dot menu items should be: Transfer Ownership, Duplicate Collection, Archive/Make Active, Delete', () => {
    const authfacade = spectator.inject(AuthFacade, true);
    authfacade.user.IsAdmin = true;
    collection.Status = 'Active';
    collection.IsEditable = true;
    spectator.setInput('collection', collection);
    spectator.detectChanges();
    const listOptions = spectator.queryAll('button.cos-menu-item');
    expect(listOptions).toHaveLength(4);
    expect(listOptions[0]).toHaveText('Transfer Owner');
    expect(listOptions[1]).toHaveText('Duplicate Collection');
    expect(listOptions[2]).toHaveText('Archive');
    expect(listOptions[3]).toHaveText('Delete');
  });

  it('Archive collection three dot menu will display options as: Transfer Ownership, Duplicate Collection, Make Active, Delete', () => {
    const authfacade = spectator.inject(AuthFacade, true);
    authfacade.user.IsAdmin = true;
    collection.Status = 'Archived';
    collection.IsEditable = true;
    spectator.setInput('collection', collection);
    spectator.detectChanges();
    const listOptions = spectator.queryAll('button.cos-menu-item');
    expect(listOptions).toHaveLength(3);
    expect(listOptions[0]).toHaveText('Duplicate Collection');
    expect(listOptions[1]).toHaveText('Make Active');
    expect(listOptions[2]).toHaveText('Delete');
  });

  it("Users with edit rights for an archived collection should be displayed with 'Make Active' option under the three dot menu of that collection on Collection landing page", () => {
    const authfacade = spectator.inject(AuthFacade, true);
    authfacade.user.IsAdmin = true;
    collection.Status = 'Archived';
    collection.IsEditable = true;
    spectator.setInput('collection', collection);
    spectator.detectChanges();
    const makeActiveOptn = spectator.query('.activate-collection');
    expect(makeActiveOptn).toExist();
    expect(makeActiveOptn).toContainText('Make Active');
  });

  it("User with edit rights on a shared collection should be able to 'Make Active' that shared collection", () => {
    const authfacade = spectator.inject(AuthFacade, true);
    authfacade.user.IsAdmin = true;
    collection.Status = 'Archived';
    collection.IsEditable = true;
    spectator.setInput('collection', collection);
    spectator.detectChanges();
    const makeActiveOptn = spectator.query('.activate-collection');
    expect(makeActiveOptn).toExist();
    expect(makeActiveOptn).toContainText('Make Active');
  });

  it('User should not be able to make active a collection that is already active', () => {
    const authfacade = spectator.inject(AuthFacade, true);
    authfacade.user.IsAdmin = true;
    collection.Status = 'Active';
    collection.IsEditable = true;
    spectator.setInput('collection', collection);
    spectator.detectChanges();
    const makeActiveOptn = spectator.query('.activate-collection');
    expect(makeActiveOptn).not.toExist();
  });

  it('User should be able to make active an archive collection', () => {
    collection.Status = 'Archived';
    collection.IsEditable = true;
    spectator.setInput('collection', collection);
    spectator.detectChanges();
    const makeActiveOptn = spectator.query('.activate-collection');
    expect(makeActiveOptn).toExist();
  });

  it('User with view only rights should not be able to transfer ownsership', () => {
    const authfacade = spectator.inject(AuthFacade, true);
    authfacade.user.IsAdmin = false;
    collection.Status = 'Active';
    collection.IsEditable = true;
    spectator.setInput('collection', collection);
    spectator.detectChanges();
    const transferOwnershipBtn = spectator.query('.transfer-owner');
    expect(transferOwnershipBtn).not.toExist();
  });

  it('Delete option should be available on the top of three dot menu on Collection landing page on a card', () => {
    collection.IsEditable = true;
    spectator.setInput('collection', collection);
    spectator.detectChanges();
    const deleteBtn = spectator.query('.delete-collection');
    expect(deleteBtn).toExist();
    expect(deleteBtn).toHaveText('Delete');
  });

  it('Only users with edit permissions for a collection should be able to delete a collection', () => {
    collection.IsEditable = true;
    spectator.setInput('collection', collection);
    spectator.detectChanges();
    let deleteBtn = spectator.query('.delete-collection');
    expect(deleteBtn).toExist();
    expect(deleteBtn).toHaveText('Delete');
    collection.IsEditable = false;
    spectator.setInput('collection', collection);
    spectator.detectChanges();
    deleteBtn = spectator.query('.delete-collection');
    expect(deleteBtn).not.toExist();
  });

  it('User with no access should be displayed with below options when user has no View Only permissions at collection landing page: 1- Duplicate Collection', () => {
    collection.Status = 'Active';
    collection.IsEditable = false;
    spectator.setInput('collection', collection);
    spectator.detectChanges();
    const listOptions = spectator.queryAll('button.cos-menu-item');
    expect(listOptions).toHaveLength(1);
    expect(listOptions[0]).toHaveText('Duplicate Collection');
  });

  it('A user should be displayed with following options on a collection card for an archived collection for which he has edit permissions: 1- Duplicate Collection, 2- Make Active, 3- Delete Collection', () => {
    const authfacade = spectator.inject(AuthFacade, true);
    authfacade.user.Id = collection.OwnerId;
    collection.Status = 'Archived';
    collection.IsEditable = true;
    spectator.setInput('collection', collection);
    spectator.detectChanges();
    const listOptions = spectator.queryAll('button.cos-menu-item');
    expect(listOptions).toHaveLength(3);
    expect(listOptions[0]).toHaveText('Duplicate Collection');
    expect(listOptions[1]).toHaveText('Make Active');
    expect(listOptions[2]).toHaveText('Delete');
  });

  describe('Operations', () => {
    let service: any;

    let modalService: CollectionsDialogService;
    let dialog: MatDialog;
    let store: Store;
    let dispatchSpy;

    beforeEach(() => {
      service = spectator.inject(CollectionsService, true);
      jest.spyOn(service, 'copy').mockReturnValue(of('test'));

      modalService = spectator.inject(CollectionsDialogService);
      dialog = spectator.inject(MatDialog, true);
      store = spectator.inject(Store);
      dispatchSpy = jest.spyOn(store, 'dispatch');
    });

    it("Selecting 'No' on the warning messaage should not delete the collection and user should stay on the collection landing page", () => {
      jest.spyOn(dialog, 'open').mockReturnValue(<any>{
        afterClosed: () => of(false),
      });
      component.delete(collection);
      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it("Selecting 'Yes' on the warning modal should remove the collection", () => {
      jest.spyOn(dialog, 'open').mockReturnValue(<any>{
        afterClosed: () => of(true),
      });
      component.delete(collection);
      expect(dispatchSpy).toHaveBeenCalledWith(
        new CollectionsActions.Delete(collection)
      );
    });

    it('should archive collection', () => {
      jest
        .spyOn(service, 'archive')
        .mockReturnValue(of({ error: 'test error' }));
      component.archive(collection);
      expect(dispatchSpy).toHaveBeenCalledWith(
        new CollectionsActions.SaveStatus(collection, 'Archived')
      );
    });

    it('should activate collection', () => {
      jest
        .spyOn(service, 'activate')
        .mockReturnValue(of({ test: 'test error' }));
      component.activate(collection);
      expect(dispatchSpy).toHaveBeenCalledWith(
        new CollectionsActions.SaveStatus(collection, 'Active')
      );
    });

    it('should duplicate collection', () => {
      const spyFn = jest
        .spyOn(modalService, 'openCreateDialog')
        .mockReturnValue(of(collection));
      jest.spyOn(component.handleSearch, 'next');

      component.duplicate(collection);

      expect(spyFn).toHaveBeenCalled();
    });

    it('Clicking link redirects user to the Collections Landing page when a new collection is created from Collections Landing page > Duplicate Collection and user lands on collection detail page', () => {
      const spyFn = jest
        .spyOn(modalService, 'openCreateDialog')
        .mockReturnValue(of(component.collection));
      jest.spyOn(component.handleSearch, 'next');

      component.duplicate(component.collection);

      expect(spyFn).toHaveBeenCalled();
      expect(dispatchSpy).toHaveBeenCalledWith(
        new Navigate(['/collections', component.collection.Id])
      );
    });

    it('User should remain on the collection landing page once the ownership is transferred from the Transfer ownership modal', () => {
      const collaboratorsDialogService = spectator.inject(
        CollaboratorsDialogService
      );
      const spyFn = jest
        .spyOn(collaboratorsDialogService, 'openTransferOwnershipDialog')
        .mockReturnValue(of(<any>{ test: 'some test' }));
      component.transferOwnership(collection);
      expect(spyFn).toHaveBeenCalled();
    });

    it('Dismissing the Transfer ownership modal should keep user on the collection landing page and ownership should not be transferred', () => {
      const collaboratorsDialogService = spectator.inject(
        CollaboratorsDialogService
      );
      const spyFn = jest
        .spyOn(collaboratorsDialogService, 'openTransferOwnershipDialog')
        .mockReturnValue(of(null));
      component.transferOwnership(collection);
      expect(spyFn).toHaveBeenCalled();
    });

    it("Collection should no longer be available under the 'All collections', 'Shared with me' or 'Owned by me' tab when archived", () => {
      jest.spyOn(service, 'archive').mockReturnValue(of(collection));
      jest.spyOn(component.handleSearch, 'next');
      component.archive(collection);
      expect(component.handleSearch.next).toHaveBeenCalled();
      expect(dispatchSpy).toHaveBeenCalledWith(
        new CollectionsActions.SaveStatus(collection, 'Archived')
      );
    });

    it('User should be able to delete collection from collections landing page > Archived tab', () => {
      const dialogSpyFn = jest.spyOn(dialog, 'open').mockReturnValue(<any>{
        afterClosed: () => of(true),
      });
      component.delete(collection);
      expect(dialogSpyFn).toHaveBeenCalled();
      expect(dispatchSpy).toHaveBeenCalledWith(
        new CollectionsActions.Delete(collection)
      );
    });

    it("Shared collection when made Active should be removed from 'Archived' tab and should displayed under the 'Shared with me' tab", () => {
      jest
        .spyOn(service, 'activate')
        .mockReturnValue(of({ test: 'test success' }));
      component.activate(collection);
      expect(dispatchSpy).toHaveBeenCalledWith(
        new CollectionsActions.SaveStatus(collection, 'Active')
      );
    });

    it('Clicking at the Transfer Ownership option from Collections landing page should load the Transfer ownership modal', () => {
      const collaboratorsDialogService = spectator.inject(
        CollaboratorsDialogService,
        true
      );
      const dialogSpy = jest
        .spyOn(collaboratorsDialogService, 'openTransferOwnershipDialog')
        .mockReturnValue(of(<any>{ test: 'success' }));
      component.transferOwnership(collection);
      expect(dialogSpy).toHaveBeenCalled();
    });

    it("Selecting the Delete option should display warning as 'Are you sure you want to delete this collection?' with Options 'Yes, remove this collection', 'No, do not delete'", () => {
      const spyFn = jest.spyOn(dialog, 'open').mockReturnValue(<any>{
        afterClosed: () => of(true),
      });
      component.delete(collection);
      expect(spyFn).toHaveBeenCalledWith(CosConfirmDialog, {
        minWidth: '400px',
        width: '400px',
        data: {
          message: 'Are you sure you want to delete this collection?',
          confirm: 'Yes, remove this collection',
          cancel: 'No, do not delete',
        },
      });
    });
  });
});
