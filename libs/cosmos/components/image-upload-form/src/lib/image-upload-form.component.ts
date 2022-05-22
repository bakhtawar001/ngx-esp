import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BytesPipe } from '@cosmos/common';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';

@Component({
  selector: 'cos-image-upload-form',
  templateUrl: './image-upload-form.component.html',
  styleUrls: ['./image-upload-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CosImageUploadFormComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CosImageUploadFormComponent),
      multi: true,
    },
    BytesPipe,
  ],
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    '[class.cos-image-upload--small]': "size==='sm'",
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosImageUploadFormComponent {
  errors: string[] | null = null;
  error_msgs: Record<string, (t?: string) => string> = {
    size: () => `File size exceeds ${this._bytes.transform(this.maxFileBytes)}`,
    type: () => 'File type not supported',
  };

  @Input() allowMultipleUploads = true;
  @Input() acceptedFileTypes = '*';
  @Input() files: string[] = [];
  // @TODO: strict mode (currently set for 0)
  @Input() maxFileBytes = 0;
  @Input() size: 'sm' | null = null;
  @Output() imgSelected = new EventEmitter<File[]>();
  @Output() fileRejected = new EventEmitter<File[]>();

  constructor(private _bytes: BytesPipe, private _elementRef: ElementRef) {}

  get fileTypes() {
    return this.acceptedFileTypes
      .split(',')
      .map((type) => type.replace('image/', '.'));
  }

  handleFileErrors({ rejectedFiles }: NgxDropzoneChangeEvent) {
    const filetype: string =
      rejectedFiles[0]?.name?.match(/\.[0-9a-z]+$/i)?.[0] || 'file';

    // @TODO: strict mode (add any type for file)
    this.errors = rejectedFiles.map((file: any) =>
      this.error_msgs[file.reason](filetype)
    );

    this.fileRejected.emit(rejectedFiles);
  }

  onSelect(event: NgxDropzoneChangeEvent) {
    if (event.rejectedFiles.length) {
      this.handleFileErrors(event);
      return;
    }
    this.errors = null;

    this.imgSelected.emit(event?.addedFiles);
  }

  validate() {
    return Boolean(this.errors?.length);
  }
}
