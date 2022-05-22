import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  NgModule,
  Output,
} from '@angular/core';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCardModule } from '@cosmos/components/card';
import {
  CosCheckboxChange,
  CosCheckboxModule,
} from '@cosmos/components/checkbox';
import { CosImageUploadFormModule } from '@cosmos/components/image-upload-form';
import { PresentationMedia } from '@esp/models';

@Component({
  selector: 'esp-presentation-product-images',
  templateUrl: './presentation-product-images.component.html',
  styleUrls: ['./presentation-product-images.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresentationProductImagesComponent {
  @Input() images: PresentationMedia[];
  @Input() uploadedImages: string[];
  @Input() maxPreviewSize = 4;

  @Output()
  imagesChange = new EventEmitter<PresentationMedia[]>();

  previewsHidden = true;

  get visibleImages() {
    return this.images?.length > this.maxPreviewSize && this.previewsHidden
      ? this.images.slice(0, this.maxPreviewSize)
      : this.images;
  }

  get allVisible() {
    return (
      this.images?.length ===
      this.images?.filter((image) => image.IsVisible)?.length
    );
  }

  toggleVisible(image: PresentationMedia): void {
    image.IsVisible = !image.IsVisible;
    this.imagesChange.emit(this.images);
  }

  toggleAll(event: CosCheckboxChange) {
    this.images = [
      ...this.images.map((image) => ({ ...image, IsVisible: event.checked })),
    ];
    this.imagesChange.emit(this.images);
  }

  togglePreviews() {
    this.previewsHidden = !this.previewsHidden;
  }
}

@NgModule({
  declarations: [PresentationProductImagesComponent],
  imports: [
    CommonModule,
    CosButtonModule,
    CosCardModule,
    CosImageUploadFormModule,
    CosCheckboxModule,
  ],
  exports: [PresentationProductImagesComponent],
})
export class PresentationProductImagesComponentModule {}
