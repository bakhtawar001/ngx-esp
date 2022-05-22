import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  NgModule,
  Output,
} from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { CosConfirmDialog } from '@cosmos/components/confirm-dialog';
import { AuthFacade } from '@esp/auth';
import { Collection, CollectionsActions } from '@esp/collections';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { filter, switchMap } from 'rxjs/operators';
import { CollaboratorsDialogService } from '@asi/collaborators/ui/feature-core';
import { CollectionsDialogService } from '../../services';

@UntilDestroy()
@Component({
  selector: 'esp-collection-card-menu',
  templateUrl: './collection-card-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionCardMenuComponent {
  @Input() collection: Collection;
  @Output() handleSearch = new EventEmitter<void>();

  constructor(
    private readonly store: Store,
    private readonly _authFacade: AuthFacade,
    private _dialog: MatDialog,
    private readonly _collectionsDialogService: CollectionsDialogService,
    private readonly _collaboratorsDialogService: CollaboratorsDialogService
  ) {}

  get isAdmin() {
    return this._authFacade.user?.IsAdmin;
  }

  get userId() {
    return this._authFacade.user.Id;
  }

  activate(collection: Collection): void {
    this.store
      .dispatch(new CollectionsActions.SaveStatus(collection, 'Active'))
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => this.handleSearch.next(),
      });
  }

  archive(collection: Collection): void {
    this.store
      .dispatch(new CollectionsActions.SaveStatus(collection, 'Archived'))
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => this.handleSearch.next(),
      });
  }

  delete(collection: Collection): void {
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
        this.store.dispatch(new CollectionsActions.Delete(collection));
      });
  }

  duplicate(collection: Collection): void {
    this._collectionsDialogService
      .openCreateDialog({ collection })
      .pipe(filter(Boolean), untilDestroyed(this))
      .subscribe({
        next: (collection) => {
          this.store.dispatch(new Navigate(['/collections', collection.Id]));
        },
      });
  }

  transferOwnership(entity): void {
    // TODO: get full collection for transferring ownership or add users to collection search item
    // this._collectionsFacade.getById(collection.Id);

    if (entity) {
      this._collaboratorsDialogService
        .openTransferOwnershipDialog({
          entity,
        })
        .pipe(
          filter((result) => result?.Id > 0),
          switchMap((user) =>
            this.store.dispatch(
              new CollectionsActions.TransferOwner(entity, user.Id)
            )
          ),
          untilDestroyed(this)
        )
        .subscribe({ next: () => this.handleSearch.next() });
    }
  }
}

@NgModule({
  declarations: [CollectionCardMenuComponent],
  imports: [CommonModule, MatDialogModule, MatMenuModule],
  exports: [CollectionCardMenuComponent],
})
export class CollectionCardMenuComponentModule {}
