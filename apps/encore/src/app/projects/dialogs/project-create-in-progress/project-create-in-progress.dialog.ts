import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  NgModule,
  OnInit,
} from '@angular/core';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Project } from '@esp/models';
import { ProjectActions } from '@esp/projects';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Actions, ofActionCompleted, Store } from '@ngxs/store';
import { first } from 'rxjs/operators';
import {
  ProjectCreateInProgressDialogData,
  ProjectCreateInProgressDialogResult,
} from './models';

@UntilDestroy()
@Component({
  selector: 'esp-project-create-in-progress-dialog',
  templateUrl: './project-create-in-progress.dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCreateInProgressDialog implements OnInit {
  constructor(
    private _dialogRef: MatDialogRef<
      ProjectCreateInProgressDialog,
      ProjectCreateInProgressDialogResult
    >,
    @Inject(MAT_DIALOG_DATA)
    public readonly data: ProjectCreateInProgressDialogData,
    private readonly actions: Actions,
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    this.createProject(this.data.input.project, this.data.input.productIds);
    this.listenForCompletion();
  }

  private createProject(project: Project, productIds: number[]): void {
    this.store.dispatch(new ProjectActions.CreateProject(project, productIds));
    this.data.step.markAsDirty(true);
  }

  private listenForCompletion(): void {
    this.actions
      .pipe(
        ofActionCompleted(ProjectActions.CreateProject),
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

  finish(): void {
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
  declarations: [ProjectCreateInProgressDialog],
  exports: [ProjectCreateInProgressDialog],
})
export class ProjectCreateInProgressDialogModule {}
