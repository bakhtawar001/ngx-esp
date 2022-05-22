import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  NgModule,
} from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { CosButtonModule } from '@cosmos/components/button';
import { CosEmojiMenuModule } from '@cosmos/components/emoji-menu';
import { CosFormFieldModule } from '@cosmos/components/form-field';
import { CosInputModule } from '@cosmos/components/input';
import {
  CreateCollectionDialogData,
  CreateCollectionDialogResult,
} from './models';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'esp-create-collection-dialog',
  templateUrl: './create-collection.dialog.html',
  styleUrls: ['./create-collection.dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateCollectionDialog {
  public createForm = this.getFormGroup();

  constructor(
    private _cd: ChangeDetectorRef,
    private _fb: FormBuilder,
    private _dialogRef: MatDialogRef<
      CreateCollectionDialog,
      CreateCollectionDialogResult
    >,
    @Inject(MAT_DIALOG_DATA) private _data: CreateCollectionDialogData
  ) {}

  private getFormGroup() {
    return this._fb.group({
      Emoji: this._data?.collection?.Emoji || ':package:',
      Name: ['New Collection', Validators.required],
      Description: this._data?.collection?.Description || '',
    });
  }

  public changeEmoji(emoji: { newValue: string }): void {
    this.createForm.controls.Emoji.setValue(emoji.newValue);
    this._cd.markForCheck();
  }

  public submitForm() {
    this._dialogRef.close(this.createForm.value);
  }
}

@NgModule({
  declarations: [CreateCollectionDialog],
  imports: [
    FormsModule,
    ReactiveFormsModule,

    MatDialogModule,

    CosButtonModule,
    CosEmojiMenuModule,
    CosFormFieldModule,
    CosInputModule,
  ],
})
export class CreateCollectionDialogModule {}
