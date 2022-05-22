import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CosButtonModule } from '@cosmos/components/button';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { CosCardModule } from '@cosmos/components/card';
import { CosImageUploadFormComponent } from './image-upload-form.component';

@NgModule({
  declarations: [CosImageUploadFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDropzoneModule,
    CosButtonModule,
    CosCardModule,
  ],
  exports: [CosImageUploadFormComponent],
})
export class CosImageUploadFormModule {}
