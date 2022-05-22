import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  NgModule,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  AsiUserTeamAutocompleteComponentModule,
  ConfirmDialogService,
} from '@asi/ui/feature-core';
import { InitialsPipeModule } from '@cosmos/common';
import { CosAvatarModule } from '@cosmos/components/avatar';
import { CosButtonModule } from '@cosmos/components/button';
import {
  CosConfirmDialog,
  CosConfirmDialogModule,
} from '@cosmos/components/confirm-dialog';
import { DialogWithDirtyCheck } from '@cosmos/components/dialog';
import { FormControl } from '@cosmos/forms';
import { EspAuthModule } from '@esp/auth';
import { User } from '@esp/autocomplete';
import { CollectionsActions } from '@esp/collections';
import { Collaborator } from '@esp/models';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngxs/store';
import { firstValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  TransferOwnershipDialogData,
  TransferOwnershipDialogResult,
} from './models';

@UntilDestroy()
@Component({
  selector: 'asi-transfer-ownership-dialog',
  templateUrl: './transfer-ownership.dialog.html',
  styleUrls: ['./transfer-ownership.dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsiTransferOwnershipDialog extends DialogWithDirtyCheck<AsiTransferOwnershipDialog> {
  newOwner = new FormControl<User>();
  owner!: Collaborator;

  ownershipIsBeingTransferred = false;

  get newOwnerSelected() {
    return !!this.newOwner.value;
  }

  constructor(
    private readonly _confirmService: ConfirmDialogService,
    private readonly _dialog: MatDialog,
    private readonly _dialogRef: MatDialogRef<
      AsiTransferOwnershipDialog,
      TransferOwnershipDialogResult
    >,
    private readonly _ref: ChangeDetectorRef,
    private readonly _store: Store,
    @Inject(MAT_DIALOG_DATA) public readonly data: TransferOwnershipDialogData
  ) {
    super(_dialogRef);

    this.owner = this.getOwner();
  }

  async transfer(): Promise<void> {
    if (await this.notSureAboutTransferringOwnership()) {
      return;
    }

    if (this.shouldBailoutToLegacyBehavior()) {
      this._dialogRef.close(this.newOwner.value);
    } else {
      this.ownershipIsBeingTransferred = true;
      // We should manually `detectChanges()` since we're inside a microtask and the view isn't dirty.
      this._ref.detectChanges();

      this._store
        .dispatch(
          new CollectionsActions.TransferOwner(
            this.data.entity,
            this.newOwner.value.Id
          )
        )
        .pipe(untilDestroyed(this))
        .subscribe({
          complete: () => {
            this._dialogRef.close();
          },
        });
    }
  }

  imgError(event: ErrorEvent): void {
    const target = <HTMLImageElement>event.target;
    target.style.display = 'none';
    target.onerror = null;
  }

  protected override confirmLeave(): Observable<boolean> {
    return this._confirmService
      .confirmDiscardChanges()
      .pipe(map((res) => !!res));
  }

  protected override isDirty(): boolean {
    return this.newOwnerSelected;
  }

  private getOwner(): Collaborator {
    // @TODO for now we have to check if "IsTeam" flag is visible on the "Owner", otherwise get owner from collaborators
    // eslint-disable-next-line no-prototype-builtins
    if (
      this.data?.entity?.Owner &&
      this.data?.entity?.Owner.hasOwnProperty('IsTeam')
    ) {
      return this.data.entity.Owner;
    }

    const owner = this.data?.entity?.Collaborators?.find(
      (user) => user.UserId === this.data.entity.OwnerId
    );

    return (owner || this.data?.entity?.Collaborators?.[0]) as Collaborator;
  }

  private async notSureAboutTransferringOwnership(): Promise<boolean> {
    const dialog = this._dialog.open(CosConfirmDialog, {
      minWidth: '600px',
      width: '600px',
      data: {
        message: `Are you sure you want to change ownership? Access level of ${this.owner?.Name} will be impacted.`,
        confirm: 'Yes, change ownership',
        cancel: "No, I don't want to change ownership",
      },
    });

    const sure = await firstValueFrom(
      dialog.afterClosed().pipe(untilDestroyed(this))
    );

    return !sure;
  }

  private shouldBailoutToLegacyBehavior(): boolean {
    // See `dialogs/transfer-ownership/models/dialog.model.ts` which has a description of this property.
    return !this.data.shouldBlockUntilTheOwnerIsTransferred;
  }
}

@NgModule({
  declarations: [AsiTransferOwnershipDialog],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    MatDialogModule,

    EspAuthModule,

    CosAvatarModule,
    CosButtonModule,
    CosConfirmDialogModule,

    InitialsPipeModule,

    AsiUserTeamAutocompleteComponentModule,
  ],
})
export class AsiTransferOwnershipDialogModule {}
