import { CommonModule, Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  NgModule,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InitialsPipe } from '@cosmos/common';
import { Avatar, CosAvatarListModule } from '@cosmos/components/avatar-list';
import { CosButtonModule } from '@cosmos/components/button';
import { CosConfirmDialog } from '@cosmos/components/confirm-dialog';
import { CosEmojiMenuModule } from '@cosmos/components/emoji-menu';
import { CosInlineEditModule } from '@cosmos/components/inline-edit';
import { CosPillModule } from '@cosmos/components/pill';
import { FeatureFlagsModule } from '@cosmos/feature-flags';
import { AuthFacade } from '@esp/auth';
import {
  Collection,
  CollectionProductSearchResultItem,
  CollectionsService,
} from '@esp/collections';
import { SearchCriteria } from '@esp/models';
import { MAX_PRODUCTS_PER_PRESENTATION } from '@esp/presentations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { isEqual } from 'lodash-es';
import { firstValueFrom } from 'rxjs';
import { distinctUntilChanged, filter, finalize, map } from 'rxjs/operators';
import { CollaboratorsDialogService } from '@asi/collaborators/ui/feature-core';
import { mapProduct } from '../../../products/utils';
import { AddToPresentationFlow } from '../../../projects/flows';
import { CollectionProductsComponentModule } from '../../components/collection-products/collection-products.component';
import { CollectionsDialogService } from '../../services';
import { CollectionDetailLoaderComponentModule } from './collection-detail.loader';
import { CollectionDetailLocalState } from './collection-detail.local-state';

