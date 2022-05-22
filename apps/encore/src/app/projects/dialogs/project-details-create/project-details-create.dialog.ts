import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  NgModule,
  Optional,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { AsiProjectFormModule } from '@asi/projects/ui/feature-forms';
import { CosButtonModule } from '@cosmos/components/button';
import {
  CosDialogModule,
  DialogCloseStrategy,
} from '@cosmos/components/dialog';
import { FormStatus } from '@cosmos/components/form-field';
import { ProjectDetailsForm } from '@esp/projects';
import { UntilDestroy } from '@ngneat/until-destroy';
import {
  ProjectDetailsCreateDialogData,
  ProjectDetailsCreateDialogResult,
} from './models';

@UntilDestroy()
@Component({
  selector: 'esp-project-details-create-dialog',
  templateUrl: './project-details-create.dialog.html',
  styleUrls: ['./project-details-create.dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDetailsCreateDialog {
  readonly dialogCloseStrategy = DialogCloseStrategy.BACKDROP_CLICK;

  projectDetails: ProjectDetailsForm = null;
  status: FormStatus = null;

  constructor(
    private readonly dialogRef: MatDialogRef<
      ProjectDetailsCreateDialog,
      ProjectDetailsCreateDialogResult
    >,
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    public readonly data: ProjectDetailsCreateDialogData
  ) {
    this.projectDetails = data?.input;
  }

  onFormValueChange(payload: ProjectDetailsForm): void {
    this.projectDetails = payload;
  }

  onFormStatusChange(status: FormStatus): void {
    this.status = status;
  }

  onNextStep(): void {
    this.dialogRef.close({
      data: this.projectDetails,
      action: 'next',
    });
  }

  onPreviousStep(): void {
    this.dialogRef.close({
      data: this.projectDetails,
      action: 'previous',
    });
  }
}

@NgModule({
  declarations: [ProjectDetailsCreateDialog],
  exports: [ProjectDetailsCreateDialog],
  imports: [
    CommonModule,
    CosButtonModule,
    CosDialogModule,
    MatDialogModule,
    AsiProjectFormModule,
    ReactiveFormsModule,
  ],
})
export class ProjectDetailsCreateDialogModule {}
