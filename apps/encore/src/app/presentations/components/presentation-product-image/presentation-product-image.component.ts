import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
import { CosButtonModule } from '@cosmos/components/button';
import { CosImageUploadFormModule } from '@cosmos/components/image-upload-form';
import { ProductImageComponentModule } from '@smartlink/products';

@Component({
  selector: 'esp-presentation-product-image',
  templateUrl: './presentation-product-image.component.html',
  styleUrls: ['./presentation-product-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresentationProductImageComponent {
  @Input() image: string | null = null;

  selectImage() {
    // update state and add image to list of files
  }
}

@NgModule({
  declarations: [PresentationProductImageComponent],
  imports: [
    CommonModule,
    CosButtonModule,
    CosImageUploadFormModule,
    ProductImageComponentModule,
  ],
  exports: [PresentationProductImageComponent],
})
export class PresentationProductImageComponentModule {}
