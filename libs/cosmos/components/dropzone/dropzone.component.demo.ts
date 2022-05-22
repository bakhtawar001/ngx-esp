import { Component } from '@angular/core';

@Component({
  selector: 'cos-demo-component',
  template: `<ngx-dropzone class="cos-dropzone" (change)="onSelect($event)">
    <ngx-dropzone-label>
      <div class="cos-dropzone-display">
        <i class="fa fa-cloud-upload-alt"></i>
        <span class="cos-dropzone-upload">Upload</span>
      </div>
    </ngx-dropzone-label>
    <ngx-dropzone-preview
      *ngFor="let f of files"
      [removable]="true"
      (removed)="onRemove(f)"
    >
      <ngx-dropzone-label>{{ f.name }} ({{ f.type }})</ngx-dropzone-label>
    </ngx-dropzone-preview>
  </ngx-dropzone> `,
})
export class CosDropzoneDemoComponent {
  files: File[] = [];

  onSelect(event) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }

  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }
}
