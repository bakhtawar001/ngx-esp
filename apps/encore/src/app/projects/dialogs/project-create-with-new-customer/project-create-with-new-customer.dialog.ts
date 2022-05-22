import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  NgModule,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  AsiProjectCreateCustomerFormModule,
  AsiProjectFormModule,
} from '@asi/projects/ui/feature-forms';
import { CosButtonModule } from '@cosmos/components/button';
import {
  CosDialogModule,
  DialogCloseStrategy,
} from '@cosmos/components/dialog';
import { FormStatus } from '@cosmos/components/form-field';
import { CosTrackerModule } from '@cosmos/components/tracker';
import { CompanyFormModel } from '@asi/company/ui/feature-core';
import { ProjectDetailsForm } from '@esp/projects';
import { UntilDestroy } from '@ngneat/until-destroy';
import {
  ProjectCreateWithNewCustomerDialogData,
  ProjectCreateWithNewCustomerDialogResult,
} from './models';

@UntilDestroy()
@Component({
  selector: 'esp-project-create-customer',
  templateUrl: './project-create-with-new-customer.dialog.html',
  styleUrls: ['./project-create-with-new-customer.dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCreateWithNewCustomerDialog {
  readonly dialogCloseStrategy = DialogCloseStrategy.BACKDROP_CLICK;

  customerFormStatus: FormStatus = null;
  projectFormStatus: FormStatus = null;

  currentStep = 1;
  canGoNext = false;

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly dialogRef: MatDialogRef<
      ProjectCreateWithNewCustomerDialog,
      ProjectCreateWithNewCustomerDialogResult
    >,
    @Inject(MAT_DIALOG_DATA)
    public readonly data: ProjectCreateWithNewCustomerDialogData
  ) {}

  onCustomerFormStatusChange(status: FormStatus): void {
    this.data.step.markAsDirty(!status.dirty);
    this.customerFormStatus = status;
  }

  onCustomerFormValueChange(value: CompanyFormModel): void {
    this.data.input.customer = value;
  }

  onProjectFormValueChange(value: ProjectDetailsForm): void {
    this.data.input.project = value;
  }

  onProjectFormStatusChange(status: FormStatus): void {
    this.projectFormStatus = status;
  }

  goToStep(step: number = 2): void {
    this.currentStep = step;
  }

  onPreviousStep(): void {
    if (this.currentStep === 1) {
      this.dialogRef.close({
        data: this.data.input,
        action: 'previous',
      });
    } else {
      this.goToStep(1);
    }
  }

  submit(): void {
    this.dialogRef.close({
      data: {
        project: this.data.input.project,
        customer: this.data.input.customer,
      },
      action: 'next',
    });
  }
}

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    CosDialogModule,
    CosTrackerModule,
    AsiProjectCreateCustomerFormModule,
    AsiProjectFormModule,
    CosButtonModule,
  ],
  declarations: [ProjectCreateWithNewCustomerDialog],
  exports: [ProjectCreateWithNewCustomerDialog],
})
export class ProjectCreateWithNewCustomerDialogModule {}
