import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CosButtonModule } from '@cosmos/components/button';
import { CosDialogModule } from '@cosmos/components/dialog';
import { CosFormFieldModule } from '@cosmos/components/form-field';
import { CosInputModule } from '@cosmos/components/input';
import { ProjectCloseDialogResult } from './models/dialog.model';

@Component({
  selector: 'esp-project-close-dialog',
  templateUrl: 'project-close.dialog.html',
  styleUrls: ['./project-close.dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCloseDialog {
  readonly resolutionOptions = ['Completed', 'Lost'];
  formGroup = this.fb.group({
    Note: '',
    Resolution: this.resolutionOptions[0],
  });

  constructor(
    private readonly dialogRef: MatDialogRef<
      ProjectCloseDialog,
      ProjectCloseDialogResult
    >,
    private readonly fb: FormBuilder
  ) {}

  close(): void {
    this.dialogRef.close(this.formGroup.value);
  }
}

@NgModule({
  declarations: [ProjectCloseDialog],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CosButtonModule,
    CosInputModule,
    CosFormFieldModule,
    CosDialogModule,
  ],
})
export class ProjectCloseDialogModule {}
