import { Component, OnInit } from '@angular/core';
import { NgxDropzonePreviewComponent } from 'ngx-dropzone';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'cos-dropzone-preview',
  template: ` <ng-content select="ngx-dropzone-label"></ng-content> `,
  styleUrls: ['./cos-dropzone-preview.component.scss'],
  providers: [
    {
      provide: NgxDropzonePreviewComponent,
      useExisting: CosDropzonePreviewComponent,
    },
  ],
})
export class CosDropzonePreviewComponent extends NgxDropzonePreviewComponent
  implements OnInit {
  constructor(sanitizer: DomSanitizer) {
    super(sanitizer);
  }

  ngOnInit() {
    if (!this.file) {
      return;
    }
  }
}
