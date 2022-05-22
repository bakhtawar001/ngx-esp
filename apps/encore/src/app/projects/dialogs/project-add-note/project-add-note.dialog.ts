import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { CosButtonModule } from '@cosmos/components/button';
import { CosFormFieldModule } from '@cosmos/components/form-field';
import { CosInputModule } from '@cosmos/components/input';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'esp-project-add-note-dialog',
  templateUrl: 'project-add-note.dialog.html',
  styleUrls: ['./project-add-note.dialog.scss'],
})
export class ProjectAddNoteDialog {}

@NgModule({
  declarations: [ProjectAddNoteDialog],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatDatepickerModule,
    CosButtonModule,
    CosInputModule,
    CosFormFieldModule,
  ],
})
export class ProjectAddNoteDialogModule {}