@UntilDestroy()
@Component({
  selector: 'esp-collection-detail-page',
  templateUrl: './collection-detail.page.html',
  styleUrls: ['./collection-detail.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AddToPresentationFlow, CollectionDetailLocalState],
})
export class CollectionDetailPage {
  private readonly state$ = this.state.connect(this);

  avatarList: Avatar[] = [];
  checkedProducts = new Map<number, CollectionProductSearchResultItem>();
  collectionForm = this.getCollectionForm();
  backToNavigationName: string;

  mapProduct = mapProduct;

  allProductsAreBeingAdded = false;

  constructor(
    public readonly state: CollectionDetailLocalState,
    private _fb: FormBuilder,
    private _dialog: MatDialog,
    private _router: Router,
    private _collectionsModalService: CollectionsDialogService,
    private _authFacade: AuthFacade,
    private readonly _collaboratorsDialogService: CollaboratorsDialogService,
    private readonly _addToPresentationFlow: AddToPresentationFlow,
    private readonly _location: Location,
    private readonly _collectionsService: CollectionsService,
    _activatedRoute: ActivatedRoute,
    private readonly _ref: ChangeDetectorRef
  ) {
    const collection$ = this.state$.pipe(
      map((x) => x.collection),
      distinctUntilChanged((a, b) => a?.Id === b?.Id),
      untilDestroyed(this)
    );

    const collaborators$ = this.state$.pipe(
      map((x) => x.collection?.Collaborators),
      distinctUntilChanged(isEqual),
      untilDestroyed(this)
    );

    // eslint-disable-next-line rxjs-angular/prefer-takeuntil
    collection$.subscribe({
      next: (collection) => {
        this._resetCollection(collection);
      },
    });

    // eslint-disable-next-line rxjs-angular/prefer-takeuntil
    collaborators$.subscribe({
      next: () => {
        this._resetCollaborators();
      },
    });

    _activatedRoute.params.pipe(untilDestroyed(this)).subscribe({
      next: () => {
        this.backToNavigationName =
          this._router.getCurrentNavigation()?.extras.state?.navigationName;
      },
    });

    _addToPresentationFlow.setupCleanUpCheckedProductsListener(
      _ref,
      this.checkedProducts
    );
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------
  get emoji() {
    return this.collectionForm.get('Emoji').value;
  }
  set emoji(emoji: string) {
    this.collectionForm.get('Emoji').setValue(emoji);

    this.updateProperties();
  }

  get isAdmin() {
    return this._authFacade.user.IsAdmin;
  }

  get userId() {
    return this._authFacade.user.Id;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  addToOrder(): void {}

  addToPresentation(): void {
    this._addToPresentationFlow.start({
      checkedProducts: this.checkedProducts,
    });
  }

  /**
   * This is used when the green button on the top is clicked, we should get all products
   * within this collection and pass them all to the `add to presentation` flow.
   */
  addAllProductsToPresentation(): void {
    this.allProductsAreBeingAdded = true;

    this._collectionsService
      .searchProducts(
        this.state.collection.Id,
        new SearchCriteria({
          size: MAX_PRODUCTS_PER_PRESENTATION,
        })
      )
      .pipe(
        map(({ Results }) => Results || []),
        untilDestroyed(this),
        finalize(() => {
          this.allProductsAreBeingAdded = false;
          this._ref.detectChanges();
        })
      )
      .subscribe((products) => {
        const checkedProducts = new Map(
          products.map((product) => [product.Id, product])
        );

        this._addToPresentationFlow.start({ checkedProducts });
      });
  }

  goBack(): void {
    this._location.back();
  }

  copy(): void {
    this._collectionsModalService
      .openCreateDialog({
        collection: this.state.collection,
      })
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (collection) => {
          if (collection) {
            this._router.navigate(['/collections', collection.Id]);
          }
        },
      });
  }

  delete(): void {
    const confirmDialog = this._dialog.open(CosConfirmDialog, {
      minWidth: '400px',
      width: '400px',
      data: {
        message: 'Are you sure you want to delete this collection?',
        confirm: 'Yes, remove this collection',
        cancel: 'No, do not delete',
      },
    });

    confirmDialog
      .afterClosed()
      .pipe(
        filter((result) => result === true),
        untilDestroyed(this)
      )
      .subscribe(() => {
        this.state.delete();
      });
  }

  manageCollaborators(): void {
    this._collaboratorsDialogService
      .openManageCollaboratorsDialog({
        entity: this.state.collection,
        isOnlyReadWrite: false,
      })
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (accessChanges) => {
          if (accessChanges) {
            const collection = {
              ...this.state.collection,
              AccessLevel: accessChanges.AccessLevel,
              Access: accessChanges.Access,
              Collaborators: accessChanges.Collaborators,
            };

            this.state.save(collection);
          }
        },
      });
  }

  setDescription(event): void {
    this.collectionForm.controls.Description.setValue(event.value);
    this.updateProperties();
  }

  setName(event): void {
    if (event.value) {
      this.collectionForm.controls.Name.setValue(event.value);
      this.updateProperties();
    }
  }

  async transferOwnership(): Promise<void> {
    await firstValueFrom(
      this._collaboratorsDialogService
        .openTransferOwnershipDialog({
          entity: this.state.collection,
          shouldBlockUntilTheOwnerIsTransferred: true,
        })
        .pipe(untilDestroyed(this)),
      { defaultValue: null }
    );
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------
  private _resetCollaborators() {
    const initials = new InitialsPipe();

    this.avatarList = this.state.collection?.Collaborators?.map((c) => ({
      imgUrl: c.ImageUrl,
      toolTipText: c.Name,
      displayText: initials.transform(c.Name),
      icon: c.IsTeam ? 'fa-users' : '',
    }));
  }

  private _resetCollection(collection: Collection) {
    if (!collection) return;

    const { Name, Description = '', Emoji } = collection;

    this.collectionForm.setValue({ Name, Description, Emoji });
  }

  private getCollectionForm() {
    return this._fb.group({
      Name: ['', Validators.required],
      Description: [''],
      Emoji: [':package:'],
    });
  }

  private updateProperties() {
    this.state.save({
      ...this.state.collection,
      ...this.collectionForm.value,
    });
  }
}

@NgModule({
  declarations: [CollectionDetailPage],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,

    FeatureFlagsModule,

    MatDialogModule,
    MatMenuModule,

    CosAvatarListModule,
    CosButtonModule,
    CosEmojiMenuModule,
    CosInlineEditModule,
    CosPillModule,

    CollectionDetailLoaderComponentModule,
    CollectionProductsComponentModule,
  ],
})
export class CollectionDetailPageModule {}
