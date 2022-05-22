import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  Input,
  NgModule,
  OnInit,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCardModule } from '@cosmos/components/card';
import { CosImageUploadFormModule } from '@cosmos/components/image-upload-form';
import { CosInputModule } from '@cosmos/components/input';
import { CosToastService } from '@cosmos/components/notification';
import { FormControl, FormControlComponent } from '@cosmos/forms';
import { FilesService, FileType } from '@esp/files';
import { MediaLink } from '@esp/models';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { isEqual } from 'lodash-es';
import { distinctUntilChanged } from 'rxjs/operators';

@UntilDestroy()
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'image-upload-form',
  styleUrls: ['./image-upload.form.scss'],
  templateUrl: './image-upload.form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EspImageUploadForm),
      multi: true,
    },
  ],
})
export class EspImageUploadForm
  extends FormControlComponent<MediaLink | string>
  implements ControlValueAccessor, OnInit
{
  @Input() size: 'sm' | null = null;
  @Input() fileType: FileType;
  @Input() maxFileBytes: number;
  @Input() width = '100%';
  @Input() height = '100%';
  @Input() fileProperty: 'FileUrl' | null = null;
  @Input() acceptedFileTypes = 'image/jpeg,image/jpg,image/png,image/gif';
  @Input() allowMultipleUploads = false;

  fileSizeDisplay: string;

  constructor(
    private readonly _cdr: ChangeDetectorRef,
    private readonly _files: FilesService,
    private readonly _toastService: CosToastService
  ) {
    super();
  }

  override ngOnInit() {
    super.ngOnInit();
    this.fileSizeDisplay = `${this.maxFileBytes / Math.pow(1024, 2)}MB`;

    this.control.valueChanges
      .pipe(distinctUntilChanged(isEqual), untilDestroyed(this))
      .subscribe({
        next: (value) => this._cdr.markForCheck(),
      });
  }

  onSelected(selectedFile): void {
    this._files
      .uploadFile(selectedFile, this.fileType)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res) => {
          // if (res.type == HttpEventType.UploadProgress) {
          //   const percentDone = Math.round((100 * res.loaded) / res.total);
          //   console.log(`File is ${percentDone}% loaded.`);
          // } else if (res instanceof HttpResponse) {
          //   console.log('File is completely loaded!');
          //   this.setLogo(res.body[0].FileUrl);
          // }
          if (res instanceof HttpResponse) {
            this.control.markAsDirty();
            this.control.setValue(
              this.fileProperty ? res.body[0][this.fileProperty] : res.body[0]
            );
          }
        },
        error: (err) => {
          this._toastService.error(
            'Image cannot be saved',
            'Your profile image was not able to be saved.'
          );
          console.log('Upload Error:', err);
        },
      });
  }

  registerOnChange: (value: string) => void = () => '';
  registerOnTouched: () => void = () => '';
  writeValue: () => void = () => '';

  remove() {
    this.control.markAsDirty();
    this.control.setValue(null);
  }

  protected override createForm(): FormControl<MediaLink | string> {
    return this._fb.control<MediaLink | string>(null);
  }
}

@NgModule({
  declarations: [EspImageUploadForm],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CosButtonModule,
    CosCardModule,
    CosInputModule,
    CosImageUploadFormModule,
  ],
  exports: [EspImageUploadForm],
})
export class EspImageUploadFormModule {}
