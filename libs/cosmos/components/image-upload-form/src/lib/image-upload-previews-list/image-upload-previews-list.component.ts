import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  NgModule,
  Output,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCardModule } from '@cosmos/components/card';

@Component({
  selector: 'cos-image-upload-previews-list',
  templateUrl: './image-upload-previews-list.component.html',
  styleUrls: ['./image-upload-preview-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CosImageUploadPreviewsListComponent {
  @Input() imgClass = '';
  @Input() size: 'sm' | null = null;
  @Input() files: any[] = [];
  @Input() showMaxPreviews = 4;
  @Output() imgRemoved = new EventEmitter<string>();

  @ContentChild('userProviedPreviewControls')
  userProvidedPreviewControls?: TemplateRef<any>;

  @ContentChild('userProvidedImg')
  userProvidedImg?: TemplateRef<any>;

  previewsHidden = true;

  get shownFiles() {
    return this.files?.length > this.showMaxPreviews && this.previewsHidden
      ? this.files.slice(0, this.showMaxPreviews)
      : this.files;
  }

  togglePreviews() {
    this.previewsHidden = !this.previewsHidden;
  }

  removeImage(file: string) {
    this.imgRemoved.emit(file);
  }
}

@NgModule({
  declarations: [CosImageUploadPreviewsListComponent],
  imports: [CommonModule, CosButtonModule, CosCardModule],
  exports: [CosImageUploadPreviewsListComponent],
})
export class CosImageUploadPreviewsListModule {}
