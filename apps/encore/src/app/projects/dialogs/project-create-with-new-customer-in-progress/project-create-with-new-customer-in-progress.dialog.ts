import {
  Component,
  NgModule,
  ChangeDetectionStrategy,
  OnInit,
  Inject,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Actions, ofActionCompleted } from '@ngxs/store';
import {
  ProjectCreateWithNewCustomerInProgressDialogData,
  ProjectCreateWithNewCustomerInProgressDialogResult,
} from './models';
import { ProjectCreateWithNewCustomerActions } from '@esp/projects';
import { first } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ProjectCreateWithNewCustomerLocalState } from './project-create-with-new-customer.local-state';
import { CommonModule } from '@angular/common';

@UntilDestroy()
@Component({
  selector: 'esp-project-create-customer-in-progress',
  templateUrl: './project-create-with-new-customer-in-progress.dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProjectCreateWithNewCustomerLocalState],
})
export class ProjectCreateWithNewCustomerInProgressDialog implements OnInit {
  constructor(
    private _dialogRef: MatDialogRef<
      ProjectCreateWithNewCustomerInProgressDialog,
      ProjectCreateWithNewCustomerInProgressDialogResult
    >,
    @Inject(MAT_DIALOG_DATA)
    public readonly data: ProjectCreateWithNewCustomerInProgressDialogData,
    private readonly actions: Actions,
    readonly state: ProjectCreateWithNewCustomerLocalState
  ) {
    this.state.connect(this);
  }

  ngOnInit(): void {
    this.createProjectWithNewCustomer(this.data);
    this.listenForCompletion();
  }

  private createProjectWithNewCustomer(
    data: ProjectCreateWithNewCustomerInProgressDialogData
  ): void {
    this.state.create({
      customer: data.input.customer,
      project: data.input.project,
      productIds: data.input.productIds,
    });
    this.data.step.markAsDirty(true);
  }

  private listenForCompletion(): void {
    this.actions
      .pipe(
        ofActionCompleted(
          ProjectCreateWithNewCustomerActions.CreateProjectWithNewCustomer
        ),
        first(),
        untilDestroyed(this)
      )
      .subscribe((completion) => {
        if (completion.result.successful) {
          this.finish();
        } else {
          this.fail(completion.result.error);
        }
      });
  }

  private finish(): void {
    this._dialogRef.close({
      data: { success: true, error: null },
      action: 'next',
    });
  }

  fail(error: Error): void {
    this._dialogRef.close({
      data: { success: false, error },
      action: 'previous',
    });
  }
}

@NgModule({
  imports: [CommonModule, MatDialogModule],
  declarations: [ProjectCreateWithNewCustomerInProgressDialog],
  exports: [ProjectCreateWithNewCustomerInProgressDialog],
})
export class ProjectCreateWithNewCustomerInProgressModule {}
