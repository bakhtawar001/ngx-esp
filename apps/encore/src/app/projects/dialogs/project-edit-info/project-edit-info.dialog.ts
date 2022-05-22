import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  NgModule,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { AsiProjectFormModule } from '@asi/projects/ui/feature-forms';
import { ConfirmDialogService } from '@asi/ui/feature-core';
import { CosButtonModule } from '@cosmos/components/button';
import {
  CosDialogModule,
  DialogCloseStrategy,
  DialogWithDirtyCheck,
} from '@cosmos/components/dialog';
import { CosFormFieldModule, FormStatus } from '@cosmos/components/form-field';
import { CosInputModule } from '@cosmos/components/input';
import { Project } from '@esp/models';
import { ProjectDetailsForm } from '@esp/projects';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { ProjectEditInfoLocalState } from './project-edit-info.local-state';
import { ProjectEditInfoPresenter } from './project-edit-info.presenter';

@UntilDestroy()
@Component({
  selector: 'esp-project-edit-info-dialog',
  templateUrl: 'project-edit-info.dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProjectEditInfoPresenter, ProjectEditInfoLocalState],
})
export class ProjectEditInfoDialog extends DialogWithDirtyCheck<ProjectEditInfoDialog> {
  readonly dialogCloseStrategy = DialogCloseStrategy.BACKDROP_CLICK;

  formData: ProjectDetailsForm;
  formStatus: FormStatus;

  constructor(
    private readonly confirmService: ConfirmDialogService,
    @Inject(MAT_DIALOG_DATA) private readonly data: Project,
    dialogRef: MatDialogRef<ProjectEditInfoDialog>,
    private readonly presenter: ProjectEditInfoPresenter,
    private readonly state: ProjectEditInfoLocalState
  ) {
    super(dialogRef);
    this.formData = this.presenter.parseToForm(this.data);
  }

  onFormStatusChange(status: FormStatus): void {
    this.formStatus = status;
  }

  onFormValueChange(value: ProjectDetailsForm): void {
    this.formData = value;
  }

  onSubmit(): void {
    if (!this.formStatus?.valid || this.formStatus?.submitted) {
      return;
    }

    this.state.update(this.presenter.parseToProject(this.formData, this.data));
    this.dialogRef.close();
  }

  protected isDirty(): boolean {
    return this.formStatus?.dirty;
  }

  protected confirmLeave(): Observable<boolean> {
    return this.confirmService.confirmDiscardChanges();
  }
}

@NgModule({
  declarations: [ProjectEditInfoDialog],
  imports: [
    CommonModule,
    AsiProjectFormModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatDatepickerModule,
    CosButtonModule,
    CosInputModule,
    CosFormFieldModule,
    CosDialogModule,
  ],
})
export class ProjectEditInfoDialogModule {}
