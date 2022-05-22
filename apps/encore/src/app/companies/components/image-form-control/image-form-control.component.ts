import { CommonModule } from '@angular/common';
import { Component, Input, NgModule } from '@angular/core';
import { CosButtonModule } from '@cosmos/components/button';
import { CosCardModule } from '@cosmos/components/card';
import { NgxDropzoneModule } from 'ngx-dropzone';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'esp-image-form-control',
  templateUrl: './image-form-control.component.html',
  styleUrls: ['./image-form-control.component.scss'],
})
export class ImageFormControlComponent {
  @Input() width = '100%';
  @Input() height = '100%';

  files: File[] = [];
  img = 'https://commonmedia.asicentral.com/supplierlogos/7730/logo.png';

  public removeImage() {
    this.img = '';
  }

  public onSelect(event) {
    this.files.push(...event.addedFiles);
  }

  public onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
  }
}

@NgModule({
  declarations: [ImageFormControlComponent],
  imports: [CommonModule, NgxDropzoneModule, CosButtonModule, CosCardModule],
  exports: [ImageFormControlComponent],
})
export class ImageFormControlComponentModule {}
