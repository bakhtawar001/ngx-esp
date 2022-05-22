import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  NgModule,
  OnInit,
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
import { CosButtonModule } from '@cosmos/components/button';
import { CosCardModule } from '@cosmos/components/card';
import { CosCheckboxModule } from '@cosmos/components/checkbox';
import {
  CosDialogModule,
  DialogWithDirtyCheck,
} from '@cosmos/components/dialog';
import { CosRadioModule } from '@cosmos/components/radio';
import { trackItem } from '@cosmos/core';
import { FormBuilder } from '@cosmos/forms';
import { AccessLevel, AccessType, Collaborator, Shareable } from '@esp/models';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AsiCollaboratorListItemComponentModule } from '../../components';
import { collaborationOptions } from '../../configs';
import {
  AsiManageCollaboratorsPresenter,
  UserItem,
} from './manage-collaborators.presenter';
import {
  ManageCollaboratorsDialogData,
  ManageCollaboratorsDialogResult,
} from './models';

@UntilDestroy()
@Component({
  selector: 'asi-manage-collaborators-dialog',
  templateUrl: './manage-collaborators.dialog.html',
  styleUrls: ['./manage-collaborators.dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AsiManageCollaboratorsPresenter],
})
export class AsiManageCollaboratorsDialog
  extends DialogWithDirtyCheck<AsiManageCollaboratorsDialog>
  implements OnInit
{
  readonly collaborationOptions = collaborationOptions;
  readonly trackByFn = trackItem<Collaborator>(['UserId']);

  allowEditingForm = this._presenter.allowEditingForm;
  collaboratorForm = this._presenter.collaboratorForm;
  entity!: Shareable;
  excludeList = '';
  newCollaboratorForm = this._presenter.newCollaboratorForm;
  onlyReadWrite!: boolean;

  constructor(
    private readonly _confirmService: ConfirmDialogService,
    @Inject(MAT_DIALOG_DATA)
    private readonly _data: ManageCollaboratorsDialogData,
    private readonly _dialog: MatDialog,
    private readonly _dialogRef: MatDialogRef<
      AsiManageCollaboratorsDialog,
      ManageCollaboratorsDialogResult
    >,
    private readonly _fb: FormBuilder,
    private readonly _presenter: AsiManageCollaboratorsPresenter
  ) {
    super(_dialogRef);

    this.entity = _data.entity;
    this.onlyReadWrite = _data.isOnlyReadWrite;
    this.excludeList = `${this.entity.OwnerId}`;
  }

  get accessLevel(): AccessLevel {
    return this.collaboratorForm.controls.AccessLevel?.value as AccessLevel;
  }

  get collaborators(): Collaborator[] {
    return this.collaboratorForm.controls.Collaborators
      ?.value as Collaborator[];
  }

  ngOnInit(): void {
    this._presenter.initAllowEditingForm(this.entity);
    this._presenter.initCollaboratorForm(this.entity);
    this.initNewCollaborator();
    this.refreshExcludeList();
  }

  removeCollaborator(collaborator: Collaborator): void {
    this._presenter.removeCollaborator(collaborator);

    this.refreshExcludeList();
  }

  save(): void {
    const result = this.collaboratorForm.value;

    this._dialogRef.close({
      ...result,
      Access: this._presenter.mapAccessList(result),
      Collaborators: this._presenter.mapCollaborators(result),
    });
  }

  setAccessType(
    accessType: AccessType,
    collaborator: Collaborator,
    index: number
  ): void {
    this._presenter.setAccessType(accessType, collaborator, index);
  }

  protected confirmLeave(): Observable<boolean> {
    return this._confirmService.confirmDiscardChanges() as Observable<boolean>;
  }

  protected isDirty(): boolean {
    return this.collaboratorForm.dirty;
  }

  private addNewCollaborator(userOrTeam: UserItem): void {
    this._presenter.addNewCollaborator(userOrTeam, this.onlyReadWrite);

    this.refreshExcludeList();
  }

  private initNewCollaborator(): void {
    this.newCollaboratorForm.valueChanges
      .pipe(filter(Boolean), untilDestroyed(this))
      .subscribe((value) => {
        this.addNewCollaborator(value);
      });
  }

  private refreshExcludeList(): void {
    this.excludeList = this._presenter.refreshExcludeList(this.entity);
  }
}

@NgModule({
  declarations: [AsiManageCollaboratorsDialog],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AsiCollaboratorListItemComponentModule,
    AsiUserTeamAutocompleteComponentModule,

    MatDialogModule,

    CosButtonModule,
    CosCardModule,
    CosCheckboxModule,
    CosRadioModule,
    CosDialogModule,
  ],
})
export class AsiManageCollaboratorsDialogModule {}
